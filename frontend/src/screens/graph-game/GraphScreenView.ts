import Konva from "konva";
import "../../styles.css";
import type { AbsoluteValue, EquationAnswerFormat, Linear, Quadratic, View } from "../../types";
import {
  OFFSET,
  BOX_WIDTH,
  BACKGROUND_PROPERTIES,
  STATIC_GROUP_PROPERTIES,
  GRAPH_GROUP_PROPERTIES,
  GRAPH_BACKGROUND_PROPERTIES,
  LEVEL_GROUP_PROPERTIES,
  LEVEL_BOX_PROPERTIES,
  LEVEL_TEXT_PROPERTIES,
  DIALOGUE_GROUP_PROPERTIES,
  DIALOGUE_BOX_PROPERTIES,
  DIALOGUE_TEXT_PROPERTIES,
  TRANSITION_GROUP_PROPERTIES,
  TRANSITION_BUTTON_PROPERTIES,
  TRANSITION_TEXT_PROPERTIES,
  RESULTS_GROUP_PROPERTIES,
  RESULTS_BUTTON_PROPERTIES,
  RESULTS_TEXT_PROPERTIES,
  TUTORIAL_GROUP_PROPERTIES,
  TUTORIAL_BUTTON_PROPERTIES,
  TUTORIAL_TEXT_PROPERTIES,
  INPUT_AND_EQUATION_GROUP_PROPERTIES,
  INPUT_AND_EQUATION_BOX_PROPERTIES,
  EQUATION_BOX_PROPERTIES,
  EQUATION_TEXT_PROPERTIES,
  PIX_PER_UNIT
} from "./GraphScreenConstants";
import { generateRandomNumber } from "../../types";
import { ABSVAL, LINEAR, QUADRATIC, X_MAX, X_MIN, STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

/**
 * View for the Graphing game module
 */
export class GraphScreenView implements View {
    private staticLayer: Konva.Layer;
    private dynamicLayer: Konva.Layer;
    private staticGroup: Konva.Group;
    private graphGroup: Konva.Group;
    private transitionGroup: Konva.Group;
    private resultsGroup: Konva.Group;
    private tutorialGroup: Konva.Group;
    private submitButtonGroup: Konva.Group;
    private dialogueText: Konva.Text;
    private levelText: Konva.Text;
    private equationText: Konva.Text;
    private inputAndEquationGroup: Konva.Group;
    private transitionScreen: Konva.Rect;

    private width: number = GRAPH_BACKGROUND_PROPERTIES.width;
    private height: number = GRAPH_BACKGROUND_PROPERTIES.height;
    private xRange: number = this.width / PIX_PER_UNIT;
    private yRange: number = this.height / PIX_PER_UNIT;
    private xMin = -this.xRange / 2;
    private xMax = this.xMin + this.xRange;
    private yMax = this.yRange / 2;
    private yMin = this.yMax - this.yRange;
    /**
     * Initializes default values for the View
     */
    constructor(type: number, onNumberInput: (input: number) => void, onEquationReset: () => void, onEquationSubmission: () => void, showTutorial: () => void) {

        // Add transition screen for fade to black
        this.transitionScreen = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "black",
            opacity: 0.0,
        });


        // Add layers for static and dynamic elements
        console.log("this.xMax: " + this.xMax);
        console.log("this.yMax: " + this.yMax);
        console.log("this.xRange: " + this.xRange);
        console.log(GRAPH_BACKGROUND_PROPERTIES.width);
        console.log(GRAPH_BACKGROUND_PROPERTIES.height);
        
        this.staticLayer = new Konva.Layer();
        this.dynamicLayer = new Konva.Layer();
        
        // Container groups
        
        this.staticGroup = new Konva.Group({
            ...STATIC_GROUP_PROPERTIES
        });

        // Background element
    
        const background = new Konva.Rect({
            ...BACKGROUND_PROPERTIES
        });

        // Level group elements

        const levelGroup = new Konva.Group({
            ...LEVEL_GROUP_PROPERTIES
        });

        const levelBox = new Konva.Rect({
            ...LEVEL_BOX_PROPERTIES
        });
        
        this.levelText = new Konva.Text({
            ...LEVEL_TEXT_PROPERTIES
        });

        levelGroup.add(levelBox, this.levelText);

        // Dialogue group elements

        const dialogueGroup = new Konva.Group({
            ...DIALOGUE_GROUP_PROPERTIES
        });

        const dialogueBox = new Konva.Rect({
            ...DIALOGUE_BOX_PROPERTIES
        });

        this.dialogueText = new Konva.Text({
            ...DIALOGUE_TEXT_PROPERTIES
        });

        this.transitionGroup = new Konva.Group({
            ...TRANSITION_GROUP_PROPERTIES
        });

        const transitionButton = new Konva.Rect({
            ...TRANSITION_BUTTON_PROPERTIES
        });

        const transitionText = new Konva.Text({
            ...TRANSITION_TEXT_PROPERTIES
        });

        this.addButtonAnimations(this.transitionGroup, transitionButton);
        this.transitionGroup.add(transitionButton, transitionText);
        
        this.resultsGroup = new Konva.Group({
            ...RESULTS_GROUP_PROPERTIES
        });

        const resultsButton = new Konva.Rect({
            ...RESULTS_BUTTON_PROPERTIES
        });

        const resultsText = new Konva.Text({
            ...RESULTS_TEXT_PROPERTIES
        });
        
        this.addButtonAnimations(this.resultsGroup, resultsButton);
        this.resultsGroup.add(resultsButton, resultsText);
        
        this.tutorialGroup = new Konva.Group({
            ...TUTORIAL_GROUP_PROPERTIES
        });

        const tutorialButton = new Konva.Rect({
            ...TUTORIAL_BUTTON_PROPERTIES
        });

        const tutorialText = new Konva.Text({
            ...TUTORIAL_TEXT_PROPERTIES
        });

        this.addButtonAnimations(this.tutorialGroup, tutorialButton);
        this.tutorialGroup.add(tutorialButton, tutorialText);
        this.tutorialGroup.on("click", () => showTutorial());

        dialogueGroup.add(dialogueBox, this.dialogueText, this.transitionGroup, this.resultsGroup, this.tutorialGroup);
        this.transitionGroup.hide();
        this.resultsGroup.hide();

        // Input/Equation group elements

        this.inputAndEquationGroup = new Konva.Group({
            ...INPUT_AND_EQUATION_GROUP_PROPERTIES
        });

        const inputAndEquationBox = new Konva.Rect({
            ...INPUT_AND_EQUATION_BOX_PROPERTIES
        });

        const equationBox = new Konva.Rect({
            ...EQUATION_BOX_PROPERTIES
        });

        this.equationText = new Konva.Text({
            ...EQUATION_TEXT_PROPERTIES
        });

        switch (type) {
            case 0:
                this.equationText.text("y=(_/_)x+_");
            break;
            case 1:
                this.equationText.text("y=(x+_)(x+_)");
            break;
            case 2:
                this.equationText.text("y=(_/_)|x+_|+_");
            break;
        }

        console.log(this.equationText.text());
        
        const keypadGroup = this.createInputButtons(onNumberInput, onEquationReset, onEquationSubmission);

        this.inputAndEquationGroup.add(inputAndEquationBox, equationBox, this.equationText, keypadGroup);
        
        // Graph group elements

        this.graphGroup = this.createGraphGroup();
        this.staticGroup.add(background, levelGroup, dialogueGroup, this.inputAndEquationGroup);
        this.staticLayer.add(this.staticGroup);
        this.dynamicLayer.add(this.graphGroup);
    }

    disableSubmissions(): void {
        this.submitButtonGroup.off("click");
    }

    reset(type: number, onNumberInput: (input: number) => void, onEquationReset: () => void, onEquationSubmission: () => void): void {
        this.inputAndEquationGroup.destroy();
        this.graphGroup.destroy();
        this.hideTransitionButton();
        this.hideResultsButton();
        this.showTutorialButton();

        this.inputAndEquationGroup = new Konva.Group({
            ...INPUT_AND_EQUATION_GROUP_PROPERTIES
        });

        const inputAndEquationBox = new Konva.Rect({
            ...INPUT_AND_EQUATION_BOX_PROPERTIES
        });

        const equationBox = new Konva.Rect({
            ...EQUATION_BOX_PROPERTIES
        });

        this.equationText = new Konva.Text({
            ...EQUATION_TEXT_PROPERTIES
        });

        switch (type) {
            case 0:
                this.equationText.text("y=(_/_)x+_");
            break;
            case 1:
                this.equationText.text("y=(x+_)(x+_)");
            break;
            case 2:
                this.equationText.text("y=|(_/_)x+_|+_");
            break;
        }

        console.log(this.equationText.text());
        
        const keypadGroup = this.createInputButtons(onNumberInput, onEquationReset, onEquationSubmission);

        this.inputAndEquationGroup.add(inputAndEquationBox, equationBox, this.equationText, keypadGroup);

        this.graphGroup = this.createGraphGroup();
        this.staticGroup.add(this.inputAndEquationGroup);

        this.staticLayer.add(this.staticGroup);
        this.transitionGroup.moveToBottom();
        this.dynamicLayer.add(this.graphGroup);
        this.dynamicLayer.hide();
    }

    addPOIRectangle(x: number, y: number, color: string) {
        const rect1 = new Konva.Rect({
            x: this.convertCoordToKonva(x, true) - 5,
            y: this.convertCoordToKonva(y, false) - 5,
            width: 10,
            height: 10,
            fill: color,
            stroke: 'white',
            strokeWidth: 2,
            name: "POI"
        });
        this.graphGroup.add(rect1);
    }

    resetGraph() {
        let found = this.graphGroup.find( (item: Konva.Rect | Konva.Line) => {
            return item.name() === "TEMP" || item.name() === "PLOT";
        });
        console.log("Found size: " + found.length);
        for (let i = 0; i < found.length; i++) {
            found[i].destroy();
        }
    }

    showTransitionButton(switchGame: (game: string) => void, game: string) {
        this.transitionGroup.show();
        this.transitionGroup.off("click");
        this.transitionGroup.on("click", () => switchGame(game));
    }

    showResultsButton(goToResults: () => void) {
        this.resultsGroup.show();
        this.resultsGroup.on("click", () => goToResults());
    }

    showTutorialButton() {
        this.tutorialGroup.show();
    }

    hideTransitionButton() {
        this.transitionGroup.hide();
    }

    hideResultsButton() {
        this.resultsGroup.off("click");
        this.resultsGroup.hide();
    }

    hideTutorialButton() {
        this.tutorialGroup.hide();
    }

    addButtonAnimations(buttonGroup: Konva.Group, button: Konva.Rect) {
        buttonGroup.offsetX(buttonGroup.width() / 2);
        buttonGroup.offsetY(buttonGroup.height() / 2);
        buttonGroup.x(buttonGroup.x() + buttonGroup.width() / 2);
        buttonGroup.y(buttonGroup.y() + buttonGroup.height() / 2);
      
        buttonGroup.on("mouseenter", () => {
            document.body.style.cursor = "pointer";
            button.to({
                duration: 0.15
            });
        });
        
        buttonGroup.on("mouseleave", () => {
            document.body.style.cursor = "default";
            button.to({
                duration: 0.15
            });
        });
        
        buttonGroup.on("mousedown", () => {
            buttonGroup.to({
                scaleX: 0.85,
                scaleY: 0.85,
                duration: 0.1
            });
        });
        
        buttonGroup.on("mouseup", () => {
            buttonGroup.to({
                scaleX: 1,
                scaleY: 1,
                duration: 0.1
            });
        });
    }

    /**
     * Creates equation/input group buttons
     */
    createInputButtons(onNumberInput: (input: number) => void, onEquationReset: () => void, onEquationSubmission: () => void): Konva.Group {
        const fill = "#5F5050";
        const smallOffset = OFFSET * (1/4);
        const rows = 3;
        const columns = 5;
        const numberColumns = 3;
        const buttonCount = 9;

        const KEYPAD_GROUP_PROPERTIES = {
            x: OFFSET * (3/2),
            y: INPUT_AND_EQUATION_BOX_PROPERTIES.height * (1/4),
            width: BOX_WIDTH - OFFSET,
            height: INPUT_AND_EQUATION_BOX_PROPERTIES.height * (3/4),
        };

        const keypadGroup = new Konva.Group({
            ...KEYPAD_GROUP_PROPERTIES
        });

        for(let i = 0; i < buttonCount; i++) {
            const buttonGroup = new Konva.Group({
                x: (KEYPAD_GROUP_PROPERTIES.width * (1 / columns)) * (i % numberColumns),
                y: (KEYPAD_GROUP_PROPERTIES.height * (1 / rows)) * Math.floor(i / numberColumns),
                width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns),
                height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows)
            });

            const button = new Konva.Rect({
                x: 0,
                y: 0,
                width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns) - smallOffset,
                height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
                fill: fill
            });

            const buttonText = new Konva.Text({
                x: 0,
                y: 0,
                width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns) - smallOffset,
                height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
                text: (i + 1).toString(),
                fontSize: 30,
                fontFamily: "medodica",
                fill: "white",
                align: "center",
                verticalAlign: "middle"
            });
            
            buttonGroup.on("click", () => onNumberInput(i + 1));
            this.addButtonAnimations(buttonGroup, button);
            buttonGroup.add(button);
            buttonGroup.add(buttonText);
            keypadGroup.add(buttonGroup);
        }
        
        const zeroButtonGroup = new Konva.Group({
            x: (KEYPAD_GROUP_PROPERTIES.width * (1 / columns)) * (numberColumns),
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows)
        });

        const zeroButton = new Konva.Rect({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            fill: fill
        });
      
        const zeroButtonText = new Konva.Text({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            text: "0",
            fontSize: 30,
            fontFamily: "medodica",
            fill: "white",
            align: "center",
            verticalAlign: "middle"
        });

        const minusButtonGroup = new Konva.Group({
            x: (KEYPAD_GROUP_PROPERTIES.width * (1 / columns)) * (numberColumns +1),
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows)
        });

        const minusButton = new Konva.Rect({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            fill: fill
        });
      
        const minusButtonText = new Konva.Text({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            text: "-",
            fontSize: 30,
            fontFamily: "medodica",
            fill: "white",
            align: "center",
            verticalAlign: "middle"
        });
      
        zeroButtonGroup.on("click", () => onNumberInput(0));
        this.addButtonAnimations(zeroButtonGroup, zeroButton);
        zeroButtonGroup.add(zeroButton);
        zeroButtonGroup.add(zeroButtonText);
        keypadGroup.add(zeroButtonGroup);

        minusButtonGroup.on("click", () => onNumberInput(-1));
        this.addButtonAnimations(minusButtonGroup, minusButton);
        minusButtonGroup.add(minusButton);
        minusButtonGroup.add(minusButtonText);
        keypadGroup.add(minusButtonGroup)

        const resetButtonGroup = new Konva.Group({
            x: (KEYPAD_GROUP_PROPERTIES.width * (1 / columns)) * (numberColumns),
            y: (KEYPAD_GROUP_PROPERTIES.height * (1 / rows)),
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows)
        });

        const resetButton = new Konva.Rect({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            fill: fill
        });

        const resetButtonText = new Konva.Text({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            text: "reset",
            fontSize: 30,
            fontFamily: "medodica",
            fill: "white",
            align: "center",
            verticalAlign: "middle"
        });
      
        resetButtonGroup.on("click", onEquationReset)
        this.addButtonAnimations(resetButtonGroup, resetButton);
        resetButtonGroup.add(resetButton);
        resetButtonGroup.add(resetButtonText);
        keypadGroup.add(resetButtonGroup);

        this.submitButtonGroup = new Konva.Group({
            x: (KEYPAD_GROUP_PROPERTIES.width * (1 / columns)) * (numberColumns),
            y: (KEYPAD_GROUP_PROPERTIES.height * (1 / rows)) * 2,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows)
        });

        const submitButton = new Konva.Rect({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            fill: fill
        });

        const submitButtonText = new Konva.Text({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            text: "submit",
            fontSize: 30,
            fontFamily: "medodica",
            fill: "white",
            align: "center",
            verticalAlign: "middle"
        });
      
        this.submitButtonGroup.on("click", onEquationSubmission);
        this.addButtonAnimations(this.submitButtonGroup, submitButton);
        this.submitButtonGroup.add(submitButton);
        this.submitButtonGroup.add(submitButtonText);
        keypadGroup.add(this.submitButtonGroup);

        return keypadGroup;
    }

    updateLevel(level: string): void {
        if (this.levelText.getAttr("timeoutId")) {
            clearTimeout(this.levelText.getAttr("timeoutId"));
        }

        let index = 0;
        const speed = 70;

        this.levelText.text("");

        const typeWriter = () => {
            if (index < level.length) {
                this.levelText.text(this.levelText.text() + level.charAt(index));
                this.staticLayer.draw();
                index++;
                const timeoutId = setTimeout(typeWriter, speed);
                this.levelText.setAttr("timeoutId", timeoutId);
            }
        };

        typeWriter();
    }

    updateDialogue(dialogue: string): void {
        if (this.dialogueText.getAttr("timeoutId")) {
            clearTimeout(this.dialogueText.getAttr("timeoutId"));
        }

        let index = 0;
        const speed = 30;

        this.dialogueText.text("");

        const typeWriter = () => {
            if (index < dialogue.length) {
                this.dialogueText.text(this.dialogueText.text() + dialogue.charAt(index));
                this.staticLayer.draw();
                index++;
                const timeoutId = setTimeout(typeWriter, speed);
                this.dialogueText.setAttr("timeoutId", timeoutId);
            }
        };

        typeWriter();
    }

    updateEquation(equation: string): void {
        this.equationText.text(equation);
        this.staticLayer.draw();
    }

    getLevel(): HTMLImageElement {
        return this.levelText;
    }

    getDialogue(): Konva.Text {
        return this.dialogueText;
    }

    getEquation(): Konva.Text {
        return this.equationText;
    }

    getSprite(sprite: number, x:number, y: number): number {
        let path = "/sprites/"
        let scale = 0.75;
        let xOffset = 0;
        let yOffset = 0;
        let spaceTaken = 0;
        let z = 1;
        let imageID = ""
        switch(sprite) {
            case -1:
                path += "asteroid_1x1.png";
                xOffset = 20;
                break;
            case 0:
                path += "asteroid_2x2.png";
                xOffset = 40;
                yOffset = 0;
                spaceTaken = 2;
            break;
            case 1:
                path += "asteroid_2x3.png";
                xOffset = 40;
                yOffset = 0;
                spaceTaken = 3;
            break;
            case 2:
                path += "asteroid_3x4.png";
                xOffset = 80;
                yOffset = 0;
                spaceTaken = 4;
            break;
            case 3: 
                path += "rocket.png";
                xOffset = 20;
                yOffset = 20;
                z = 999;
                imageID = "rocket";
                scale = 1.1
            break;
            case 4:
                path += "blackhole.png";    
                yOffset = 80;
                xOffset = 80;
            break;
            case 5:
                path += "planet1.png";
                xOffset = 20;
                yOffset = 20;
                scale = 1.1
                z = 999;
            break;
            case 6:
                path += "planet2.png";
                xOffset = 20;
                yOffset = 20;
                scale = 1.1
                z = 999;
            break;
            case 7:
                path += "planet3.png";
                xOffset = 20;
                yOffset = 20;
                scale = 1.1
                z = 999;
            break;
        }
        console.log("path: " + path);
        Konva.Image.fromURL(path, (image) => {
            console.log(image);
            image.scale({
                x: scale,
                y: scale
            });
            image.offset({
                x: xOffset,
                y: yOffset
            })
            image.x(this.convertCoordToKonva(x, true));
            image.y(this.convertCoordToKonva(y, false));
            this.graphGroup.add(image);
            image.zIndex(z);
            image.id(imageID);
        });
        return spaceTaken;
    }

    plotLinearObstacles(answer: EquationAnswerFormat) {
        let linear = answer as Linear;
        let intercept = linear.getIntercept();
        let coefficient = linear.getCoefficient();
        let gap = 2;

        let spaceAbove = this.yMax - intercept - 2;
        let spaceBelow = intercept - this.yMin - 4;
        console.log("SB: " + spaceBelow);
        this.getSprite(0, 0, this.yMax);
        this.getSprite(0, 0, this.yMin + 2);
        while (spaceAbove > 5) {
            spaceAbove -= this.getSprite(generateRandomNumber(0, 2), 0, intercept + spaceAbove);
            console.log("SA: " + spaceAbove)
        }
        if (spaceAbove == 3 && Math.abs(coefficient.numerator) < 4) this.getSprite(0, 0, intercept + spaceAbove);
        else if (spaceAbove == 3) this.getSprite(-1, 0, intercept + 3);
        if (spaceAbove >= 4) this.getSprite(0, 0, intercept + spaceAbove);
        while (spaceBelow > 2) {
            spaceBelow -= this.getSprite(generateRandomNumber(0, 1), 0, this.yMin + spaceBelow + 2);
        }
        if (coefficient.numerator < 4) this.getSprite(-1, 0, intercept - 1);
        if (spaceBelow == 4) spaceBelow -= this.getSprite(0, 0, intercept + spaceBelow);
        if (spaceBelow == 1) spaceBelow -= this.getSprite(-1, 0, this.yMin + 3);
        if (spaceBelow == 2) spaceBelow -= this.getSprite(0, 0, this.yMin + 4);
        console.log("SB Final: " + spaceBelow);
        console.log("SA Final: " + spaceAbove);
    }
    
    plotAbsValObstacles(answer: EquationAnswerFormat) {
        let absVal = answer as AbsoluteValue;
        let yShift = absVal.getYShift();
        let xShift = -absVal.getXShift();
        let coefficient = absVal.getCoefficient();
        let gap = 2;

        let spaceAbove = this.yMax - yShift - 2;
        let spaceBelow = yShift - this.yMin - 4;
        console.log("SB: " + spaceBelow);
        this.getSprite(0, xShift, this.yMax);
        this.getSprite(0, xShift, this.yMin + 2);
        while (spaceAbove > 5) {
            let spaceTaken = this.getSprite(generateRandomNumber(0, 2), xShift, yShift + spaceAbove);
            spaceAbove -= spaceTaken;
            console.log("SA: " + spaceAbove);
        }
        if (spaceAbove == 3 && Math.abs(coefficient.numerator) < 4) this.getSprite(0, xShift, yShift + spaceAbove);
        else if (spaceAbove == 3) this.getSprite(-1, xShift, yShift + 3);
        if (spaceAbove >= 4) this.getSprite(0, xShift, yShift + spaceAbove);
        while (spaceBelow > 2) {
            spaceBelow -= this.getSprite(generateRandomNumber(0, 1), xShift, this.yMin + spaceBelow + 2);
        }
        if (coefficient.numerator < 4) this.getSprite(-1, xShift, yShift - 1);
        if (spaceBelow == 4) spaceBelow -= this.getSprite(0, xShift, yShift + spaceBelow);
        if (spaceBelow == 1) spaceBelow -= this.getSprite(-1, xShift, this.yMin + 3);
        if (spaceBelow == 2) spaceBelow -= this.getSprite(0, xShift, this.yMin + 4);
        console.log("SB Final: " + spaceBelow);
        console.log("SA Final: " + spaceAbove);
    }

    plotQuadraticObstacles(answer: EquationAnswerFormat) {
        let quadratic = answer as Quadratic;
        let root1 = quadratic.getRoot1();
        let root2 = quadratic.getRoot2();
        console.log(root1);
        let middle = (root1 + root2) / 2;
        console.log("middle: " + middle)
        this.getSprite(4, middle, 0);
    }
    
    plotLinearPOI(answer: EquationAnswerFormat) {
        let linear = answer as Linear;
        let numerator = linear.getCoefficient().numerator;
        let denominator = linear.getCoefficient().denominator;
        let intercept = linear.getIntercept();

        let rocketX = -denominator;
        let rocketY = intercept - numerator;
        let goalX = denominator;
        let goalY = intercept + numerator;
        this.getSprite(3, rocketX, rocketY);
        this.getSprite(generateRandomNumber(5, 7), goalX, goalY);
        this.addPOIRectangle(0, intercept, "red");
    }

    plotQuadraticPOI(answer: EquationAnswerFormat) {
        let quadratic = answer as Quadratic;
        let root1 = quadratic.getRoot1();
        let root2 = quadratic.getRoot2();
        this.getSprite(3, root1, 0);
        this.getSprite(generateRandomNumber(5, 7), root2, 0);
    }

    plotAbsValPOI(answer: EquationAnswerFormat) {
        let abs = answer as AbsoluteValue;
        let numerator = abs.getCoefficient().numerator;
        let denominator = abs.getCoefficient().denominator;
        let xShift = -abs.getXShift();
        let yShift = abs.getYShift();
        
        let rocketX = xShift - denominator;
        let rocketY = yShift + numerator;
        let goalX = xShift + denominator;
        let goalY = rocketY;
        this.getSprite(3, rocketX, rocketY);
        this.getSprite(generateRandomNumber(5, 7), goalX, goalY);
        this.addPOIRectangle(xShift, yShift, "red");
    }

    plotPOI(answer: EquationAnswerFormat) {
        switch(answer.format) {
            case LINEAR:
                this.plotLinearObstacles(answer);
                this.plotLinearPOI(answer);
            break;
            case QUADRATIC:
                this.plotQuadraticObstacles(answer);
                this.plotQuadraticPOI(answer);
            break;
            case ABSVAL:
                this.plotAbsValObstacles(answer);
                this.plotAbsValPOI(answer);
            break;
        }
    }

    plotLinearGraph(isPreview: boolean, submission: EquationAnswerFormat) {
        let numLines = 400;
        let dx = (this.xMax - this.xMin) / numLines;
        let linearSubmission = submission as Linear;
        let denominator = linearSubmission.getCoefficient().denominator;
        let numerator = linearSubmission.getCoefficient().numerator;
        let intercept = linearSubmission.getIntercept();

        for (let i = 0; i < numLines; i++) {
            let xStart = this.xMin + dx * i;
            let xEnd = this.xMin + dx * (i + 1);
            let yStart = (numerator * xStart) / denominator + intercept;
            let yEnd = (numerator * xEnd) / denominator + intercept;
            if (yStart > this.yMax || yEnd > this.xMax || yStart < this.yMin || yEnd < this.yMin) continue;
            let plotLine = new Konva.Line({
                points: [this.convertCoordToKonva(xStart, true), this.convertCoordToKonva(yStart, false),
                        this.convertCoordToKonva(xEnd, true), this.convertCoordToKonva(yEnd, false)],
                strokeWidth: 3,
                lineCap: 'round',
                name: "PLOT"
            });
            if (isPreview) plotLine.stroke('green');
            else plotLine.stroke('red');
            this.graphGroup.add(plotLine);
        }
    }

    plotQuadraticGraph(isPreview: boolean, submission: EquationAnswerFormat) {
        let numLines = 400;
        let dx = (this.xMax - this.xMin) / numLines;
        let quadraticSubmission = submission as Quadratic;

        for (let i = 0; i < numLines; i++) {
            let xStart = this.xMin + dx * i;
            let xEnd = this.xMin + dx * (i + 1);
            let yStart = (xStart + quadraticSubmission.getRoot1()) * (xStart + quadraticSubmission.getRoot2());
            let yEnd = (xEnd + quadraticSubmission.getRoot1()) * (xEnd + quadraticSubmission.getRoot2());
            if (yStart > this.yMax || yEnd > this.yMax || yStart < this.yMin || yEnd < this.yMin) continue;
            let plotLine = new Konva.Line({
                points: [this.convertCoordToKonva(xStart, true), this.convertCoordToKonva(yStart, false),
                        this.convertCoordToKonva(xEnd, true), this.convertCoordToKonva(yEnd, false)],
                strokeWidth: 3,
                lineCap: 'round',
                name: "PLOT"
            });
            if (isPreview) plotLine.stroke('green');
            else plotLine.stroke('red');
            this.graphGroup.add(plotLine);
        }
    }

    plotAbsValGraph(isPreview: boolean, submission: EquationAnswerFormat) {
        let absvalSubmission = submission as AbsoluteValue;

        let numerator = absvalSubmission.getCoefficient().numerator;
        let denominator = absvalSubmission.getCoefficient().denominator;
        let xShift = -absvalSubmission.getXShift();
        let yShift = absvalSubmission.getYShift();

        let numLines = 200;
        let dx = (xShift - this.xMin) / numLines;
        for (let i = 0; i < numLines; i++) {
            let xStart = this.xMin + dx * i;
            let xEnd = this.xMin + dx * (i + 1);
            let yStart = ((numerator * (-(xStart - xShift))) / denominator) + yShift;
            let yEnd = ((numerator * (-(xEnd - xShift))) / denominator) + yShift;
            if (yStart > this.yMax || yEnd > this.xMax || yStart < this.yMin || yEnd < this.yMin) continue;
            let plotLine = new Konva.Line({
                points: [this.convertCoordToKonva(xStart, true), this.convertCoordToKonva(yStart, false),
                        this.convertCoordToKonva(xEnd, true), this.convertCoordToKonva(yEnd, false)],
                strokeWidth: 3,
                lineCap: 'round',
                name: "PLOT"
            });
            if (isPreview) plotLine.stroke('green');
            else plotLine.stroke('red');
            this.graphGroup.add(plotLine);
        }

        dx = (this.xMax - xShift) / numLines;
        for (let i = 0; i < numLines; i++) {
            let xStart = xShift + dx * i;
            let xEnd = xShift + dx * (i + 1);
            let yStart = ((numerator * (xStart - xShift)) / denominator) + yShift;
            let yEnd = ((numerator * (xEnd - xShift)) / denominator) + yShift;
            if (yStart > this.yMax || yEnd > this.xMax || yStart < this.yMin || yEnd < this.yMin) continue;
            let plotLine = new Konva.Line({
                points: [this.convertCoordToKonva(xStart, true), this.convertCoordToKonva(yStart, false),
                        this.convertCoordToKonva(xEnd, true), this.convertCoordToKonva(yEnd, false)],
                strokeWidth: 3,
                lineCap: 'round',
                name: "PLOT"
            });
            if (isPreview) plotLine.stroke('green');
            else plotLine.stroke('red');
            this.graphGroup.add(plotLine);
        }
    }

    plotGraph(isPreview: boolean, type: string, submission: EquationAnswerFormat) {
        switch(type) {
            case LINEAR:
                this.plotLinearGraph(isPreview, submission);
            break;
            case QUADRATIC:
                this.plotQuadraticGraph(isPreview, submission);
            break;
            case ABSVAL:
                this.plotAbsValGraph(isPreview, submission);
            break;
        }
    }

    createGraphGroup(): Konva.Group {
        let group: Konva.Group = new Konva.Group(GRAPH_GROUP_PROPERTIES);
        let graphChart: Konva.Rect = new Konva.Rect(GRAPH_BACKGROUND_PROPERTIES);
        graphChart.name("CHART");
        let graphChartLeft = OFFSET;
        let graphChartright = graphChart.width() + OFFSET;
        let graphChartTop = OFFSET;
        let graphChartBottom = graphChart.height() + OFFSET;
    
        let currX = this.xMin;
        for (let i = 0; i < this.xRange; i++) {
            let position = graphChartLeft + (i * PIX_PER_UNIT)
            let line = new Konva.Line({
                points: [position, graphChartTop,
                    position, graphChartBottom
                ],
                stroke: 'white',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
            });
            if (currX == 0) {
                line.strokeWidth(3);
            }
    
            let coordinateLabel = new Konva.Text({
                y: group.height() / 2 - PIX_PER_UNIT / 4,
                x: (position) + PIX_PER_UNIT / 10,
                text: currX.toString(),
                fill: 'white',
                fontSize: 18,
                fontFamily: 'medodica'
            })
    
            if (currX != this.xMin) group.add(line);
            currX++;
            group.add(coordinateLabel)
        }
        let currY = this.yMax;
        for (let i = 0; i < this.yRange; i++) {
            let position = graphChartTop + (i * PIX_PER_UNIT);
            let line = new Konva.Line({
                points: [graphChartLeft, position,
                    graphChartright, position
                ],
                stroke: 'white',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round'
            });
            if (currY == 0) {
                line.strokeWidth(3);
            }
    
            let coordinateLabel = new Konva.Text({
                y: position,
                x: (-this.xMin + 1) * PIX_PER_UNIT - (PIX_PER_UNIT / 10),
                text: currY.toString(),
                fill: 'white',
                fontSize: 18,
                fontFamily: 'medodica'
            })
    
            if (currY != this.yMax) group.add(line);
            currY--;
            if (currY == -1) continue;
            group.add(coordinateLabel)
        }
    
        group.add(graphChart);
        graphChart.setZIndex(0);
        console.log(graphChart.getZIndex());
    
        return group;
    }

    convertCoordToKonva(coord: number, isX: boolean): number {
        if (isX) {
            return OFFSET + (coord - this.xMin) * PIX_PER_UNIT;
        }
        return OFFSET + (this.yMax - coord) * PIX_PER_UNIT;
    }

    /**
     * 
     * @returns The View's static Group
     */
    getGroup(): Konva.Group {
        return this.staticGroup;
    }

    /**
     * 
     * @returns The Groups this View belongs to
     */
    getGroups(): Konva.Group[] {
        return [this.staticGroup, this.graphGroup];
    }

    /**
     * 
     * @returns The Layers this View belongs to
     */
    getLayers(): Konva.Layer[] {
        return [this.staticLayer, this.dynamicLayer];
    }

    /**
     * Makes the View visible
     */
    show() {
        // this.transitionScreen.moveToTop();
        this.staticGroup.visible(true);
        this.staticGroup.getLayer()?.draw();
        this.graphGroup.visible(true);
        this.graphGroup.getLayer()?.draw();
    }

    /**
     * Hides the View
     */
    hide() {
        this.staticGroup.visible(false);
        this.staticGroup.getLayer()?.draw();
        this.graphGroup.visible(false);
        this.graphGroup.getLayer()?.draw();
    }
}
