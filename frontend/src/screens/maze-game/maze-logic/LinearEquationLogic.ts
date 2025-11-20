/*
TO-DO: Fix the following issues:
1. For EquationBuilder, adjust the difficulty scaling to ensure that higher difficulty levels consistently produce more complex equations.

2. For EquationSolver, clean up the step descriptions to make them more user-friendly and easier to understand.
    - In EquationSolver, switch from using a recursive to an iterative approach to avoid potential stack overflow 
        // not really an issue (could be for higher complexity equations though)
    - Some steps that the solver generates are not valid like adding (x + 2)
    - The solver stops when the equation is fully simplified, but it should stop when x is isolated.

3. Add error handling because sometimes invalid equations are generated that the ComputeEngine cannot parse.

4. Add unit tests for all classes and methods
*/

import { ComputeEngine } from "@cortex-js/compute-engine";
import type { MathJson, Step } from "../../../types";

// Helper class for random number and operation generation
class RandomUtils {
    // returns a random integer between min and max, inclusive
    static getInt(min:number, max:number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // returns a random operation from the list of operations
    static getOp(min:number, max:number): string {
        const operations = ['+', '-', '*', '/'];
        const resultOperations = operations.slice(min, max);
        return resultOperations[Math.floor(Math.random() * resultOperations.length)];
    }
    // returns true or false randomly
    static yesNo(prob:number): boolean {
        return Math.random() < prob;
    }
}
// Helper class to build different types of equations
class EquationBuilder {
    // a(bx+c)
    // generates equations in the form of a(bx [operation] c) or ax(b [operation] c)
    static parenthesisEquation(): string {
        const a = RandomUtils.getInt(0,5);
        const b = RandomUtils.getInt(1,10);
        const c = RandomUtils.getInt(1,10);
        const op = RandomUtils.getOp(0,2);
        let resultEquation = '';
        // decide randomly between the two forms
        if (RandomUtils.yesNo(.5)) { // form: b(ax [operation] c)
            resultEquation += b == 1 ? "" : `${b}`;
            resultEquation += '(';
            resultEquation += a <= 1? "x" : `${a}x`;
            resultEquation += ` ${op} ${c}`;
            resultEquation += ')';
        } else { // form: ax(b [operation] c)
            resultEquation += a <= 1? "x" : `${a}x`;
            resultEquation += '(';
            resultEquation += `${b}`;
            resultEquation += ` ${op} ${c}`;
            resultEquation += ')';
        }
        if (RandomUtils.yesNo(.3)) { // 30 percent chance an extra constant will be added
            const d = RandomUtils.getInt(1,5);
            resultEquation += ` + ${d}`;
        }
        return resultEquation;
    }
    // a(bx+c)/d
    static complexParenthesisEquation(difficulty:number): string {
        let resultEquation = '';
        resultEquation += this.parenthesisEquation();
        if (RandomUtils.yesNo(.35)&& difficulty > 4) {
            resultEquation = `(${resultEquation}${RandomUtils.getOp(2,4)}${RandomUtils.getInt(1,5)})`;
        }
        return resultEquation;
    }
    // everything/b
    static divisionEquation(currEquation: string): string {
        const resultEquation = `(${currEquation})/${RandomUtils.getInt(2,10)}`;
        return resultEquation;
    }
    // (a/b)x
    static simpleDivisionTerm(): string {
        const a = RandomUtils.getInt(1,10);
        const b = RandomUtils.getInt(1,10);
        return `(${a}/${b})x`;
    }
    // ax
    static simpleTerm(): string {
        const a = RandomUtils.getInt(1,10);
        return a <= 1 ? "x" : `${a}x`;
    }
    // a/b
    static constantDivision(): string {
        const a = RandomUtils.getInt(1,10);
        const b = RandomUtils.getInt(1,10);
        return `(${a}/${b})`;
    }
    // chooses a term type based on difficulty
    static termChooser(difficulty:number): string {
        const choice = RandomUtils.getInt(1,difficulty);
        switch (choice) {
            case 1:
                return this.simpleTerm();
            case 2:
                return `${RandomUtils.getInt(1,10)}`
            case 3:
                return this.complexParenthesisEquation(difficulty);
            case 4:
                return this.simpleDivisionTerm();
            case 5:
                return this.constantDivision();
            default:
                return this.simpleTerm();
        }
    }
}
// Class representing a linear equation
class LinearEquation {
    private ce: ComputeEngine;
    private difficulty: number;
    private x: number;
    private y: string;
    private equation: MathJson;

