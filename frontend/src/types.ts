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
	| { type: "result"; score: number };

export abstract class ScreenController {
	abstract getView(): View;

	show(): void {
		this.getView().show();
	}

	hide(): void {
		this.getView().hide();
	}
}

export interface ScreenSwitcher {
	switchToScreen(screen: Screen): void;
}

export interface EquationAnswerFormat {
	readonly format: string;

	generateAnswerValues(): void;
	verifyAnswer(submission: EquationAnswerFormat): boolean;
}

export class Linear implements EquationAnswerFormat {
	public coefficient: {
		numerator: number,
		denominator: number
	};
	public intercept: number;
	readonly format = LINEAR;

	constructor() {
		let isPositive = generateRandomNumber(0, 1);
		if (isPositive == 1) {
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
		if (this.coefficient != submission.coefficient) return false;
		else if (this.intercept != submission.intercept) return false;
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
		while (this.root1 == 0) {
			this.root1 = generateRandomNumber(-5, 5);
		}
		while (this.root2 == 0) {
			this.root2 = generateRandomNumber(-5, 5);
		}
	}

	verifyAnswer(submission: Quadratic): boolean {
		if ((this.root1 == submission.root1 && this.root2 == submission.root2) ||
			(this.root2 == submission.root1 && this.root1 == submission.root1)) {
				return true;
			}
		return false;
	}
}

export class AbsoluteValue implements EquationAnswerFormat {
	public coefficient: {
		numerator: number,
		denominator: number
	};
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
		if (isPositive == 1) {
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
		if (this.coefficient != submission.coefficient) return false;
		else if (this.xShift != submission.xShift) return false;
		else if (this.yShift != this.yShift) return false
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