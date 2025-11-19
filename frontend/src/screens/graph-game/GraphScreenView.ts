import Konva from "konva";
import type { View } from "../../types";

/**
 * View for the Graphing game module
 */
export class GraphScreenView implements View {
    private group: Konva.Group;
    private dialogueText: Konva.Text;
    private playerSprite: HTMLImageElement;
    private equationText: Konva.Text;

    // TODO: Implement these
    // private spriteBox: Konva.Rect;
    // private dialogueBox: Konva.Rect;
    // private inputAndEquationBox: Konva.Rect;
    // private equationBox: Konva.Rect;

    /**
     * Initializes default values for the View
     */
    constructor(onEquationSubmission: () => boolean) {
        this.group = new Konva.Group({ visible: false });

        const background = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "#616161" // Gray
        });
        this.group.add(background);

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
