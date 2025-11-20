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

export interface ScreenSwitcher {
	switchToScreen(screen: Screen): void;
}

export interface EquationAnswerFormat {
	readonly format: string;

	generateAnswerValues(): void;
	checkCompleteSubmission(): boolean;
	verifyAnswer(submission: EquationAnswerFormat): boolean;
}

export type Fraction = {
  numerator: number | null,
  denominator: number | null
};

export class Linear implements EquationAnswerFormat {
	public coefficient: Fraction;
	public intercept: number | null;
	readonly format = LINEAR;

	constructor(isAnswer: boolean) {
		if (!isAnswer) {
			this.coefficient = {
				numerator: null,
				denominator: null
			};
			this.intercept = null;
			return;
		}
		let isPositive = generateRandomNumber(0, 2);
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
		this.intercept = generateRandomNumber(-5, 5);
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

	getCoefficient(): Fraction {
		return this.coefficient;
	}

	getIntercept(): number | null {
		return this.intercept;
	}

	setNumerator(numerator: number) {
		console.log("Numerator set: " + numerator);
		this.coefficient.numerator = numerator;
	}

	setDenominator(denominator: number) {
		this.coefficient.denominator = denominator;
	}

	setIntercept(intercept: number) {
		this.intercept = intercept;
	}

	checkCompleteSubmission(): boolean {
		if (this.coefficient.numerator == null) return false;
		else if (this.coefficient.denominator == null) return false;
		else if (this.intercept == null) return false;
		return true;
	}
}

export class Quadratic implements EquationAnswerFormat {
	public root1: number | null;
	public root2: number | null;
	readonly format = QUADRATIC;

	constructor(isAnswer: boolean) {
		if (!isAnswer) {
			this.root1 = null;
			this.root2 = null;
			return;
		}
		this.root1 = 0;
		this.root2 = 0;
		this.generateAnswerValues();
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
			(this.root2 === submission.root1 && this.root1 === submission.root2)) {
				return true;
			}
		return false;
	}

	getRoot1(): number | null {
		return this.root1;
	}

	getRoot2(): number | null {
		return this.root2;
	}

	setRoot1(root1: number) {
		this.root1 = root1;
	}

	setRoot2(root2: number) {
		this.root2 = root2;
	}

	checkCompleteSubmission(): boolean {
		if (this.root1 == null) return false;
		else if (this.root2 == null) return false;
		return true;
	}

}

export class AbsoluteValue implements EquationAnswerFormat {
	public coefficient: Fraction;
	public xShift: number | null;
	public yShift: number | null;
	readonly format = ABSVAL;

	constructor(isAnswer: boolean) {
		if (!isAnswer) { 
			this.coefficient = {
				numerator: null,
				denominator: null
			};
			this.xShift = null;
			this.yShift = null;
			return
		}
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
		this.xShift = generateRandomNumber(-4, 4);
		this.yShift = generateRandomNumber(-4, 4);
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

	getCoefficient(): Fraction {
		return this.coefficient;
	}

	getXShift(): number | null {
		return this.xShift;
	}

	getYShift(): number | null {
		return this.yShift;
	}

	setNumerator(numerator: number) {
		this.coefficient.numerator = numerator;
	}

	setDenominator(denominator: number) {
		this.coefficient.denominator = denominator;
	}

	setXShift(xShift: number) {
		this.xShift = xShift;
	}

	setYShift(yShift: number) {
		this.yShift = yShift;
	}

	checkCompleteSubmission(): boolean {
		if (this.coefficient.numerator == null) return false;
		else if (this.coefficient.denominator == null) return false;
		else if (this.xShift == null) return false;
		else if (this.yShift == null) return false;
		return true;
	}
}

export abstract class Question {
	protected answer: EquationAnswerFormat;
	protected submission: EquationAnswerFormat;

	constructor() {
		this.submission = null;
		this.answer = null;
	}

	generateAnswerValues(): void {
		this.submission.generateAnswerValues();
	}

	enterSubmission(submission: EquationAnswerFormat): void {
		this.submission = submission;
	}

	verifyAnswer(): boolean {
		return this.submission.verifyAnswer(this.submission);
	}

}


export {
	generateRandomNumber
};