import { generateRandomNumber, ScreenController } from "../../types";
import { GraphScreenView } from "./GraphScreenView";
import { GraphScreenModel } from "./GraphScreenModel";
import { AbsoluteValue, Quadratic, type EquationAnswerFormat, type ScreenSwitcher } from "../../types";
import { LINEAR, QUADRATIC, ABSVAL } from "../../constants";
import { Linear } from "../../types";

/**
 * Controller for the Graphing game module
 */
export class GraphScreenController extends ScreenController {
    private model: GraphScreenModel;
    private view: GraphScreenView;
    private type: string;
    private screenSwitcher: ScreenSwitcher;
    private submission: EquationAnswerFormat;

    /**
     * Initializes default values for the Controller
     */
    constructor(screenSwitcher: ScreenSwitcher) {
        super();
            let type = generateRandomNumber(0, 2);
            this.model = new GraphScreenModel(type);
            this.type = this.model.getQuestionType();
            switch(this.type) {
                case LINEAR:
                    this.submission = new Linear(false);
                break;
                case QUADRATIC:
                    this.submission = new Quadratic(false);
                break;
                case ABSVAL:
                    this.submission = new AbsoluteValue(false);
                break;
            }
            this.view = new GraphScreenView(
                type,
                (input: number) => this.handleNumberInput(input),
                () => this.handleEquationReset(),
                () => this.handleEquationSubmission(this.submission)
            );
            this.view.plotPOI(this.model.getAnswer());
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
        switch (this.type) {
            case LINEAR:
                let linearSubmission = this.submission as Linear;
                console.log(linearSubmission.getCoefficient());
                let linearNumerator = linearSubmission.getCoefficient().numerator;
                let linearDenominator = linearSubmission.getCoefficient().denominator;
                if (linearNumerator == null || linearNumerator == -1) {
                    if (input == -1) {
                        this.view.updateEquation(`y=(-_/_)x+_`);
                        linearSubmission.setNumerator(input);
                        return;
                    }
                    if (input != -1 && linearNumerator == -1) {
                        linearSubmission.setNumerator(-1 * input)
                        this.view.updateEquation(`y=(-${input}/_)x+_`);
                        return;
                    }
                    linearSubmission.setNumerator(input);
                    console.log(linearSubmission.getCoefficient().numerator);
                    this.view.updateEquation(`y=(${input}/_)x+_`);
                } else if (linearDenominator == null) {
                    if (input == -1) {
                        this.view.updateEquation(`y=(-${linearNumerator}/_)x+_`);
                        linearSubmission.setNumerator(linearNumerator * -1);
                        break;
                    }
                    linearSubmission.setDenominator(input);
                    this.view.updateEquation(`y=(${linearNumerator}/${input})x+_`);
                } else {
                    if (input == -1) {
                        this.view.updateEquation(`y=(${linearNumerator}/${linearDenominator})x-_`)
                        linearSubmission.setIntercept(input);
                        return;
                    }
                    if (linearSubmission.getIntercept() == -1) {
                        linearSubmission.setIntercept(input * -1);
                        this.view.updateEquation(`y=(${linearNumerator}/${linearDenominator})x-${input}`);
                        return;
                    }
                    console.log(linearSubmission.getCoefficient().numerator);
                    linearSubmission.setIntercept(input);
                    this.view.updateEquation(`y=(${linearNumerator}/${linearDenominator})x+${input}`)
                }
            break;
            case QUADRATIC:
                console.log(this.submission == null);
                let quadraticSubmission = this.submission as Quadratic;
                let root1 = quadraticSubmission.getRoot1();
                if (root1 == null || root1 == -1) {
                    if (input == -1) {
                        this.view.updateEquation(`y=(x-_)(x+_)`);
                        quadraticSubmission.setRoot1(input);
                        return;
                    }
                    if (root1 == -1) {
                        this.view.updateEquation(`y=(x-${input})(x+_)`);
                        quadraticSubmission.setRoot1(-1 * input);
                        return;
                    }
                    quadraticSubmission.setRoot1(input);
                    this.view.updateEquation(`y=(x+${input})(x+_)`);
                } else {
                    let text: string = `y=(x`;
                    if (root1 < 0) text += `${root1})(x`; 
                    else text += `+${root1})(x`
                    if (input == -1) {
                        text += `-_)`
                        quadraticSubmission.setRoot2(input);
                        this.view.updateEquation(text);
                        break;
                    }
                    quadraticSubmission.setRoot2(input);
                    if (root1 < 0) this.view.updateEquation(`y=(x${root1})(x+${input})`);
                    else this.view.updateEquation(`y=(x+${root1})(x+${input})`);
                }
            break;
            case ABSVAL:
                let absvalSubmission = this.submission as AbsoluteValue;
                let absvalNumerator = absvalSubmission.getCoefficient().numerator;
                let absvalDenominator = absvalSubmission.getCoefficient().denominator;
                let xShift = absvalSubmission.getXShift();
                if (absvalNumerator == null) {
                    absvalSubmission.setNumerator(input);
                    this.view.updateEquation(`y=(${input}/_)|x+_|+_`)
                } else if (absvalDenominator == null) {
                    absvalSubmission.setDenominator(input);
                    this.view.updateEquation(`y=(${absvalNumerator}/${input})|x+_|+_`)
                } else if (xShift == null) {
                    absvalSubmission.setXShift(input);
                    this.view.updateEquation(`y=(${absvalNumerator}/${absvalDenominator})|x+${input}|+_`)
                } else {
                    absvalSubmission.setYShift(input);
                    this.view.updateEquation(`y=(${absvalNumerator}/${absvalDenominator})|x+${xShift}|+${input}`)
                }
            break;
        }
    }

    private handleEquationReset(): void {
        console.log('Reset button clicked');
        switch(this.type) {
            case LINEAR:
                let linearSubmission = this.submission as Linear;
                linearSubmission.setDenominator(null);
                linearSubmission.setNumerator(null);
                linearSubmission.setIntercept(null)
                this.view.updateEquation("y=(_/_)x+_");
            break;
            case QUADRATIC:
                let quadraticSubmission = this.submission as Quadratic;
                quadraticSubmission.setRoot1(null);
                quadraticSubmission.setRoot2(null);
                this.view.updateEquation("y=(x+_)(x+_)");
            break;
            case ABSVAL:
                let absvalSubmission = this.submission as AbsoluteValue;
                absvalSubmission.setNumerator(null);
                absvalSubmission.setDenominator(null);
                absvalSubmission.setXShift(null);
                absvalSubmission.setYShift(null);
                this.view.updateEquation(`y=(_/_)|x+_|+_`);
            break;
        }
        this.view.resetGraph();
    }

    private handleEquationSubmission(submission: EquationAnswerFormat): boolean {
        console.log('Submit button clicked');
        if (submission.checkCompleteSubmission()) {
            console.log(submission);
            this.model.enterSubmission(submission);
        }
        this.submitEquationInput();
        return false
    }

    private submitEquationInput(): void {
        this.plotGraphGame(false); // isPreview = false
        if (this.model.getAnswer().verifyAnswer(this.submission)) {
            this.view.updateEquation("CORRECT")
        } else {
            this.view.updateEquation("WRONG");
        }
    }

    private previewEquationInput(): void {
        this.plotGraphGame(true); // isPreview = true
    }

    private plotGraphGame(isPreview: boolean): void {
        this.view.plotGraph(isPreview, this.type, this.submission);
    }

    private switchToMazeGame(): void {
        // TODO: switch to maze game
    }

    private switchToMatchGame(): void {
        // TODO: switch to match game
    }
}
