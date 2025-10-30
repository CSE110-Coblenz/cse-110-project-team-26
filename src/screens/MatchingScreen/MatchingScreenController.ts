import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MatchingScreenView } from "./MatchingScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MatchingScreenController extends ScreenController {
    private view: MatchingScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new MatchingScreenView(() => this.handleStartClick());
    }

    /**
     * Handle start button click
     */
    private handleStartClick(): void {
        this.screenSwitcher.switchToScreen({ type: "menu" });
    }

    /**
     * Get the view
     */
    getView(): MatchingScreenView {
        return this.view;
    }
}