    constructor(difficulty: number, computeEngine: ComputeEngine) {
        this.ce = computeEngine;
        this.difficulty = difficulty;
        this.y = "";
        this.x = RandomUtils.getInt(1, 20);
        this.equation = this.generateLinearEquation();
    }
    // generates a random linear equation based on difficulty
    private generateLinearEquation(): MathJson {
        let result = ""; // final equation string
        const x = this.x; // x value
        console.log(`For x = ${this.x}`);
        for (let i = 1; i < this.difficulty; i++) {
            result += EquationBuilder.termChooser(this.difficulty);
            result += ` ${RandomUtils.getOp(0,2)} `;
        }
        result += EquationBuilder.simpleTerm();
        if (RandomUtils.yesNo(0.4) && this.difficulty > 3) {
            result = EquationBuilder.divisionEquation(result);
        }
        let temp = this.ce.parse(result);
        //let temp = this.ce.parse("4x(3+7)-4x-4")
        try {
            this.setY(temp.subs({x: x}).evaluate());
        } catch (error) {
            console.error("Error evaluating equation: ", error);
            this.generateLinearEquation(); // regenerate if error occurs
        }
        const expression = JSON.parse(JSON.stringify(temp.toMathJson())) as MathJson;
        const final : MathJson = ['Equal', expression, this.y as string];
        return final;
    }

    private setY(y: any) {
        this.y = y.toString();
    }

    public getY(): string {
        return this.y;
    }

    public getX(): number {
        return this.x;
    }

    // returns the equation in MathJson format
    public getEquation(): MathJson {
        return this.equation;
    }
    // returns the LaTeX representation of the equation
    public getEquationLaTeX(): string {
        return this.ce.box(this.equation as any).toLatex();
    }

    
}
// Solver that breaks down the steps to solve a linear equation
class EquationSolver {
    private computeEngine: ComputeEngine;
    public steps: Step[] = [];             //remind me to set it private
    private stepNumber: number = 1;
    public lhs: MathJson|string|number;
    private terms: string[] = [];
    private constants: string[] = [];
    public equation: MathJson;

    constructor(equation: MathJson, computeEngine: ComputeEngine) {
        this.computeEngine = computeEngine;
        if (!Array.isArray(equation) || equation.length < 3) {
            throw new Error("Invalid equation format: expected an array like ['Equal', lhs, rhs]");
        }
        this.equation = equation;
        this.lhs = equation[1] as MathJson;// Equal, lhs, rhs
        this.stepRecursive(this.lhs);
        this.steps.pop(); // remove last step which is the fully simplified equation
        this.stepNumber--;
        // Turn lhs to string and back to MathJson to flatten any nested structures
        this.lhs = this.computeEngine.box(this.lhs as any, {canonical:false}).toString();
        this.lhs = this.computeEngine.parse(this.lhs as string, {canonical:false}).toMathJson() as unknown as MathJson;

        this.breakDownEquation(this.lhs); // break down lhs into terms and constants and group them into arrays
        this.groupTerms(); // combine x terms with steps
        this.groupConstants(); // combine constant terms with steps
        this.SolveX();
        //this.steps.reverse(); // reverse steps to be in correct order
        console.log("equation: " + this.equation);
        //var temp = this.computeEngine.box(this.lhs as any).toString();
    }
    // get the next step in the solution process
    public getStep(): Step {
        if (this.steps.length === 0) {
            throw new Error("No steps available");
        }
        return this.steps.pop() as Step;
    }

