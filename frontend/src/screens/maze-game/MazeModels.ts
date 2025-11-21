import { compute } from "../../constants.ts";
import { LinearEquation, EquationSolver } from "./maze-logic/LinearEquationLogic";
import type { Step, MathJson } from "../../types.ts";


/**
 * GameScreenModel - Manages game state
 */
export class MazeScreenModel {
	private score = 0;
    private timeRemaining = 60;
	/**
	 * Reset game state for a new game
	 */
	reset(): void {
		this.score = 0;
	}

	incrementScore(): void {
		this.score++;
	}

	getScore(): number {
		return this.score;
	}

    gettimeRemaining(): number {
        return this.timeRemaining;
    }
}
/**
 * ProblemModel - Represents a math problem in the maze game
 */
export class ProblemModel {
    private problemStatement: string
    private linearEquation: LinearEquation
    private choices: ChoiceModel[] = [];
    private solver: EquationSolver

    constructor(difficultyLevel: number) {
        this.linearEquation = new LinearEquation(difficultyLevel, compute);
        this.problemStatement = this.linearEquation.getEquationLaTeX();
        this.solver = new EquationSolver(this.linearEquation.getEquation(), compute);
        console.log("Steps to solve the equation:");
        console.log(JSON.parse(JSON.stringify(this.solver.steps)));
        const firstStep = this.solver.getStep();
        console.log(firstStep);
        this.generateChoices(firstStep);
        console.log("Generated Problem: ", this.problemStatement);
        }
    // Need logic to see when it is the last step
    private generateChoices(correctChoice: Step, isLastStep: boolean = false) {
        this.choices.push(new ChoiceModel(correctChoice.description, true));
        const operations = ["Add", "Divide", "Subtract", "Multiply"] as const;
        let randomNumber1: number;
        let randomNumber2: number;
        if (!isLastStep) {
            // Second choice
            let randomOperation = operations[Math.floor(Math.random() * operations.length)];
            randomNumber1 = Math.floor(Math.random() * 10) + 1;
            randomNumber2 = Math.floor(Math.random() * 10) + 1;
            this.choices.push(new ChoiceModel(`${randomOperation} ${randomNumber1}, ${randomNumber2}`, false));
            // Third choice
            randomOperation = operations[Math.floor(Math.random() * operations.length)];
            randomNumber1 = Math.floor(Math.random() * 10) + 1;
            /* randomNumber2 = numberMatches.length
                ? numberMatches[Math.floor(Math.random() * numberMatches.length)]
                : String(Math.floor(Math.random() * 10) + 1); */
            randomNumber2 = Math.floor(Math.random() * 10) + 1;
            this.choices.push(new ChoiceModel(`${randomOperation} ${randomNumber1}, ${randomNumber2}`, false));
        } else { 
            // NEED TO MAKE SURE INCORRECT CHOICES ARE NOT THE SOLUTION
            randomNumber1 = Math.floor(Math.random() * 10) + 1;
            this.choices.push(new ChoiceModel(`x = ${randomNumber1}`, false));
            randomNumber2 = Math.floor(Math.random() * 10) + 1;
            this.choices.push(new ChoiceModel(`x = ${randomNumber2}`, false));
        }
        this.shuffleChoices();
    }
    // Shuffle choices to randomize their order
    private shuffleChoices() {
        for (let i = this.choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
        }
    }
    // Set the problem statement based on the current step
    private setProblemStatement(statement: string) {
        this.problemStatement = statement;
    }
    // Need to return problem with the next step applied rather than the original problem
    // Also Konva does not support LaTeX rendering directly, so we need to convert LaTeX to an image
    public getProblemStatement(): string {
        return this.problemStatement;
    }
    // Return the current choices
    public getChoices(): ChoiceModel[] {
        return this.choices;
    }
    // Clear current choices and generate new ones based on the next step
    public nextMove(): boolean {
        this.choices = [];
        if (this.solver.getStepsCount() === 0) {
            return false;
        }
        const newStep = this.solver.getStep(); // advance to next step
        console.log("Next Step: ", newStep);
        this.generateChoices(newStep, this.solver.getStepsCount() === 0? true : false);
        this.setProblemStatement(newStep.current);
        return true;
    }
}
/**
 * ChoiceModel - Represents a choice for solving the problem
 */
export class ChoiceModel {
    private text: string;
    private isCorrect: boolean;

    constructor(text: string, isCorrect: boolean) {
        this.text = text;
        this.isCorrect = isCorrect;
    }

    getText(): string {
        return this.text;
    }

    getIsCorrect(): boolean {
        return this.isCorrect;
    }
}
