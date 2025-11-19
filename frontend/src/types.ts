import type { Group } from "konva/lib/Group";
import { LINEAR, QUADRATIC, ABSVAL } from "../src/constants";

export interface View {
	getGroup(): Group;
	show(): void;
	hide(): void;
}

export type Screen =
	| { type: "menu" }
	| { type: "game" }
	| { type: "matching-game" }
	| { type: "maze-game" }
	| { type: "main-game" }
	| { type: "result"; score: number }
  | { type: "title" }
	| { type: "tutorial" };


export abstract class ScreenController {
	abstract getView(): View;

	show(): void {
		this.getView().show();
	}

	hide(): void {
		this.getView().hide();
	}
}

/**
 * Template for minigame questions
 */
export interface Question {
	generateAnswerValues(): void;
	verifyAnswer(): boolean;
}

export type EquationAnswerFormat = 
	| {yIntercept: 0, coefficient: 0} // LINEAR
	| {root1: 0, root2: 0} // PARABOLA
	| {coefficient: 0, xShift: 0, yShift: 0} // ABSOLUTE VALUE
	| null;
export interface ScreenSwitcher {
	switchToScreen(screen: Screen): void;
}

export interface EquationAnswerFormat {
	readonly format: string;

	generateAnswerValues(): void;
	verifyAnswer(): boolean;
}

export class Linear implements EquationAnswerFormat {
	private coefficient: number;
	private intercept: number;
	readonly format = LINEAR;

	constructor() {
		this.coefficient = 0;
		this.intercept = 0;
	}

	generateAnswerValues(): void {
		
	}

	verifyAnswer(): boolean {
		return false;
	}
}

export class Quadratic implements EquationAnswerFormat {
	private root1: number;
	private root2: number;
	readonly format = QUADRATIC;

	constructor() {
		this.root1 = 0;
		this.root2 = 0;
	}

	generateAnswerValues(): void {
		
	}

	verifyAnswer(): boolean {
		return false;
	}
}

export class AbsoluteValue implements EquationAnswerFormat {
	private coefficient: number;
	private xShift: number;
	private yShift: number;
	readonly format = ABSVAL;

	constructor() {
		this.coefficient = 0;
		this.xShift = 0;
		this.yShift = 0;
	}

	generateAnswerValues(): void {
		
	}

	verifyAnswer(): boolean {
		return false
	}
}

export abstract class Question {
	private answer: EquationAnswerFormat | null;
	private submission: EquationAnswerFormat | null;

	constructor() {
		this.submission = null;
		this.answer = null;
	}

	abstract generateAnswerValues(): void;
	enterSubmission(submission: EquationAnswerFormat): void {
		this.submission = submission;
	}
	verifyAnswer(): boolean {
		this.answer?.verifyAnswer();
		return false;
	}
}