    // breaks down the equation into steps
    private breakDownEquation(equationPart: MathJson): void {
        for (let i = 1; i < equationPart.length; i++) {
            if(equationPart[i].toString().includes('x')) {
                this.terms.push(this.computeEngine.box(equationPart[i] as any).toString());
            }
            else {
                this.constants.push(equationPart[i].toString());
            }
        }
    }
    // groups like terms together
    private groupTerms(): void {
        if (!Array.isArray(this.lhs)) return;
        if (this.terms.length <= 1) return;
        this.terms.reverse();
        while (this.terms.length > 1) {
            const term1 = this.terms.pop();
            const term2 = this.terms.pop();
            const sum = parseInt(term1?.slice(0, -1) as string) + parseInt(term2?.slice(0, -1) as string) + 'x';
            this.lhs = JSON.parse(JSON.stringify(this.computeEngine.parse(this.computeEngine.box(this.lhs as any, {canonical:false}).toLatex().replace(term1 as string, '').replace(term2 as string, sum), {canonical:false}))) as MathJson;
            this.terms.push(sum);
            this.steps.push({
                description: `Add ${term1}, ${term2}`,
                current: this.computeEngine.box(JSON.parse(JSON.stringify(this.equation)),{canonical:false}).toString(),
                stepNumber: this.stepNumber++,
                result: sum
            });
            this.lhs = this.computeEngine.box(this.lhs as any).toMathJson() as unknown as MathJson;
        }
        //this.computeEngine.box(this.lhs as any,{canonical:["InvisibleOperator"]}).toString()
        this.lhs = this.computeEngine.box(this.lhs as any).toMathJson() as unknown as MathJson;
    }
    // groups constants together
    private groupConstants(): void {
        if (!Array.isArray(this.lhs)) return;
        if (this.constants.length <= 1) return;
        this.constants.reverse();
        while (this.constants.length > 1) {
            const current = JSON.parse(JSON.stringify(this.lhs)) as MathJson;
            const constant1 = this.constants.pop() as string;
            const constant2 = this.constants.pop() as string;
            const sum = parseInt(constant1) + parseInt(constant2)+'';
            for (let i = 1; i < this.lhs.length; i++) {
                if(this.lhs[i].toString() === constant1 || this.lhs[i].toString() === constant2) {
                    this.lhs.splice(i,1);
                    i--;
                }     
            }
            this.lhs.push(sum);
            console.log("Updated LHS after combining constants: ")
            console.log(this.lhs);
            this.terms.push(sum.toString());
            this.steps.push({
                description: `Add ${constant1},${constant2}`,
                current: this.computeEngine.box(current as any).toString(),
                stepNumber: this.stepNumber++,
                result: sum
            });
        }
        this.equation[1] = this.lhs;
    }
    //        var temp = this.computeEngine.box(this.lhs as any).toString();

