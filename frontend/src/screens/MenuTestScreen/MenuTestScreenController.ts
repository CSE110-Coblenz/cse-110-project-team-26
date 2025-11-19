import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MenuTestScreenView } from "./MenuTestScreenView.ts";

/**
 * MenuScreenController - Handles menu interactions
 */
export class MenuTestScreenController extends ScreenController {
    private view: MenuTestScreenView;
    private screenSwitcher: ScreenSwitcher;

    constructor(screenSwitcher: ScreenSwitcher) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.view = new MenuTestScreenView(() => this.handleMatchingClick(),() => this.handleMazeClick(), () => this.handleMainClick());
    }

    /**
     * Handle start button click
     */
    private handleMatchingClick(): void {
        this.screenSwitcher.switchToScreen({ type: "matching-game" });
    }
    private handleMazeClick(): void {
        this.screenSwitcher.switchToScreen({ type: "maze-game" });
    }
    private handleMainClick(): void {
        this.screenSwitcher.switchToScreen({ type: "main-game" });
    }

    /**
     * Get the view
     */
    getView(): MenuTestScreenView {
        return this.view;
    }
}
