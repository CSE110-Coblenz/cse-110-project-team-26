import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH,STAGE_HEIGHT } from "../../constants.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MatchingScreenView implements View {
    private group: Konva.Group;
    private stage: Konva.Stage;

    private leftRect: Konva.Rect;
    private rightRect: Konva.Rect;

    constructor(onStartClick: () => void, stage:Konva.Stage) {
        this.group = new Konva.Group({ visible: true });
        this.stage = stage;

        // Title text
        const title = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 150,
            text: "Matching Screen View",
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

        // Left square (start point) - Blue
        this.leftRect = new Konva.Rect({
            x: 150,
            y: STAGE_HEIGHT / 2 - 75,
            width: 120,
            height: 150,
            fill: "#4A90E2",
            stroke: "navy",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        this.leftRect.on('mousedown touchstart', () => {
            this.arrowAnimation();
        });
        const leftText = new Konva.Text({
            x: 150 + 60,
            y: STAGE_HEIGHT / 2 - 75 + 60,
            text: "Question",
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        leftText.offsetX(leftText.width() / 2);
        leftText.offsetY(leftText.height() / 2);
        this.group.add(this.leftRect);
        this.group.add(leftText);

        // Right square (target) - Green
        this.rightRect = new Konva.Rect({
            x: STAGE_WIDTH - 270,
            y: STAGE_HEIGHT / 2 - 75,
            width: 120,
            height: 150,
            fill: "darkgreen",
            stroke: "black",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        const rightText = new Konva.Text({
            x: STAGE_WIDTH - 270 + 60,
            y: STAGE_HEIGHT / 2 - 75 + 60,
            text: "Answer",
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        rightText.offsetX(rightText.width() / 2);
        rightText.offsetY(rightText.height() / 2);
        this.group.add(this.rightRect);
        this.group.add(rightText);

        const startButtonGroup = new Konva.Group();
        const startButton = new Konva.Rect({
            x: 0,
            y: 760,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: 100,
            y: 775,
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

    }

    private arrowAnimation(): void {
        const mousePos = this.stage.getPointerPosition();
        const layer = this.stage.getLayers()[0];
        const arrowtail_x = this.leftRect.x() + this.leftRect.width();
        const arrowtail_y = this.rightRect.y() + this.leftRect.height() / 2;
        let arrow: Konva.Arrow | null = null; // allow type to be Konva.Arrow/null
        arrow = new Konva.Arrow({
            points: [
                arrowtail_x, 
                arrowtail_y,
                0, // Head at cursor
                0,
            ],
            pointerLength: 10,
            pointerWidth: 10,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 4,
        });
        if (mousePos){
            arrow.points([arrowtail_x, arrowtail_y, mousePos.x, mousePos.y]);
            layer.add(arrow);
            layer.batchDraw();
        }        

        // Handle dragmove on stage to update arrow head
        this.stage.on('mousemove touchmove', () => {
            if (arrow) {
                const mousePos = this.stage.getPointerPosition();
                if (mousePos) {
                    // Update arrow head to cursor position, keep tail at this.leftRect center
                    arrow.points([arrowtail_x, arrowtail_y, mousePos.x, mousePos.y]);
                    layer.batchDraw();
                }
            }
        });

        // Handle dragend on stage to finalize or remove arrow
        this.stage.on('mouseup touchend', () => {
            if (arrow) {
                const endPoint = { x: arrow.points()[2], y: arrow.points()[3] };
                const a_1_Pos = this.rightRect.position();
                // const a_2_Pos = a_2.position();
                // const a_3_Pos = a_3.position();
                const distance_1 = Math.sqrt(
                    Math.pow(endPoint.x - a_1_Pos.x, 2) + Math.pow(endPoint.y - a_1_Pos.y, 2)
                );
                // const distance_2 = Math.sqrt(
                //     Math.pow(endPoint.x - a_2_Pos.x, 2) + Math.pow(endPoint.y - a_2_Pos.y, 2)
                // );
                // const distance_3 = Math.sqrt(
                //     Math.pow(endPoint.x - a_3_Pos.x, 2) + Math.pow(endPoint.y - a_3_Pos.y, 2)
                // );

                // Check if the arrow's head is within a_1 (radius + tolerance)
                const isOnA1 = this.rightRect.x() <= endPoint.x && endPoint.x <= (this.rightRect.x() + this.rightRect.width()) && 
                this.rightRect.y() <= endPoint.y && endPoint.y <= (this.rightRect.y() + this.rightRect.height());
                // const isOnA1 = distance_1 <= this.rightRect.radius() + 10; // 10px tolerance
                // const isOnA2 = distance_2 <= a_2.radius() + 10;
                // const isOnA3 = distance_3 <= a_3.radius() + 10;

                if (isOnA1) {
                    // Finalize arrow: Snap head to center of a
                    arrow.points([arrowtail_x, arrowtail_y, a_1_Pos.x, a_1_Pos.y + this.rightRect.height() / 2]);
                    arrow.fill("green");
                    arrow.stroke("green");  
                } 
                // else if (isOnA2){
                //     arrow.points([this.leftRect.x(), this.leftRect.y(), a_2_Pos.x, a_2_Pos.y]);
                //     arrow.fill("blue");
                //     arrow.stroke("blue");  
                // }
                // else if (isOnA3){
                //     arrow.points([this.leftRect.x(), this.leftRect.y(), a_3_Pos.x, a_3_Pos.y]);
                //     arrow.fill("purple");
                //     arrow.stroke("purple");  
                // }
                else {
                    // Remove arrow
                    arrow.destroy();
                }
                // this.leftRect.moveToTop();
                layer.batchDraw();
                arrow = null; // Reset arrow
            }
        });
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
