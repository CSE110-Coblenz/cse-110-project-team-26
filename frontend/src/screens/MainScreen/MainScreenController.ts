import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MainScreenView } from "./MainScreenView.ts";
/**
 * MenuScreenController - Handles menu interactions
 */
export class MainScreenController extends ScreenController {
    private view: MainScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new MainScreenView(() => this.handleStartClick());
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
    getView(): MainScreenView {
        return this.view;
    }
}
