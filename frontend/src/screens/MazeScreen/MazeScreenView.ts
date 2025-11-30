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

        const instructionWindowGroup = new Konva.Group({
            x: stage.width() / 2 - 300,   // center horizontally (600px width)
            y: stage.height() / 2 - 225,  // center vertically (450px height)
            visible: true,
            listening: true
        });
        const bg = new Konva.Rect({
            width: 600,
            height: 450,
            fill: '#000000',
            opacity: 0.65,               // 50%-80% transparency range → 0.5 to 0.8
            cornerRadius: 16,
            shadowColor: 'black',
            shadowBlur: 30,
            shadowOpacity: 0.7
        });
        instructionWindowGroup.add(bg);
        // Title
        const InstructionTitle = new Konva.Text({
            x: 0,
            y: 50,
            width: 600,
            text: 'Instructions',
            fontSize: 38,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: 'white',
            align: 'center'
        });
        instructionWindowGroup.add(InstructionTitle);
        // Instruction lines
        const lines = [
            '• Use mouse wheel to zoom',
            '• Left-click and drag to pan',
            '• Double-click to add objects',
            '• Press Delete to remove selection',
            '• Press ESC to deselect'
        ];

        lines.forEach((line, i) => {
            const text = new Konva.Text({
                x: 60,
                y: 130 + i * 50,
                width: 480,
                text: line,
                fontSize: 22,
                fontFamily: 'Arial',
                fill: 'white',
                align: 'left'
            });
            instructionWindowGroup.add(text);
        });

        // Footer hint
        const footer = new Konva.Text({
            x: 0,
            y: 380,
            width: 600,
            text: 'Click anywhere to close',
            fontSize: 18,
            fontFamily: 'Arial',
            fill: '#cccccc',
            align: 'center'
        });
        instructionWindowGroup.add(footer);

        // Close on click
        instructionWindowGroup.on('click tap', () => {
            instructionWindowGroup.hide();
            this.group.getLayer()?.draw();
        });
        this.group.add(instructionWindowGroup);

        //help button
        const helpButtonGroup = new Konva.Group({
            x: stage.width() - 170,
            y: stage.height() - 200,
            listening: true
        });

        const helpButton = new Konva.Rect({
            width: 150,
            height: 50,
            fill: '#333333',
            cornerRadius: 10,
            stroke: '#ffffff',
            strokeWidth: 2,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOpacity: 0.5
        });

        const helpIcon = new Konva.Text({
            text: '?',               // or use "?" for a question mark button
            fontSize: 24,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: 'white',
            x: 0,
            y: 12,
            width: 150,
            align: 'center'
        });

        helpButtonGroup.add(helpButton);
        helpButtonGroup.add(helpIcon);

        // Hover effect (optional but nice)
        helpButtonGroup.on('mouseenter', () => helpButton.fill('#555555'));
        helpButtonGroup.on('mouseleave', () => helpButton.fill('#333333'));

        this.group.add(helpButtonGroup)

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
