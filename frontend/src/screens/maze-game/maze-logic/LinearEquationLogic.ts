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
type MathJson = number | string | (string | number | MathJson)[];
// Step interface representing each step in the solution process
interface Step {
    description: string;
    current: MathJson;
    stepNumber: number;
    result?: MathJson;
}
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
        this.setY(temp.subs({x: x}).evaluate());
        const expression = temp.toMathJson() as MathJson;
        const final : MathJson = ['Equal', expression, this.y as string];
        return final;
    }

    private setY(y: any) {
        this.y = y.toString();
    }

    public getY(): string {
        return this.y;
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
    private getStepNumber: number = 1;

    constructor(computeEngine: ComputeEngine, equation: MathJson) {
        this.computeEngine = computeEngine;
        if (!Array.isArray(equation) || equation.length < 3) {
            throw new Error("Invalid equation format: expected an array like ['Equal', lhs, rhs]");
        }
        this.stepRecursive(equation);
        this.steps.reverse();
    }
    // get the next step in the solution process

    public getStep(): Step {
        if (this.steps.length === 0) {
            throw new Error("No steps available");
        }

        while(true){
            const arr = this.steps[this.steps.length - 1].description.split(",");
            if(arr.length == 3 && arr[0] == 'Multiply' && !isNaN(Number(arr[1])) && arr[2] == 'x'){
                this.steps.pop();
            }
            else if((arr[0] == 'Add' || arr[0] == 'Subtract') && arr.length == 3 && arr[1].length <=3 && arr[1].includes('x') && !isNaN(Number(arr[2]))){
                this.steps.pop();
            }
            else if(arr[0] == "Negate" && arr.length == 2){
                this.steps.pop();
            }
            else if(arr[0] == "Rational"){
                this.steps.pop();
            }
            else if(arr[0] == 'Equal'){
                var step = this.steps.pop();
                step!.stepNumber = this.getStepNumber; //gets actual Step Number
                this.getStepNumber++;
                this.SolveX(arr);
                return step as Step;
            }
            else{
                var step = this.steps.pop();
                step!.stepNumber = this.getStepNumber; //gets actual Step Number
                this.getStepNumber++;
                return step as Step;
            }
        }  

        //return this.steps.pop() as Step;
    }
    private SolveX(arr: string[]){
        var lhs = arr[1].trim();
        var rhs = arr[2].trim();
        var currentStep = this.computeEngine.box((this.computeEngine.parse(arr[1])).simplify());
        var div;
        if(lhs != currentStep.toString()){ // Simplification needed
            console.log("Step: Must combine like terms: " + lhs);
            console.log("Result: " + currentStep.toString());
            lhs = currentStep.toString();
        }

        while(lhs != "x"){
            const lhsExpr = this.computeEngine.parse(lhs).toMathJson().toString();
            console.log("Parsed lhs: " + lhsExpr)
            if(lhsExpr[0] === "A"){
                div = rhs + "-" + lhs.slice(lhs.indexOf("+") + 1) 
                div = this.computeEngine.parse(div);
                currentStep = this.computeEngine.box((div.evaluate()));
                console.log("current step: " + div)
                div = div.toMathJson();
                var temp = {
                    description:`${div}`,
                    current:div as MathJson,
                    stepNumber: this.getStepNumber,
                    result: currentStep.toMathJson() as MathJson
                }
                console.log(temp)
                rhs = currentStep.toString();
                lhs = lhs.slice(0,lhs.indexOf("+"));
            }
            else if(lhsExpr[0] === "S"){
                div = rhs + " +" + lhs.slice(lhs.lastIndexOf("-")+ 1);
                currentStep = this.computeEngine.box((this.computeEngine.parse(div).evaluate()));
                console.log("current step: " + div)
                rhs = currentStep.toString();
                lhs = lhs.slice(0,lhs.lastIndexOf("-"));

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
                currentStep = this.computeEngine.box((this.computeEngine.parse(div).evaluate()).toString());
                console.log("Final Step: " + div)
                console.log("x is : " + currentStep.toString());
                lhs = "x";
            } 
        }
        return;

    }

    // recursively process the expression to generate steps
    private stepRecursive(expr: MathJson): MathJson {
        if (Array.isArray(expr)) {
            let x = [];
            for (let i = 1; i < expr.length; i++) {
                const temp = this.stepRecursive(expr[i]);
                x.push(temp);
            }
            this.steps.push({
                description: `${expr[0]}, ${x}`,
                current: expr,
                stepNumber: this.stepNumber++,
                result: this.computeEngine.box(expr as any).evaluate().toString()
            });
        }
        else{
            return expr;
        }
        return this.steps[this.stepNumber-2]?.result as MathJson;
    }   
}

const compute = new ComputeEngine;
const linearEquationTest = new LinearEquation(3,compute);
const solver = new EquationSolver(compute,linearEquationTest.getEquation())

console.log("Latex Form: " + linearEquationTest.getEquationLaTeX())
console.log("MathJson Form: " + linearEquationTest.getEquation())
console.log("Expand: " + compute.parse(linearEquationTest.getEquationLaTeX()).expand())
console.log("Simplified: " + compute.parse(linearEquationTest.getEquationLaTeX()).simplify())



while(solver.steps.length != 0){
    const rational = "-7 / (-1/2)"
    const expr = compute.parse(rational).evaluate().toString();
    console.log("expr:" + expr);
    console.log(solver.getStep())
}





export { LinearEquation, EquationSolver };