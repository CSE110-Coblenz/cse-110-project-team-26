import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MazeScreenView } from "./MazeScreenView.ts";
import Konva from "konva";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MazeScreenController extends ScreenController {
    private view: MazeScreenView;
    private screenSwitcher: ScreenSwitcher;
    private stage: Konva.Stage;

    constructor(screenSwitcher: ScreenSwitcher, stage: Konva.Stage) {
        super();
        this.stage = stage;
        this.screenSwitcher = screenSwitcher;
        this.view = new MazeScreenView(() => this.handleStartClick(), this.stage);
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
