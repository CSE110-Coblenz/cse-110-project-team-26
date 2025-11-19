import { ScreenController } from "../../types";
import { GraphScreenView } from "./GraphScreenView";
import { GraphScreenModel } from "./GraphScreenModel";
import type { ScreenSwitcher } from "../../types";

/**
 * Controller for the Graphing game module
 */
export class GraphScreenController extends ScreenController {
    private model: GraphScreenModel;
    private view: GraphScreenView;
    private screenSwitcher: ScreenSwitcher;

    /**
     * Initializes default values for the Controller
     */
    constructor(screenSwitcher: ScreenSwitcher) {
        super();

        this.view = new GraphScreenView();
        this.model = new GraphScreenModel();
        this.screenSwitcher = screenSwitcher;
    }

    /**
     * 
     * @returns The Graphing game module's View
     */
    getView(): GraphScreenView {
        return this.view;
    }
}
