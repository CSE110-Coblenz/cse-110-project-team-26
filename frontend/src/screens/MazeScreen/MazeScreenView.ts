import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH } from "../../constants.ts";
import { addLinearPlot } from "./plot.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MazeScreenView implements View {
    private group: Konva.Group;
    private stage: Konva.Stage

    constructor(onStartClick: () => void, stage: Konva.Stage) {
        this.group = new Konva.Group({ visible: true });
        this.stage = stage;

        // Title text
        const title = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 150,
            text: "Maze Screen View",
            fontSize: 48,
            fontFamily: "Arial",
            fill: "yellow",
            stroke: "orange",
            strokeWidth: 2,
            align: "center",
        });
        // Center the text using offsetX
        title.offsetX(title.width() / 2);
        this.group.add(title);

        const startButtonGroup = new Konva.Group();
        const startButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 100,
            y: 300,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 318,
            text: "SWITCH TO MENU",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        startText.offsetX(startText.width() / 2);
        startButtonGroup.add(startButton);
        startButtonGroup.add(startText);
        startButtonGroup.on("click", onStartClick);
        this.group.add(startButtonGroup);

        const gp1 = addLinearPlot(this.stage,2,3,{x:STAGE_WIDTH-200,y:200});
        this.group.add(gp1);
    }

    /**
     * Show the screen
     */
    show(): void {
        this.group.visible(true);
        this.group.getLayer()?.draw();
    }

    /**
     * Hide the screen
     */
    hide(): void {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }

    getGroup(): Konva.Group {
        return this.group;
    }
}
