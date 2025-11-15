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
            this.model = new GraphScreenModel;
            this.view = new GraphScreenView(
                (input: number) => this.handleNumberInput(input),
                () => this.handleEquationReset(),
                () => this.handleEquationSubmission()
            );
            this.screenSwitcher = screenSwitcher;
    }

    /**
     * 
     * @returns The Graphing game module's View
     */
    getView(): GraphScreenView {
        return this.view;
    }


    private handleNumberInput(input: number): void {
        let params = this.model.getParameters();
        if(params.slope === null) {
            this.model.setParameters(input, null);
            this.view.updateEquation(`y=${input}x+_`);
        } else {
            this.model.setParameters(params.slope, input);
            this.view.updateEquation(`y=${params.slope}x+${input}`);
        }
    }

    private handleEquationReset(): void {
        this.model.setParameters(null, null);
        this.view.updateEquation("y=_x+_");
        console.log('Reset button clicked');
    }

    private handleEquationSubmission(): boolean {
        console.log('Submit button clicked');
        this.submitEquationInput();
    }

    private submitEquationInput(): void {

        this.plotGraphGame(false); // isPreview = false
    }

    private previewEquationInput(): void {
        // TODO: update model
        this.plotGraphGame(true); // isPreview = true
    }

    private plotGraphGame(isPreview: boolean): void {
        // if isPreview, then plot color will be different
        // TODO: update view
    }

    private switchToMazeGame(): void {
        // TODO: switch to maze game
    }

    private switchToMatchGame(): void {
        // TODO: switch to match game
    }

}
