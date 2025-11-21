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
        return a <= 1 ? "x" : `${a}*x`;
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
        console.log("Generated Equation String: ", result);
        let temp = this.ce.parse(result);
        //let temp = this.ce.parse("-6(2x-10)-4x+1=-35")
        //let temp = this.ce.parse("3x+9x+10x=440");
        //let temp = this.ce.parse("5x(4+7)-10x+7x=208");
        //let temp = this.ce.parse("x + 8x - 4=14");
        //let temp = this.ce.parse("4(4x + 3) + 5(3x - 9) + 7x=271"); // BUG: rearranges x terms to the front
        //let temp = this.ce.parse("x+3(x+3)+10x=37"); // BUG: rearranges x terms to the front
        //let temp = this.ce.parse("3x(10-10)-7x+6x=-11"); // BUG: handle zero better
        //let temp = this.ce.parse("-4x+8x-x+8=52") // really bad bug with negate
        //let temp = this.ce.parse("3x(4-6)-5x-3(x+10)+5=-277") // really bad bug that skips over combining x terms
        //let temp = this.ce.parse("9 + x(4 - 6) + x") // incompatible type
        if(!(JSON.stringify(temp).includes("Undefined")||JSON.stringify(temp).includes("Error"))){
            this.setY(temp.subs({x: x}).evaluate());
        } else {
            console.error("Error evaluating equation");
        }
        const expression = JSON.parse(JSON.stringify(temp.toMathJson())) as MathJson;
        const final : MathJson = ['Equal', expression, this.y as string];
        console.log("GENERATION")
        console.log(JSON.parse(JSON.stringify(temp)));
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
    private ce: ComputeEngine;
    public steps: Step[] = [];             //remind me to set it private
    private stepNumber: number = 1;
    public lhs: MathJson|string|number;
    private terms: string[] = [];
    private constants: string[] = [];
    public equation: MathJson;

    constructor(equation: MathJson, computeEngine: ComputeEngine) {
        this.ce = computeEngine;
        if (!Array.isArray(equation) || equation.length < 3) {
            throw new Error("Invalid equation format: expected an array like ['Equal', lhs, rhs]");
        }
        this.equation = equation;
        this.lhs = equation[1] as MathJson;// Equal, lhs, rhs
        this.stepRecursive(this.lhs);
        this.steps.pop(); // remove last step which is the fully simplified equation
        this.stepNumber--;
        // Turn lhs to string and back to MathJson to flatten any nested structures without changing order of terms
        this.lhs = this.ce.box(this.lhs as any, {canonical:false}).toString();
        this.lhs = this.ce.parse(this.lhs as string, {canonical:false}).toMathJson() as unknown as MathJson;

        this.breakDownEquation(this.lhs); // break down lhs into terms and constants and group them into arrays
        this.groupTerms(); // combine x terms with steps
        this.groupConstants(); // combine constant terms with steps
        this.SolveX(); // isolate x with steps
        this.steps.push({ // final step showing solution
            description: `x = ${this.steps[this.steps.length -1].result}`,
            current: this.ce.box(this.equation as any,{canonical:["InvisibleOperator"]}).toLatex(),
            stepNumber: this.stepNumber,
            result: this.ce.box(this.equation[2] as any).toString()
        });
        //console.log("Final Steps: ", this.steps[this.steps.length -1]);
        this.steps.reverse(); // reverse steps to be in correct order when popping

    }
    // get the next step in the solution process
    public getStep(): Step {
        if (this.steps.length === 0) {
            throw new Error("No steps available");
        }
        return this.steps.pop() as Step;
    }
    // get the number of remaining steps
    public getStepsCount(): number {
        return this.steps.length;
    }
    // breaks down the equation into steps
    private breakDownEquation(equationPart: MathJson): void {
        for (let i = 1; i < equationPart.length; i++) {
            if(equationPart[i].toString().includes('x')) {
                this.terms.push(this.ce.box(equationPart[i] as any).toString());
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
        this.terms.reverse(); // reverse for left to right processing
        while (this.terms.length > 1) {
            // Deep copy of current equation state to add to step
            const current = JSON.parse(JSON.stringify(this.equation)) as MathJson;
            // Pop last two terms in the terms array
            const term1 = this.terms.pop();
            const term2 = this.terms.pop();
            const term1WithoutX = term1?.toString().slice(0, -1)? term1?.toString().slice(0, -1) !== '-'?term1?.toString().slice(0, -1):'-1':'1';
            const term2WithoutX = term2?.toString().slice(0, -1)? term2?.toString().slice(0, -1) !== '-'?term2?.toString().slice(0, -1):'-1':'1';
            // Calculate their sum
            const sum = parseInt(term1WithoutX as string ?? '0') + parseInt(term2WithoutX as string) + 'x';
            console.log(`Combining terms: ${term1}, ${term2} to get ${sum}`);
            // Remove spaces and update lhs by replacing the two terms with their sum
            this.lhs = this.ce.box(this.lhs as any, {canonical:["InvisibleOperator"]}).toString().replace(/\s+/g, '');
            this.lhs = this.lhs.replace(term1 as string, sum);
            if(parseInt(term2 as string) < 0){ // if negative, replace with nothing
                this.lhs = this.lhs.replace(term2 as string, '');
            }
            this.lhs = this.lhs.replace(term2 as string, '0');
            this.lhs = this.ce.parse(this.lhs as string, {canonical:["Add"]}).toMathJson() as unknown as MathJson;
            // Update the overarching equation's lhs
            this.equation[1] = this.lhs;
            // Push the sum back to terms array just in case more grouping is needed (because it add 2 terms at a time)
            this.terms.push(sum);
            // Add step to steps array
            this.steps.push({
                description: `Add ${term1}, ${term2}`,
                current: this.ce.box(current as any, {canonical:["InvisibleOperator"]}).toLatex(),
                stepNumber: this.stepNumber++,
                result: sum
            });
        }
        // Update lhs to flattened MathJson
        this.lhs = this.ce.box(this.lhs as any).toMathJson() as unknown as MathJson;
    }
    // groups constants together
    private groupConstants(): void {
        if (!Array.isArray(this.lhs)) return;
        if (this.constants.length <= 1) return;
        this.constants.reverse(); // reverse for left to right processing
        while (this.constants.length > 1) {
            // Deep copy of current equation state to add to step
            const current = JSON.parse(JSON.stringify(this.equation)) as MathJson;
            // Pop last two constants in the constants array
            const constant1 = this.constants.pop() as string;
            const constant2 = this.constants.pop() as string;
            // Calculate their sum
            const sum = parseInt(constant1) + parseInt(constant2)+'';
            // Remove the two constants from lhs and add their sum
            for (let i = 1; i < this.lhs.length; i++) {
                if(this.lhs[i].toString() === constant1 || this.lhs[i].toString() === constant2) {
                    this.lhs.splice(i,1);
                    i--;
                }     
            }
            this.lhs.push(sum);
            // Update the overarching equation's lhs
            this.equation[1] = this.lhs;
            // Push the sum back to constants array just in case more grouping is needed (because it add 2 constants at a time)
            this.terms.push(sum.toString());
            this.steps.push({
                description: `Add ${constant1},${constant2}`,
                current: this.ce.box(current as any,{canonical:["InvisibleOperator"]}).toLatex(),
                stepNumber: this.stepNumber++,
                result: sum
            });
        }
    }

    private SolveX(){ // 
        console.log("equation: " + this.equation);
        var tempEquation = JSON.parse(JSON.stringify(this.equation));
        tempEquation = this.ce.box(tempEquation).toLatex(); 
        console.log("tempEquation: " + tempEquation);
        var lhs = this.ce.box(this.lhs as any).toString(); // this.lhs -> parse -> toString()
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
            const lhsExpr = this.ce.parse(lhs).toMathJson().toString();
            if(lhsExpr[0] === "A"){
                console.log("Ran Addition in SOlvex")
                div = rhs + "-" + lhs.slice(lhs.indexOf("+") + 1) 
                div = this.ce.parse(div);
                currentStep = this.ce.box((div.evaluate()));
                div = div.toMathJson();
                var stepJson = {
                    description:`${div}`,
                    current:tempEquation,
                    stepNumber: this.stepNumber++,
                    result: currentStep.toString()
                }
                rhs = currentStep.toString();
                lhs = lhs.slice(0,lhs.indexOf("+"));
                this.steps.push(stepJson as Step);
                this.equation[1] = lhs;
                this.equation[2] = rhs;
                console.log("Overarching Equation: " + this.ce.box(this.equation.toString()).toLatex());
                tempEquation = this.equation;
                console.log("tempEquation in Add: " + tempEquation);


            }
            else if(lhsExpr[0] === "S"){
                console.log("Subtract SolveX() ran");
                console.log("tempEquation in Sub: " + tempEquation);
                console.log("Overarching Equation: " + this.equation);
                div = rhs + " +" + lhs.slice(lhs.lastIndexOf("-")+ 1);
                div = this.ce.parse(div);
                currentStep = this.ce.box((div.evaluate()));
                div = div.toMathJson();
                var stepJson = {
                    description:`${div}`,
                    current:tempEquation,
                    stepNumber: this.stepNumber++,
                    result: currentStep.toString()
                }
                rhs = currentStep.toString();
                lhs = lhs.slice(0,lhs.lastIndexOf("-"));
                this.steps.push(stepJson as Step);
                this.equation[1] = lhs;
                this.equation[2] = rhs;
                console.log("Overarching Equation: " + this.equation);
                tempEquation = this.equation;
                console.log("tempEquation in Add: " + tempEquation);

            }
            else{
                tempEquation[2] = this.ce.box(tempEquation[2]).evaluate().toMathJson() as unknown as MathJson;
                tempEquation = this.ce.box(tempEquation).toLatex();
                console.log("tempEquation in Final: " + tempEquation);
                div = rhs + "/" + lhs.slice(0,lhs.indexOf("x"));
                if(lhs.includes("-x")){ //for negative x
                    div = rhs + "/" + -1;
                }
                else if(lhs.slice(0,lhs.indexOf("x")) === ""){ // isolated x
                    div = rhs + "/" + 1
                }
                else if(lhs.includes("*")){ // fraction x.       lhs =  4/3 * x + 7 => 5
                    div = this.ce.parse(rhs).toString() + " / (" + lhs.slice(0,lhs.indexOf("*")-1) + ")";
                }
                div = this.ce.parse(div, {canonical:false});
                currentStep = this.ce.box(div.evaluate());
                div = div.toMathJson(); 
                var stepJson = {
                    description:`${div}`,
                    current: tempEquation,
                    stepNumber: this.stepNumber++,
                    result: currentStep.toString()
                }
                console.log("tempEquation in Final: " + tempEquation);
                console.log("Overarching Equation: " + this.equation);
                this.steps.push(stepJson as Step);
                console.log("x is : " + currentStep.toString());
                lhs = "x";
            }
            this.equation[1] = lhs; //Updates the lhs of the expression
            this.equation[2] = this.ce.box(div, {canonical:false}).toMathJson() as unknown as MathJson; //Updates the rhs of the expression
            console.log("LHS Expr: " + this.equation[1]);
            console.log("RHS Expr: " + this.equation[2]);
            console.log("DIV: " + div);
        }
    }

    private stepRecursive(expr: MathJson | string | number): MathJson | string | number {
        if (!Array.isArray(expr)) return expr;

        for (let i = 1; i < expr.length; i++) {
            expr[i] = this.stepRecursive(expr[i]);
        }

        const simplify = (expr.length <= 3 && (((expr[0] === 'Add' || expr[0] === 'Subtract') && expr[1].toString().includes('x') 
            && !expr[2].toString().includes('x')) 
            || (expr[0] === 'Multiply' && expr[2].toString() === 'x') 
            || (expr[0] === 'Negate')));

        if (simplify) {
            return expr;
        } else {
            console.log("Adding step: ", `${expr[0]}, ${JSON.stringify(expr.slice(1))}`);
            this.steps.push({
                description: `${expr[0]} ${this.ce.box(expr as any).toString()}`,
                current: this.ce.box(JSON.parse(JSON.stringify(this.equation)),{canonical:false}).toLatex(),
                stepNumber: this.stepNumber++,
                result: JSON.parse(JSON.stringify(this.ce.box(expr as any).simplify().toMathJson())) as MathJson
            });
        }
        return this.steps[this.stepNumber-2]?.result as MathJson;
    }  
}

/* const compute = new ComputeEngine;
const linearEquationTest = new LinearEquation(3,compute);
console.log("Latex Form: " + linearEquationTest.getEquationLaTeX())
console.log("MathJson Form: " + linearEquationTest.getEquation())
const solver = new EquationSolver(linearEquationTest.getEquation(), compute);
 */

/* 
console.log(solver.steps); */





export { LinearEquation, EquationSolver };
export type { Step, MathJson };