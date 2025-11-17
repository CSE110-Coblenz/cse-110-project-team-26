import type { Group } from "konva/lib/Group";

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
