import type { Group } from "konva/lib/Group";

/**
 * Allows views to be hidden and shown
 */
export interface View {

	/**
	 * @returns Konva group the view belongs to
	 */
	getGroup(): Group;

	/**
	 * Shows the view
	 */
	show(): void;

	/**
	 * Hides the view
	 */
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

/**
 * Implements interaction between a module's Controller and View
 */
export abstract class ScreenController {
	/**
	 * Gets the view corresponding to the controller
	 * 
	 * @returns The corresponding view
	 */
	abstract getView(): View;

	/**
	 * Shows the corrensponding view
	 */
	show(): void {
		this.getView().show();
	}

	/**
	 * Hides the corresponding view
	 */
	hide(): void {
		this.getView().hide();
	}
}

/**
 * Allows switching between Views
 */
export interface ScreenSwitcher {
	/**
	 * Switches to the given screen
	 * 
	 * @param screen Screen to switch to
	 */
	switchToScreen(screen: Screen): void;
}

/**
 * Template for minigame questions
 */
export interface Question {
	/**
	 * Example fields (graph example):
	 * quadraticCoefficient
	 * linearCoefficient
	 * intercept
	 */

	/**
	 * Generate correct answer values
	 */
	generateAnswerValues(): void;

	/**
	 * Determine if user-inputted answer matches the generated answer
	 * 
	 * @returns True if the user's answer matches the generated answer and false
	 * otherwise
	 */
	verifyAnswer(): boolean;
}

export type equationAnswerFormat = 
	| {yIntercept: 0, coefficient: 0}	// LINEAR
	| {root1: 0, root2: 0}	// PARABOLAS
	| {coefficient: 0, xShift: 0, yShift: 0}	// ABSOLUTE VALUE
	| null; 