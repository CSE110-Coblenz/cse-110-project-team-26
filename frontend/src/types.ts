import type { Group } from "konva/lib/Group";
import { LINEAR, QUADRATIC, ABSVAL } from "../src/constants";

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
	| { type: "tutorial" }
	| { type: "statistics" };


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

	checkCompleteSubmission(): boolean;
	verifyAnswer(submission: EquationAnswerFormat): boolean;
}

export type Fraction = {
  numerator: number | null,
  denominator: number | null
};

export class Linear implements EquationAnswerFormat {
	public coefficient: Fraction;
	public coefficientIsPos: boolean;
	public intercept: number | null;
	public interceptIsPos: boolean;
	readonly format = LINEAR;

	constructor(isAnswer: boolean) {
		if (!isAnswer) {
			this.coefficient = {
			numerator: null,
			denominator: null
		};
			this.coefficientIsPos = true;
			this.intercept = null;
			this.interceptIsPos = true;
			return;
		}
		if (generateRandomNumber(0, 1) == 1) this.coefficientIsPos = true;
		else this.coefficientIsPos = false;
		this.coefficient = {
			numerator: generateRandomNumber(1, 5),
			denominator: generateRandomNumber(1, 5)
		};
		if (!this.coefficientIsPos) this.coefficient.numerator *= -1;
		this.intercept = generateRandomNumber(-5, 5);
	}

	verifyAnswer(submission: Linear): boolean {
		if (this.coefficient.numerator != submission.coefficient.numerator) {
			console.log("numerators unequal");
			return false;
		}
		else if (this.coefficient.denominator != submission.coefficient.denominator) {
			console.log("denominators unequal");
			return false;
		}
		else if (this.intercept != submission.intercept) {
			console.log("intercepts unequal");
			return false
		}
		return true;
	}

	getCoefficient(): Fraction {
		return this.coefficient;
	}

	getCoefficientIsPos(): boolean {
		return this.coefficientIsPos;
	}

	getIntercept(): number | null {
		return this.intercept;
	}

	getInterceptIsPos(): boolean {
		return this.interceptIsPos;
	}

	setNumerator(numerator: number) {
		console.log("Numerator set: " + numerator);
		if (this.coefficientIsPos) this.coefficient.numerator = numerator;
		else this.coefficient.numerator = -numerator;
	}

	setDenominator(denominator: number) {
		this.coefficient.denominator = denominator;
	}

	setCoefficientIsPos() {
		this.coefficientIsPos = !this.coefficientIsPos;
	}

	setIntercept(intercept: number) {
		if (this.interceptIsPos) this.intercept = intercept;
		else this.intercept = -intercept;
	}

	setInterceptIsPos() {
		this.interceptIsPos = !this.interceptIsPos;
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
	public root1IsPos: boolean;
	public root2: number | null;
	public root2IsPos: boolean;
	readonly format = QUADRATIC;

	constructor(isAnswer: boolean) {
		if (!isAnswer) {
			this.root1 = null;
			this.root1IsPos = true;
			this.root2 = null;
			this.root2IsPos = true;
			return;
		}
		this.root1 = generateRandomNumber(-4, 4);
		this.root2 = generateRandomNumber(-4, 4	);
	}

	verifyAnswer(submission: Quadratic): boolean {
		if ((this.root1 == submission.root1 && this.root2 == submission.root2) ||
			(this.root2 == submission.root1 && this.root1 == submission.root2)) {
				return true;
			}
		if ((this.root1IsPos == submission.root1IsPos) && (this.root2IsPos == submission.root2IsPos) ||
			(this.root2IsPos == submission.root1IsPos) && (this.root2IsPos == submission.root1IsPos)) {
				return true;
			}
		return false;
	}

	getRoot1(): number | null {
		return this.root1;
	}

	getRoot1IsPos(): boolean {
		return this.root1IsPos;
	}

	getRoot2(): number | null {
		return this.root2;
	}

	getRoot2IsPos(): boolean {
		return this.root2IsPos;
	}

	setRoot1(root1: number) {
		if (!this.root1IsPos) this.root1 = -root1;
		else this.root1 = root1;
	}

	setRoot1IsPos() {
		this.root1IsPos = !this.root1IsPos;
	}

	setRoot2(root2: number) {
		if (!this.root2IsPos) this.root2 = -root2;
		else this.root2 = root2;
	}

	setRoot2IsPos() {
		this.root2IsPos = !this.root2IsPos;
	}

	checkCompleteSubmission(): boolean {
		if (this.root1 == null) return false;
		else if (this.root2 == null) return false;
		return true;
	}

}

export class AbsoluteValue implements EquationAnswerFormat {
	public coefficient: Fraction;
	public coefficientIsPos: boolean;
	public xShift: number | null;
	public xShiftIsPos: boolean;
	public yShift: number | null;
	public yShiftIsPos: boolean;
	readonly format = ABSVAL;

	constructor(isAnswer: boolean) {
		if (!isAnswer) { 
			this.coefficient = {
				numerator: null,
				denominator: null
			}
			this.coefficientIsPos = true;
			this.xShift = null;
			this.xShiftIsPos = true;
			this.yShift = null;
			this.yShiftIsPos = true;
			return
		}
		if (generateRandomNumber(0, 1) == 1) this.coefficientIsPos = true;
		else this.coefficientIsPos = false;
		this.coefficient = {
			numerator: generateRandomNumber(1, 6),
			denominator: generateRandomNumber(1, 6)
		}
		if (!this.coefficientIsPos) this.coefficient.numerator *= -1;
		this.xShift = generateRandomNumber(-4, 4);
		this.yShift = generateRandomNumber(-4, 4);
	}

	verifyAnswer(submission: AbsoluteValue): boolean {
		if (this.coefficient.numerator != submission.coefficient.numerator) return false;
		else if (this.coefficient.denominator != submission.coefficient.denominator) return false;
		else if (this.xShift != submission.xShift) return false;
		else if (this.yShift != submission.yShift) return false;
		return true;
	}

	getCoefficient(): Fraction {
		return this.coefficient;
	}

	getCoefficientIsPos(): boolean {
		return this.coefficientIsPos;
	}

	getXShift(): number | null {
		return this.xShift;
	}

	getXShiftIsPos(): boolean {
		return this.xShiftIsPos;
	}

	getYShift(): number | null {
		return this.yShift;
	}

	getYShiftIsPos(): boolean {
		return this.yShiftIsPos;
	}

	setNumerator(numerator: number) {
		if (this.coefficientIsPos) this.coefficient.numerator = numerator;
		else this.coefficient.numerator = -numerator;
	}

	setDenominator(denominator: number) {
		this.coefficient.denominator = denominator;
	}

	setCoefficientIsPos() {
		this.coefficientIsPos = !this.coefficientIsPos;
	}

	setXShift(xShift: number) {
		if (this.xShiftIsPos) this.xShift = xShift;
		else this.xShift = -xShift;
	}

	setXShiftIsPos() {
		this.xShiftIsPos = !this.xShiftIsPos;
	}

	setYShift(yShift: number) {
		if (this.yShiftIsPos) this.yShift = yShift;
		else this.yShift = -yShift;
	}

	setYShiftIsPos() {
		this.yShiftIsPos = !this.yShiftIsPos;
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
	this.answer?.generateAnswerValues();
}

enterSubmission(submission: EquationAnswerFormat): void {
	this.submission = submission;
}

verifyAnswer(): boolean {
	if (!this.answer || !this.submission) {
		return false;
	}

	return this.answer.verifyAnswer(this.submission);
}
}

export {
	generateRandomNumber
};
