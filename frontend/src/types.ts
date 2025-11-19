import type { Group } from "konva/lib/Group";
import { LINEAR, QUADRATIC, ABSVAL,
		Y_MAX, Y_MIN, X_MAX, X_MIN
 	} from "../src/constants";

/**
 * Generates an integer in [min, max]
 * 
 * @param min Minimum value that can be generated
 * @param max Maximum value that can be generated
 * @returns An integer in [min, max]
 */
function generateRandomNumber(min: number, max: number): number {
	if (max <= min) console.log("BAD INPUT");
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface View {
	getGroup(): Group;
	show(): void;
	hide(): void;
}
// MathJson type representing mathematical expressions
export type MathJson = number | string | (string | number | MathJson)[];
// Step interface representing each step in the solution process
export interface Step {
    description: string;
    current: MathJson;
    stepNumber: number;
    result?: MathJson;
}
/**
 * Screen types for navigation
 *
 * - "menu": Main menu screen
 * - "game": Gameplay screen
 * - "result": Results screen with final score
 *   - score: Final score to display on results screen
 */
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
	verifyAnswer(submission: EquationAnswerFormat): boolean;
}

export type Fraction = {
  numerator: number,
  denominator: number
};

export class Linear implements EquationAnswerFormat {
	public coefficient: Fraction;
	public intercept: number;
	readonly format = LINEAR;

	constructor() {
		let isPositive = generateRandomNumber(0, 1);
		if (isPositive === 1) {
			this.coefficient = {
				numerator: generateRandomNumber(1, 6),
				denominator: generateRandomNumber(1, 6)
			};
		} else {
			this.coefficient = {
				numerator: -1 * generateRandomNumber(1, 6),
				denominator: generateRandomNumber(1, 6)
			};
		}
		this.intercept = 0;
	}

	generateAnswerValues(): void {
		this.coefficient = {
			numerator: generateRandomNumber(1, 8),
			denominator: generateRandomNumber(1, 8)
		};
		this.intercept = generateRandomNumber(-10, 10);
	}

	verifyAnswer(submission: Linear): boolean {
		if ((this.coefficient.numerator !== submission.coefficient.numerator) || (this.coefficient.denominator !== submission.coefficient.denominator)) return false;
		else if (this.intercept !== submission.intercept) return false;
		return true;
	}
}

export class Quadratic implements EquationAnswerFormat {
	public root1: number;
	public root2: number;
	readonly format = QUADRATIC;

	constructor() {
		this.root1 = 0;
		this.root2 = 0;
	}

	generateAnswerValues(): void {
		while (this.root1 === 0) {
			this.root1 = generateRandomNumber(-5, 5);
		}
		while (this.root2 === 0) {
			this.root2 = generateRandomNumber(-5, 5);
		}
	}

	verifyAnswer(submission: Quadratic): boolean {
		if ((this.root1 === submission.root1 && this.root2 === submission.root2) ||
			(this.root2 === submission.root1 && this.root1 === submission.root1)) {
				return true;
			}
		return false;
	}
}

export class AbsoluteValue implements EquationAnswerFormat {
	public coefficient: Fraction;
	public xShift: number;
	public yShift: number;
	readonly format = ABSVAL;

	constructor() {
		this.coefficient = {
			numerator: 0,
			denominator: 0
		};
		this.xShift = 0;
		this.yShift = 0;
	}

	// TO-DO: MODIFY TO ALLOW NEGATIVE VALUES
	generateAnswerValues(): void {
		let isPositive = generateRandomNumber(0, 1);
		if (isPositive === 1) {
			this.coefficient = {
				numerator: generateRandomNumber(1, 6),
				denominator: generateRandomNumber(1, 6)
			}
		} else {
			this.coefficient = {
				numerator: -1 * generateRandomNumber(1, 6),
				denominator: generateRandomNumber(1, 6)
			}
		}
		this.xShift = generateRandomNumber(-8, 8);
		this.yShift = generateRandomNumber(-8, 8);
	}

	verifyAnswer(submission: AbsoluteValue): boolean {
		if ((this.coefficient.numerator !== submission.coefficient.denominator) || (this.coefficient.denominator !== submission.coefficient.denominator)) return false;
		else if (this.xShift !== submission.xShift) return false;
		else if (this.yShift !== this.yShift) return false
		return true;
	}
}

export abstract class Question {
	protected answer: EquationAnswerFormat | null;
	protected submission: EquationAnswerFormat | null;

	constructor() {
		this.submission = null;
		this.answer = null;
	}

	generateAnswerValues(): void {
		this.submission?.generateAnswerValues();
	}

	enterSubmission(submission: EquationAnswerFormat): void {
		this.submission = submission;
	}

	verifyAnswer(): boolean {
		this.answer?.verifyAnswer(this.submission as AbsoluteValue);
		return false;
	}
}
