import Konva from "konva";
import type { View } from "../../types";
import {
  OFFSET,
  BOX_WIDTH,
  BACKGROUND_PROPERTIES,
  STATIC_GROUP_PROPERTIES,
  GRAPH_BACKGROUND_PROPERTIES,
  SPRITE_GROUP_PROPERTIES,
  SPRITE_BOX_PROPERTIES,
  DIALOGUE_GROUP_PROPERTIES,
  DIALOGUE_BOX_PROPERTIES,
  DIALOGUE_TEXT_PROPERTIES,
  INPUT_AND_EQUATION_GROUP_PROPERTIES,
  INPUT_AND_EQUATION_BOX_PROPERTIES,
  EQUATION_BOX_PROPERTIES,
  EQUATION_TEXT_PROPERTIES
} from "./GraphScreenConstants";
import { graphGroup } from "./GraphChart";

/**
 * View for the Graphing game module
 */
export class GraphScreenView implements View {
    private staticLayer: Konva.Layer;
    private dynamicLayer: Konva.Layer;
    private staticGroup: Konva.Group;
    private graphGroup: Konva.Group;
    private dialogueText: Konva.Text;
    private playerSprite: HTMLImageElement = new Image();
    private equationText: Konva.Text;
    /**
     * Initializes default values for the View
     */
    constructor(onNumberInput: (input: number) => void, onEquationReset: () => void, onEquationSubmission: () => void) {

        // Add layers for static and dynamic elements

        console.log(GRAPH_BACKGROUND_PROPERTIES.width);
        console.log(GRAPH_BACKGROUND_PROPERTIES.height);
        
        this.staticLayer = new Konva.Layer();
        this.dynamicLayer = new Konva.Layer();
        
        // Container groups
        
        this.staticGroup = new Konva.Group({
            ...STATIC_GROUP_PROPERTIES
        });
        this.graphGroup = graphGroup;

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

        dialogueGroup.add(dialogueBox, this.dialogueText);

        // Input/Equation group elements

        const inputAndEquationGroup = new Konva.Group({
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
        
        const keypadGroup = this.createInputButtons(onNumberInput, onEquationReset, onEquationSubmission);

        inputAndEquationGroup.add(inputAndEquationBox, equationBox, this.equationText, keypadGroup);

        // Graph group elements

        this.staticGroup.add(background, spriteGroup, dialogueGroup, inputAndEquationGroup);
        this.staticLayer.add(this.staticGroup);
        this.dynamicLayer.add(this.graphGroup);
    }

    /**
     * Creates equation input buttons
     */
    createInputButtons(onNumberInput: (input: number) => void, onEquationReset: () => void, onEquationSubmission: () => void): Konva.Group {
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
                fill: "#5F5050"
            });

            const buttonText = new Konva.Text({
                x: 0,
                y: 0,
                width: KEYPAD_GROUP_PROPERTIES.width * (1 / columns) - smallOffset,
                height: KEYPAD_GROUP_PROPERTIES.height * (1 / rows) - smallOffset,
                text: String(i + 1),
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
            fill: "#5F5050"
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
      
        zeroButtonGroup.on("click", () => onNumberInput(0));
        zeroButtonGroup.add(zeroButton);
        zeroButtonGroup.add(zeroButtonText);
        keypadGroup.add(zeroButtonGroup);

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
            fill: "#5F5050"
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
            fill: "#5F5050"
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

    getDialogue(): string {
        return this.dialogueText.text();
    }

    getEquation(): string {
        return this.equationText.text();
    }

    /**
     * 
     * @returns The Group this View belongs to
     */
    getGroup(): Konva.Group {
        return this.staticGroup;
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