    private SolveX(){ // 
        console.log("equation: " + this.equation);
        var lhs = this.computeEngine.box(this.lhs as any).toString(); // this.lhs -> parse -> toString()
        var rhs = this.equation[2].toString();
        var currentStep;
        var div;
/*         if(lhs != currentStep.toString()){ // Simplification needed
            console.log("Step: Must combine like terms: " + lhs);
            lhs = currentStep.toString();
            var stepJson = {
                description: `${simplify.toMathJson()}`,
                current: simplify.toMathJson(),
                stepNumber: this.stepNumber++,
                result: currentStep.toString()
            }
            this.steps.push(stepJson as Step);
            this.equation[1] = lhs; //Updates the lhs of the expression
            return stepJson as Step;
        } */

        while(lhs != "x"){ // 9x + 8 = 188 -> 9x = 180
            const lhsExpr = this.computeEngine.parse(lhs).toMathJson().toString();
            if(lhsExpr[0] === "A"){
                console.log("Ran Addition in SOlvex")
                div = rhs + "-" + lhs.slice(lhs.indexOf("+") + 1) 
                div = this.computeEngine.parse(div);
                currentStep = this.computeEngine.box((div.evaluate()));
                div = div.toMathJson();
                var stepJson = {
                    description:`${div}`,
                    current:div,
                    stepNumber: this.stepNumber++,
                    result: currentStep.toString()
                }
                rhs = currentStep.toString();
                lhs = lhs.slice(0,lhs.indexOf("+"));
                this.steps.push(stepJson as Step);
                this.equation[1] = lhs;
                this.equation[2] = rhs;
            }
            else if(lhsExpr[0] === "S"){
                console.log("Subtract SolveX() ran");
                div = rhs + " +" + lhs.slice(lhs.lastIndexOf("-")+ 1);
                div = this.computeEngine.parse(div);
                currentStep = this.computeEngine.box((div.evaluate()));
                div = div.toMathJson();
                var stepJson = {
                    description:`${div}`,
                    current:div,
                    stepNumber: this.stepNumber++,
                    result: currentStep.toString()
                }
                rhs = currentStep.toString();
                lhs = lhs.slice(0,lhs.lastIndexOf("-"));
                this.steps.push(stepJson as Step);
                this.equation[1] = lhs;
                this.equation[2] = rhs;
            }
            else{
                div = rhs + "/" + lhs.slice(0,lhs.indexOf("x"));
                if(lhs.includes("-x")){ //for negative x
                    div = rhs + "/" + -1;
                }
                else if(lhs.slice(0,lhs.indexOf("x")) === ""){ // isolated x
                    div = rhs + "/" + 1
                }
                else if(lhs.includes("*")){ // fraction x.       lhs =  4/3 * x + 7 => 5
                    div = this.computeEngine.parse(rhs).toString() + " / (" + lhs.slice(0,lhs.indexOf("*")-1) + ")";
                }
                div = this.computeEngine.parse(div, {canonical:false});
                currentStep = this.computeEngine.box(div.evaluate());
                div = div.toMathJson(); 
                var stepJson = {
                    description:`${div}`,
                    current:div,
                    stepNumber: this.stepNumber++,
                    result: currentStep.toString()
                }
                this.steps.push(stepJson as Step);
                console.log("x is : " + currentStep.toString());
                lhs = "x";
            }
        }
    }

    private stepRecursive(expr: MathJson | string | number): MathJson | string | number {
        if (!Array.isArray(expr)) return expr;

        for (let i = 1; i < expr.length; i++) {
            expr[i] = this.stepRecursive(expr[i]);
        }

        const simplify = (expr.length == 3 && (((expr[0] === 'Add' || expr[0] === 'Subtract') && expr[1].toString().includes('x') 
            && !expr[2].toString().includes('x')) 
            || (expr[0] === 'Multiply' && expr[2].toString() === 'x')));

        if (simplify) {
            return expr;
        } else {
            console.log("Adding step: ", `${expr[0]}, ${JSON.stringify(expr.slice(1))}`);
            this.steps.push({
                description: `${expr[0]} ${this.computeEngine.box(expr as any).toString()}`,
                current: this.computeEngine.box(JSON.parse(JSON.stringify(this.equation)),{canonical:false}).toString(),
                stepNumber: this.stepNumber++,
                result: JSON.parse(JSON.stringify(this.computeEngine.box(expr as any).simplify().toMathJson())) as MathJson
            });
        }
        return this.steps[this.stepNumber-2]?.result as MathJson;
    }  
}

const compute = new ComputeEngine;
const linearEquationTest = new LinearEquation(3,compute);
console.log("Latex Form: " + linearEquationTest.getEquationLaTeX())
console.log("MathJson Form: " + linearEquationTest.getEquation())
const solver = new EquationSolver(linearEquationTest.getEquation(), compute);





console.log(solver.steps);


export { LinearEquation, EquationSolver };
export type { Step, MathJson };