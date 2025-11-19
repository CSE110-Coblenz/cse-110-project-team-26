import type Konva from "konva";
import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MatchingScreenView } from "./MatchingScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MatchingScreenController extends ScreenController {
    private view: MatchingScreenView;
    private stage: Konva.Stage;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher, stage: Konva.Stage) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.stage = stage;
        this.view = new MatchingScreenView(() => this.handleStartClick(), this.stage);
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
