import Konva from "konva";
import type { AbsoluteValue, EquationAnswerFormat, Linear, Quadratic, View } from "../../types";
import {
  OFFSET,
  BOX_WIDTH,
  BACKGROUND_PROPERTIES,
  STATIC_GROUP_PROPERTIES,
  GRAPH_GROUP_PROPERTIES,
  GRAPH_BACKGROUND_PROPERTIES,
  SPRITE_GROUP_PROPERTIES,
  SPRITE_BOX_PROPERTIES,
  DIALOGUE_GROUP_PROPERTIES,
  DIALOGUE_BOX_PROPERTIES,
  DIALOGUE_TEXT_PROPERTIES,
  TRANSITION_GROUP_PROPERTIES,
  TRANSITION_BUTTON_PROPERTIES,
  TRANSITION_TEXT_PROPERTIES,
  INPUT_AND_EQUATION_GROUP_PROPERTIES,
  INPUT_AND_EQUATION_BOX_PROPERTIES,
  EQUATION_BOX_PROPERTIES,
  EQUATION_TEXT_PROPERTIES,
  PIX_PER_UNIT
} from "./GraphScreenConstants";
import { ABSVAL, LINEAR, QUADRATIC, X_MAX, X_MIN } from "../../constants";

/**
 * View for the Graphing game module
 */
export class GraphScreenView implements View {
    private staticLayer: Konva.Layer;
    private dynamicLayer: Konva.Layer;
    private staticGroup: Konva.Group;
    private graphGroup: Konva.Group;
    private transitionGroup: Konva.Group;
    private dialogueText: Konva.Text;
    private playerSprite: HTMLImageElement;
    private equationText: Konva.Text;
    private inputAndEquationGroup: Konva.Group;

