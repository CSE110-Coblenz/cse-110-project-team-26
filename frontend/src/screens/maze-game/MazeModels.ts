import { compute } from "../../constants.ts";
import { LinearEquation, EquationSolver } from "./maze-logic/LinearEquationLogic";

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
        this.generateChoices();
    }
    // Need logic to see when it is the last step
    private generateChoices(){
        this.choices.push(new ChoiceModel(this.solver.getStep().description, true));
        this.choices.push(new ChoiceModel("Incorrect Choice 1", false));
        this.choices.push(new ChoiceModel("Incorrect Choice 2", false));
        this.shuffleChoices();
    }
    // Shuffle choices to randomize their order
    private shuffleChoices() {
        for (let i = this.choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
        }
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
    public nextMove() {
        this.choices = [];
        this.generateChoices();
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
