import Konva from "konva";
import type { View } from "../../types";

/**
 * View for the Graphing game module
 */
export class GraphScreenView implements View {
    private group: Konva.Group;

    /**
     * Initializes default values for the View
     */
    constructor() {
        this.group = new Konva.Group();
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