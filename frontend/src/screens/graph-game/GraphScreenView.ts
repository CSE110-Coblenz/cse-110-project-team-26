import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

// SCREEN SPECIFIC CONSTANTS

const OFFSET = STAGE_WIDTH * 0.02;

const BACKGROUND_PROPERTIES = {
  x: 0,
  y: 0,
  width: STAGE_WIDTH,
  height: STAGE_HEIGHT,
  fill: "#8B8B8B"
};

const SPRITE_BOX_PROPERTIES = {
  x: OFFSET,
  y: OFFSET,
  width: STAGE_WIDTH * (1/5) - OFFSET,
  height: STAGE_HEIGHT * (2/7) - OFFSET,
  fill: "#FFF3F3"
};

const DIALOGUE_BOX_PROPERTIES = {
  x: OFFSET,
  y: SPRITE_BOX_PROPERTIES.height + (2 * OFFSET),
  width: STAGE_WIDTH * (1/5) - OFFSET,
  height: STAGE_HEIGHT * (3/7) - OFFSET,
  fill: "#413434"
};

const INPUT_AND_EQUATION_BOX_PROPERTIES = {
  x: OFFSET,
  y: SPRITE_BOX_PROPERTIES.height + DIALOGUE_BOX_PROPERTIES.height + (3 * OFFSET),
  width: STAGE_WIDTH * (1/5) - OFFSET,
  height: STAGE_HEIGHT * (2/7) - (OFFSET * 2),
  fill: "#D9D9D9"
}

const EQUATION_BOX_PROPERTIES = {
  x: OFFSET * (1.5),
  y: INPUT_AND_EQUATION_BOX_PROPERTIES.y + OFFSET * (0.5),
  width: INPUT_AND_EQUATION_BOX_PROPERTIES.width - (OFFSET),
  height: INPUT_AND_EQUATION_BOX_PROPERTIES.height * (1/4) - OFFSET,
  fill: "#110808"
}

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

        const background = new Konva.Rect({
            ...BACKGROUND_PROPERTIES
        });

        const spriteBox = new Konva.Rect({
            ...SPRITE_BOX_PROPERTIES
        });

        const dialogueBox = new Konva.Rect({
            ...DIALOGUE_BOX_PROPERTIES
        });

        const inputAndEquationBox = new Konva.Rect({
            ...INPUT_AND_EQUATION_BOX_PROPERTIES
        });

        const equationBox = new Konva.Rect({
            ...EQUATION_BOX_PROPERTIES
        });

        this.group.add(background, spriteBox, dialogueBox, inputAndEquationBox, equationBox);
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
