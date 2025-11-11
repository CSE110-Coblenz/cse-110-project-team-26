import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

// SCREEN SPECIFIC CONSTANTS

const OFFSET = STAGE_WIDTH * 0.02;
const PANEL_WIDTH = STAGE_WIDTH * (1/5);
const BOX_WIDTH = STAGE_WIDTH * (1/5) - OFFSET;

// Background, stays in the root group

const BACKGROUND_PROPERTIES = {
  x: 0,
  y: 0,
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
  fill: "#8B8B8B"
};

// Graph group and elements

const GRAPH_GROUP_PROPERTIES = {
  x: PANEL_WIDTH,
  y: 0,
  width: STAGE_WIDTH - PANEL_WIDTH,
  height: STAGE_HEIGHT
};

const GRAPH_BACKGROUND_PROPERTIES = {
  x: OFFSET,
  y: OFFSET,
  width: GRAPH_GROUP_PROPERTIES.width - OFFSET,
  height: GRAPH_GROUP_PROPERTIES.height - OFFSET * 2,
  fill: "#161313"
};

// Sprite group and elements

const SPRITE_GROUP_PROPERTIES = {
  x: 0,
  y: 0,
  width: PANEL_WIDTH,
  height: STAGE_HEIGHT * (2/7)
};

const SPRITE_BOX_PROPERTIES = {
  x: OFFSET,
  y: OFFSET,
  width: BOX_WIDTH,
  height: SPRITE_GROUP_PROPERTIES.height - (OFFSET * 2),
  fill: "#FFF3F3"
};

// Dialogue group and elements

const DIALOGUE_GROUP_PROPERTIES = {
  x: 0,
  y: SPRITE_GROUP_PROPERTIES.height,
  width: PANEL_WIDTH,
  height: STAGE_HEIGHT * (3/7)
};

const DIALOGUE_BOX_PROPERTIES = {
  x: OFFSET,
  y: 0,
  width: BOX_WIDTH,
  height: DIALOGUE_GROUP_PROPERTIES.height - OFFSET,
  fill: "#413434"
};

const DIALOGUE_TEXT_PROPERTIES = {
  x: DIALOGUE_BOX_PROPERTIES.x,
  y: DIALOGUE_BOX_PROPERTIES.y,
  width: DIALOGUE_BOX_PROPERTIES.width,
  height: DIALOGUE_BOX_PROPERTIES.height,
  text: "<Dialogue>\nOh no, an asteroid field! Let's safely plot a path to <destination>",
  fontSize: 24,
  fontFamily: "Arial",
  fill: "white"
};

// Equation/Input group and elements

const INPUT_AND_EQUATION_GROUP_PROPERTIES = {
  x: 0,
  y: DIALOGUE_GROUP_PROPERTIES.height + SPRITE_GROUP_PROPERTIES.height,
  width: PANEL_WIDTH,
  height: STAGE_HEIGHT * (2/7)
};

const INPUT_AND_EQUATION_BOX_PROPERTIES = {
  x: OFFSET,
  y: 0,
  width: BOX_WIDTH,
  height: INPUT_AND_EQUATION_GROUP_PROPERTIES.height - OFFSET,
  fill: "#D9D9D9"
};

const EQUATION_BOX_PROPERTIES = {
  x: INPUT_AND_EQUATION_BOX_PROPERTIES.x + (OFFSET * (0.5)),
  y: INPUT_AND_EQUATION_BOX_PROPERTIES.y + (OFFSET * (0.5)),
  width: BOX_WIDTH - (OFFSET),
  height: (INPUT_AND_EQUATION_BOX_PROPERTIES.height * (1/4)) - OFFSET,
  fill: "#110808"
};

const EQUATION_TEXT_PROPERTIES = {
  x: EQUATION_BOX_PROPERTIES.x,
  y: EQUATION_BOX_PROPERTIES.y,
  width: EQUATION_BOX_PROPERTIES.width,
  height: EQUATION_BOX_PROPERTIES.height,
  text: "y=_x+_",
  fontSize: 16,
  fontFamily: "Arial",
  fill: "white",
  align: "center"
};


/**
 * View for the Graphing game module
 */
export class GraphScreenView implements View {
    private group: Konva.Group;
    private dialogueText: Konva.Text;
    private playerSprite: HTMLImageElement;
    private equationText: Konva.Text;

    /**
     * Initializes default values for the View
     */
    constructor(onEquationSubmission?: () => boolean) {
        this.group = new Konva.Group({ visible: false });

        // Root group elements
        
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

        inputAndEquationGroup.add(inputAndEquationBox, equationBox, this.equationText);

        // Graph group elements

        const graphGroup = new Konva.Group({
            ...GRAPH_GROUP_PROPERTIES
        });

        const graphBackground = new Konva.Rect({
            ...GRAPH_BACKGROUND_PROPERTIES
        });

        graphGroup.add(graphBackground);

        this.group.add(background, spriteGroup, dialogueGroup, inputAndEquationGroup, graphGroup);

        
        /*this.group.add(background,
            spriteBox,
            dialogueBox,
            inputAndEquationBox,
            equationBox,
            graphBackground,
            this.dialogueText,
            this.equationText,
            spriteText // Sprite placeholder
        );*/

    }

    /**
     * 
     * @returns The Group this View belongs to
     */
    getGroup(): Konva.Group {
        return this.group;
    }

    /**
     * Makes the View visible
     */
    show() {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    /**
     * Hides the View
     */
    hide() {
        this.group.visible(false);
		this.group.getLayer()?.draw();
    }
}
