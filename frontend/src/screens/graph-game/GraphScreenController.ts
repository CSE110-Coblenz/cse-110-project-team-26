import { ScreenController } from "../../types";
import { GraphScreenView } from "./GraphScreenView";
import { GraphScreenModel } from "./GraphScreenModel";
import type { ScreenSwitcher } from "../../types";

// REFACTOR CODE TO HAVE VARIABLE ORIGIN POINT

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
            this.model = new GraphScreenModel(-6, 7);
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
        if(params.slope.numerator === null) {
            this.model.setParameters({ numerator: input, denominator: null }, null);
            this.view.updateEquation(`y=(${input}/_)x+_`);
        } else if(params.slope.denominator === null) {
            this.model.setParameters({ numerator: params.slope.numerator, denominator: input }, null)
            this.view.updateEquation(`y=(${params.slope.numerator}/${input})x+_`)
        } else {
            this.model.setParameters(params.slope, input);
            this.view.updateEquation(`y=(${params.slope.numerator}/${params.slope.denominator})x+${input}`);
        }
    }

    private handleEquationReset(): void {
        this.model.setParameters({ numerator: null, denominator: null }, null);
        this.view.updateEquation("y=(_/_)x+_");
        console.log('Reset button clicked');
    }

    private handleEquationSubmission(): boolean {
        console.log('Submit button clicked');
        this.submitEquationInput();
        return false;
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
