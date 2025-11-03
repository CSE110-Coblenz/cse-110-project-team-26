import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MazeScreenView } from "./MazeScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MazeScreenController extends ScreenController {
    private view: MazeScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new MazeScreenView(() => this.handleStartClick());
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
    getView(): MazeScreenView {
        return this.view;
    }
}
