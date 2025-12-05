import { generateRandomNumber, ScreenController } from "../../types";
import type { Screen } from "../../types";
import { GraphScreenView } from "./GraphScreenView";
import { GraphScreenModel } from "./GraphScreenModel";
import { AbsoluteValue, Quadratic, type EquationAnswerFormat, type ScreenSwitcher } from "../../types";
import { LINEAR, QUADRATIC, ABSVAL, LEVEL_COUNT } from "../../constants";
import { DIALOGUE } from "./GraphScreenConstants";
import { Linear } from "../../types";

/**
 * Controller for the Graphing game module
 */
export class GraphScreenController extends ScreenController {
    private model: GraphScreenModel;
    private view: GraphScreenView;
    private level: number;
    private difficulty: number;
    private type: string;
    private screenSwitcher: ScreenSwitcher;
    private submission: EquationAnswerFormat;
    private handleEscapeShortcut = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            event.preventDefault();
            this.screenSwitcher.switchToScreen({ type: "statistics" });
        }
    };

    /**
     * Initializes default values for the Controller
     */
    constructor(screenSwitcher: ScreenSwitcher, level: number, difficulty: number) {
        super();
        this.screenSwitcher = screenSwitcher;
        this.level = level;
        this.difficulty = difficulty;
        //let type = generateRandomNumber(0, this.difficulty);
        let type = 2;
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
            () => this.handleEquationSubmission(this.submission),
            () => this.screenSwitcher.switchToScreen({ type: "tutorial" })
        );
        this.view.plotPOI(this.model.getAnswer());
        this.view.updateLevel(`Level ${this.level}`);
        const dialogueKey = (`level${this.level}`) as keyof typeof DIALOGUE;
        this.view.updateDialogue(DIALOGUE[dialogueKey]);
    }

    /**
     * 
     * @returns The Graphing game module's View
     */
    getView(): GraphScreenView{
        return this.view;
    }

    show(): void {
        document.addEventListener("keydown", this.handleEscapeShortcut);
        this.view.show();
    }

    hide(): void {
        document.removeEventListener("keydown", this.handleEscapeShortcut);
        this.view.hide();
    }

    private handleLinearInput(input: number) {
        let text = `y=(`;
        function determineSign(isPos: boolean, signRequired: boolean) {
            if (!isPos) text += `-`;
            else if (signRequired) text += `+`;
        }

        let submission = this.submission as Linear;
        console.log (submission.getCoefficient());
        let numerator = submission.getCoefficient().numerator;
        if (numerator != null) numerator = Math.abs(numerator);
        let denominator = submission.getCoefficient().denominator;
        let coefficientIsPos = submission.getCoefficientIsPos();
        let intercept = submission.getIntercept();
        let interceptIsPos = submission.getInterceptIsPos();

        if (numerator == null) {
            if (input == -1) {
                submission.setCoefficientIsPos();
                determineSign(!coefficientIsPos, false);
                text += `_/_)x+_`;
                this.view.updateEquation(text);
                return;
            }
            submission.setNumerator(input);
            console.log(submission.getCoefficient().numerator);
            determineSign(coefficientIsPos, false);
            text += `${input}/_)x+_`;
            this.view.updateEquation(text);
        } else if (denominator == null) {
            if (input == -1) {
                submission.setCoefficientIsPos();
                determineSign(!coefficientIsPos, false);
                text += `${numerator}/_)x+_`
                this.view.updateEquation(text);
                return;
            }
            submission.setDenominator(input);
            console.log(submission.getCoefficient().denominator);
            determineSign(coefficientIsPos, false);
            text += `${numerator}/${input})x+_`;
            this.view.updateEquation(text);
        } else {
            if (input == -1) {
                submission.setInterceptIsPos();
                determineSign(coefficientIsPos, false);
                text += `${numerator}/${denominator})x`;
                determineSign(!interceptIsPos, true);
                if (intercept != null) text += `${input}`;
                else text += `_`
                this.view.updateEquation(text);
                return;
            }
            submission.setIntercept(input);
            console.log(submission.getIntercept());
            determineSign(coefficientIsPos, false);
            text += `${numerator}/${denominator})x`;
            determineSign(interceptIsPos, true);
            text += `${input}`
            this.view.updateEquation(text);
        }
    }

    private handleQuadraticInput(input: number) {
        let text = `y=(x`
        function determineSign(isPos: boolean, signRequired: boolean) {
            if (!isPos) text += `-`;
            else if (signRequired) text += `+`;
        }
        
        let submission = this.submission as Quadratic;
        let root1 = submission.getRoot1();
        if (root1 != null) root1 = Math.abs(root1);
        let root1IsPos = submission.getRoot1IsPos();
        let root2 = submission.getRoot2();
        if (root2 != null) root2 = Math.abs(root1);
        let root2IsPos = submission.getRoot2IsPos();

        if (root1 == null) {
            if (input == -1) {
                submission.setRoot1IsPos();
                determineSign(!root1IsPos, true);
                text += `_)(x+_)`
                this.view.updateEquation(text);
                return;
            }
            submission.setRoot1(input)
            determineSign(root1IsPos, true);
            text += `${input})(x+_)`;
            this.view.updateEquation(text);
        } else {
            determineSign(root1IsPos, true);
            text += `${root1})(x`
            if (input == -1) {
                submission.setRoot2IsPos();
                determineSign(!root2IsPos, true);
                if (root2 != null) text += `${root2})`;
                else text += `_)`;
                this.view.updateEquation(text)
                return;
            }
            submission.setRoot2(input);
            determineSign(root2IsPos, true);
            text += `${input})`;
            this.view.updateEquation(text);
        }
    }

    private handleAbsValInput(input: number) {
        let text = `y=`
        function determineSign(isPos: boolean, signRequired: boolean) {
            if (!isPos) text += `-`;
            else if (signRequired) text += `+`;
        }

        let submission = this.submission as AbsoluteValue;
        let numerator = submission.getCoefficient().numerator;
        if (numerator != null) numerator = Math.abs(numerator);
        let denominator = submission.getCoefficient().denominator;
        let coefficientIsPos = submission.getCoefficientIsPos();
        let xShift = submission.getXShift();
        if (xShift != null) xShift = Math.abs(xShift);
        let xShiftIsPos = submission.getXShiftIsPos();
        let yShift = submission.getYShift();
        if (yShift != null) yShift = Math.abs(yShift);
        let yShiftIsPos = submission.getYShiftIsPos();

        if (numerator == null) {
            if (input == -1) {
                submission.setCoefficientIsPos();
                determineSign(!coefficientIsPos, false);
                text += `(_/_)|x+_|+_`;
                this.view.updateEquation(text);
                return;
            }
            submission.setNumerator(input);
            console.log(submission.getCoefficient().numerator);
            determineSign(coefficientIsPos, false);
            text += `(${input}/_)|x+_|+_`;
            this.view.updateEquation(text);
        } else if (denominator == null) {
            if (input == -1) {
                submission.setCoefficientIsPos();
                determineSign(!coefficientIsPos, false);
                text += `(${numerator}/_)|x+_|+_`;
                this.view.updateEquation(text);
                return;
            }
            submission.setDenominator(input);
            console.log(submission.getCoefficient().numerator);
            determineSign(coefficientIsPos, false);
            text += `(${numerator}/${input})|x+_|+_`;
            this.view.updateEquation(text);
        } else if (xShift == null) {
            determineSign(coefficientIsPos, false);
            text += `(${numerator}/${denominator})|x`;
            if (input == -1) {
                submission.setXShiftIsPos();
                determineSign(!xShiftIsPos, true);
                text += `_|+_`
                this.view.updateEquation(text);
                return;
            }
            submission.setXShift(input);
            determineSign(xShiftIsPos, true);
            text += `${input}|+_`
            this.view.updateEquation(text);
        } else {
            determineSign(coefficientIsPos, false);
            text += `(${numerator}/${denominator})|x`;
            determineSign(xShiftIsPos, true);
            text += `${xShift}|`;
            if (input == -1) {
                console.log("IN Y SHIFT CHCECK")
                submission.setYShiftIsPos();
                determineSign(!yShiftIsPos, true);
                if (yShift != null) text += `${yShift}`;
                else text += `_`;
                this.view.updateEquation(text);
                return;
            }
            submission.setYShift(input);
            determineSign(yShiftIsPos, true);
            text += `${input}`;
            this.view.updateEquation(text);
        }
    }

    private handleNumberInput(input: number) {
        switch (this.type) {
            case LINEAR:
                this.handleLinearInput(input);
            break;
            case QUADRATIC:
                this.handleQuadraticInput(input);
            break;
            case ABSVAL:
                this.handleAbsValInput(input);
            break;
        }
    }

    private handleEquationReset(): void {
        console.log('Reset button clicked');
        switch(this.type) {
            case LINEAR:
                this.submission = new Linear(false);
                this.view.updateEquation("y=(_/_)x+_");
            break;
            case QUADRATIC:
                this.submission = new Quadratic(false);
                this.view.updateEquation("y=(x+_)(x+_)");
            break;
            case ABSVAL:
                this.submission = new AbsoluteValue(false);
                this.view.updateEquation(`y=(_/_)|x+_|+_`);
            break;
        }
        this.view.resetGraph();
    }

    private handleEquationSubmission(submission: EquationAnswerFormat): void {
        console.log('Submit button clicked');
        console.log(submission);
        if (submission.checkCompleteSubmission()) {
            console.log(submission);
            this.model.enterSubmission(submission);
            this.submitEquationInput();
            this.view.disableSubmissions();
        } else {
            this.view.updateDialogue(DIALOGUE.incomplete);
            this.handleEquationReset();
        }
    }

    private submitEquationInput(): void {
        this.plotGraphGame(false); // isPreview = false
        if (this.model.getAnswer().verifyAnswer(this.submission)) {
            // correct answer api call
            void this.model.recordAttempt(true, this.type)
            if(this.level >= LEVEL_COUNT) {
                this.view.hideTutorialButton();
                this.view.showResultsButton(() => this.switchGame("results"));
                this.view.updateDialogue(DIALOGUE.gameOver);
                this.level++;
                this.view.updateLevel("Game Clear!");
            } else {
                this.view.hideTutorialButton();
                this.view.showTransitionButton((game: string) => this.switchGame(game), "maze-game");
                this.view.updateDialogue(DIALOGUE.success);
                this.level++;
            }
        } else {
            // incorrect answer api call
            void this.model.recordAttempt(false, this.type);
            this.view.hideTutorialButton();
            this.view.showTransitionButton((game: string) => this.switchGame(game), "matching-game");
            this.view.updateDialogue(DIALOGUE.failure);
            console.log(DIALOGUE.failure);
        }
    }

    private previewEquationInput(): void {
        this.plotGraphGame(true); // isPreview = true
    }

    private plotGraphGame(isPreview: boolean): void {
        this.view.plotGraph(isPreview, this.type, this.submission);
    }

    private switchGame(game: Screen): void {
        let type = generateRandomNumber(0, this.difficulty);
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
        this.view.reset(
                type,
                (input: number) => this.handleNumberInput(input),
                () => this.handleEquationReset(),
                () => this.handleEquationSubmission(this.submission),
        );
        this.view.plotPOI(this.model.getAnswer());
        if(this.level > LEVEL_COUNT) {
            this.view.updateDialogue(DIALOGUE.gameOver);
            this.view.updateLevel("Game Clear!");
        } else {
            const dialogueKey = (`level${this.level}`) as keyof typeof DIALOGUE;
            this.view.updateDialogue(DIALOGUE[dialogueKey]);
            this.view.updateLevel(`Level ${this.level}`);
        }
        this.screenSwitcher.switchToScreen({ type: game });
    }
}