    private width: number = GRAPH_BACKGROUND_PROPERTIES.width;
    private height: number = GRAPH_BACKGROUND_PROPERTIES.height;
    private xRange: number = this.width / PIX_PER_UNIT;
    private yRange: number = this.height / PIX_PER_UNIT;
    private yOffset = 0;
    private xOffset = 0;
    private xMin = Math.floor(-this.xRange / 2 + 1) + this.xOffset;
    private yMax = Math.floor(this.yRange / 2 - 1) + this.yOffset;
    /**
     * Initializes default values for the View
     */
    constructor(type: number, onNumberInput: (input: number) => void, onEquationReset: () => void, onEquationSubmission: () => void) {

        // Add layers for static and dynamic elements

        console.log(GRAPH_BACKGROUND_PROPERTIES.width);
        console.log(GRAPH_BACKGROUND_PROPERTIES.height);
        
        this.staticLayer = new Konva.Layer();
        this.dynamicLayer = new Konva.Layer();
        
        // Container groups
        
        this.staticGroup = new Konva.Group({
            ...STATIC_GROUP_PROPERTIES
        });

        // TEST!!!!!

        //this.addPOIRectangle(4, 4, 'red');

        // TEST!!!!!

        // Background element
    
        const background = new Konva.Rect({
            ...BACKGROUND_PROPERTIES
        });

        // Sprite group elements

        const spriteGroup = new Konva.Group({
            ...SPRITE_GROUP_PROPERTIES
        });

        const spriteBox = new Konva.Rect({
            ...SPRITE_BOX_PROPERTIES
        });
        
        // This is a placeholder for the sprite
        const spriteText = new Konva.Text({
            x: OFFSET,
            y: OFFSET,
            width: SPRITE_BOX_PROPERTIES.width,
            height: SPRITE_BOX_PROPERTIES.height,
            text: "Sprite Placeholder",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
            verticalAlign: "middle"
        });

        spriteGroup.add(spriteBox, spriteText);

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
        })

        const transitionButton = new Konva.Rect({
            ...TRANSITION_BUTTON_PROPERTIES
        });

        const transitionText = new Konva.Text({
            ...TRANSITION_TEXT_PROPERTIES
        });

        this.transitionGroup.add(transitionButton, transitionText);
        dialogueGroup.add(dialogueBox, this.dialogueText, this.transitionGroup);
        this.transitionGroup.hide();

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
                this.equationText.text("y=|(_/_)x+_|+_");
            break;
        }

        console.log(this.equationText.text());
        
        const keypadGroup = this.createInputButtons(onNumberInput, onEquationReset, onEquationSubmission);

        this.inputAndEquationGroup.add(inputAndEquationBox, equationBox, this.equationText, keypadGroup);
        
        // Graph group elements

        this.graphGroup = this.createGraphGroup();
        this.staticGroup.add(background, spriteGroup, dialogueGroup, this.inputAndEquationGroup);
        this.staticLayer.add(this.staticGroup);
        this.dynamicLayer.add(this.graphGroup);

    }

    reset(type: number, onNumberInput: (input: number) => void, onEquationReset: () => void, onEquationSubmission: () => void): void {
        this.inputAndEquationGroup.destroy();
        this.graphGroup.destroy();
        this.hideTransitionButton();

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
        this.dynamicLayer.add(this.graphGroup);
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

    addGuessRectangle(x: number, y: number, color: string) {
        const rect1 = new Konva.Rect({
            x: this.convertCoordToKonva(x, true) - 5,
            y: this.convertCoordToKonva(y, false) - 5,
            width: 10,
            height: 10,
            fill: color,
            stroke: 'white',
            strokeWidth: 2,
            name: "TEMP"
        });
        this.graphGroup.add(rect1);
    }

    resetGraph() {
        let found = this.graphGroup.find( (item: Konva.Rect | Konva.Line) => {
            return item.name() === "TEMP";
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

    hideTransitionButton() {
        this.transitionGroup.hide();
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
                fontSize: 24,
                fontFamily: "Arial",
                fill: "white",
                align: "center",
                verticalAlign: "middle"
            });
            
            buttonGroup.on("click", () => onNumberInput(i + 1));
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
            fontSize: 24,
            fontFamily: "Arial",
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
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            fill: fill
        });
      
        const minusButtonText = new Konva.Text({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            text: "-",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle"
        });
      
        zeroButtonGroup.on("click", () => onNumberInput(0));
        zeroButtonGroup.add(zeroButton);
        zeroButtonGroup.add(zeroButtonText);
        keypadGroup.add(zeroButtonGroup);

        minusButtonGroup.on("click", () => onNumberInput(-1));
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
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            fill: fill
        });

        const resetButtonText = new Konva.Text({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            text: "reset",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle"
        });
      
        resetButtonGroup.on("click", onEquationReset)
        resetButtonGroup.add(resetButton);
        resetButtonGroup.add(resetButtonText);
        keypadGroup.add(resetButtonGroup);

        const submitButtonGroup = new Konva.Group({
            x: (KEYPAD_GROUP_PROPERTIES.width * (1 / columns)) * (numberColumns),
            y: (KEYPAD_GROUP_PROPERTIES.height * (1 / rows)) * 2,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns),
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows)
        });

        const submitButton = new Konva.Rect({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            fill: fill
        });

        const submitButtonText = new Konva.Text({
            x: 0,
            y: 0,
            width: KEYPAD_GROUP_PROPERTIES.width * (2 / columns) - smallOffset,
            height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
            text: "submit",
            fontSize: 12,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle"
        });
      
        submitButtonGroup.on("click", onEquationSubmission);
        submitButtonGroup.add(submitButton);
        submitButtonGroup.add(submitButtonText);
        keypadGroup.add(submitButtonGroup);

        return keypadGroup;
    }

    updateSprite(sprite: HTMLImageElement): void {
        this.playerSprite = sprite;
        this.staticLayer.draw();
    }

    updateDialogue(dialogue: string): void {
        this.dialogueText.text(dialogue);
        this.staticLayer.draw();
    }

    updateEquation(equation: string): void {
        this.equationText.text(equation);
        this.staticLayer.draw();
    }

    getSprite(): HTMLImageElement {
        return this.playerSprite;
    }

    getDialogue(): Konva.Text {
        return this.dialogueText;
    }

    getEquation(): Konva.Text {
        return this.equationText;
    }

    plotPOI(answer: EquationAnswerFormat) {
        switch(answer.format) {
            case LINEAR:
                let linearAnswer = answer as Linear;
                console.log(answer);
                this.addPOIRectangle(0, linearAnswer.getIntercept(), 'red');
                this.addPOIRectangle(linearAnswer.getCoefficient().denominator, 
                                    linearAnswer.getIntercept() + linearAnswer.getCoefficient().numerator, 'red');
            break;
            case QUADRATIC:
                let quadraticAnswer = answer as Quadratic;
                console.log(answer);
                this.addPOIRectangle(quadraticAnswer.getRoot1(), 0, 'blue');
                this.addPOIRectangle(quadraticAnswer.getRoot2(), 0, 'blue');
            break;
            case ABSVAL:
                let absvalAnswer = answer as AbsoluteValue;
                console.log(answer);
                this.addPOIRectangle(absvalAnswer.getXShift(), absvalAnswer.getYShift(), 'green');
                this.addPOIRectangle(absvalAnswer.getXShift() - absvalAnswer.getCoefficient().denominator,
                                        absvalAnswer.getYShift() + absvalAnswer.getCoefficient().numerator, 'green');
                this.addPOIRectangle(absvalAnswer.getXShift() + absvalAnswer.getCoefficient().denominator,
                                        absvalAnswer.getYShift() + absvalAnswer.getCoefficient().numerator, 'green');
            break;
        }
    }

    plotLinearGraph(isPreview: boolean, type: string, submission: EquationAnswerFormat) {
        let linearSubmission = submission as Linear;

        let numerator = linearSubmission.getCoefficient().numerator;
        let denominator = linearSubmission.getCoefficient().denominator;
        let intercept = linearSubmission.getIntercept();

        let leftIntercept = (denominator * (X_MIN - intercept)) / numerator;
        let rightIntercept = (denominator * (X_MAX - intercept)) / numerator;

        let plotLine = new Konva.Line({
            points: [this.convertCoordToKonva(X_MIN, true), this.convertCoordToKonva(leftIntercept, false),
                    this.convertCoordToKonva(X_MAX, true), this.convertCoordToKonva(rightIntercept, false)],
            strokeWidth: 3,
            lineCap: 'round'
        })
        if (isPreview) plotLine.stroke('green');
        else plotLine.stroke('red');
        this.graphGroup.add(plotLine);
    }

    plotGraph(isPreview: boolean, type: string, submission: EquationAnswerFormat) {
        switch(type) {
            case LINEAR:
                this.plotLinearGraph(isPreview, type, submission);
            break;
            case QUADRATIC:
                this.addGuessRectangle((submission as Quadratic).getRoot1(), 0, 'red');
                this.addGuessRectangle((submission as Quadratic).getRoot2(), 0, 'red');
                console.log(this.graphGroup.getChildren());
            break;

            case ABSVAL:

            break;
        }
    }

    createGraphGroup(): Konva.Group {
    
        let group: Konva.Group = new Konva.Group(GRAPH_GROUP_PROPERTIES);
        let graphChart: Konva.Rect = new Konva.Rect(GRAPH_BACKGROUND_PROPERTIES);
        let graphChartLeft = OFFSET;
        let graphChartright = graphChart.width() + OFFSET;
        let graphChartTop = OFFSET;
        let graphChartBottom = graphChart.height() + OFFSET;
    
        let currX = this.xMin;
        for (let i = 1; i < this.xRange; i++) {
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
                y: group.height() / 2 - PIX_PER_UNIT / 4 + this.yOffset * PIX_PER_UNIT,
                x: position + PIX_PER_UNIT / 10,
                text: currX.toString(),
                fill: 'white',
                fontSize: 18
            })
            currX++;
    
            group.add(line);
            group.add(coordinateLabel)
        }
        let currY = this.yMax;
        for (let i = 1; i < this.yRange; i++) {
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
                x: group.width() / 2 - PIX_PER_UNIT * this.xOffset,
                text: currY.toString(),
                fill: 'white',
                fontSize: 18
            })
            currY--;
    
            group.add(line);
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
            return OFFSET + (coord - this.xMin + 1) * PIX_PER_UNIT;
        }
        return OFFSET + (this.yMax - coord + 1) * PIX_PER_UNIT;
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
