import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH } from "../../constants.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MenuTestScreenView implements View {
    private group: Konva.Group;

    constructor(onStartClick: () => void, onMazeClick: () => void, onMainClick: () => void) {
        this.group = new Konva.Group({ visible: true });

        // Title text
        const title = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 150,
            text: "Menu Test Screen View",
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
            fill: "lightgreen",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 318,
            text: "SWITCH TO MATCHING",
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

        const MazeButtonGroup = new Konva.Group();
        const MazeButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 100,
            y: 500,
            width: 200,
            height: 60,
            fill: "darkgreen",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const MazeText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 518,
            text: "SWITCH TO MAZE",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        MazeText.offsetX(MazeText.width() / 2);
        MazeButtonGroup.add(MazeButton);
        MazeButtonGroup.add(MazeText);
        MazeButtonGroup.on("click", onMazeClick);
        this.group.add(MazeButtonGroup);

        const MainButtonGroup = new Konva.Group();
        const MainButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 100,
            y: 400,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const MainText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 418,
            text: "SWITCH TO MAIN",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        MainText.offsetX(MainText.width() / 2);
        MainButtonGroup.add(MainButton);
        MainButtonGroup.add(MainText);
        MainButtonGroup.on("click", onMainClick);
        this.group.add(MainButtonGroup)
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
