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
        this.generateChoices();
    }

    private generateChoices(){
        this.choices.push(new ChoiceModel(this.solver.getStep().description, true));
        this.choices.push(new ChoiceModel("Incorrect Choice 1", false));
        this.choices.push(new ChoiceModel("Incorrect Choice 2", false));
        this.shuffleChoices();
    }

    private shuffleChoices() {
        for (let i = this.choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
        }
    }

    public getProblemStatement(): string {
        return this.problemStatement;
    }

    public getChoices(): ChoiceModel[] {
        return this.choices;
    }
    
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
