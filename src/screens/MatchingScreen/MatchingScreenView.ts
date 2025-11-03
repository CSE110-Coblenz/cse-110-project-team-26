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
    private rightRect_1: Konva.Rect;
    private rightRect_2: Konva.Rect;
    private rightRect_3: Konva.Rect;

    private arrows: Konva.Arrow[] = [];

    constructor(onStartClick: () => void, stage:Konva.Stage) {
        this.group = new Konva.Group({ visible: true });
        this.stage = stage;

        // Title text
        const title = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 10,
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

        // Question 1
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
            this.arrowAnimation(this.leftRect);
        });
        const leftText = new Konva.Text({
            x: 150 + 60,
            y: STAGE_HEIGHT / 2 - 75 + 60,
            text: "2x + 1 = 3",
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

        // Answer 1
        this.rightRect_1 = new Konva.Rect({
            x: STAGE_WIDTH - 270,
            y: STAGE_HEIGHT / 4 - 25,
            width: 120,
            height: 150,
            fill: "darkgreen",
            stroke: "black",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        const rightText_1 = new Konva.Text({
            x: STAGE_WIDTH - 270 + 60,
            y: STAGE_HEIGHT / 4 - 25 + 60,
            text: "x = 3",
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        rightText_1.offsetX(rightText_1.width() / 2);
        rightText_1.offsetY(rightText_1.height() / 2);
        this.group.add(this.rightRect_1);
        this.group.add(rightText_1);

        // Answer 2
        this.rightRect_2 = new Konva.Rect({
            x: STAGE_WIDTH - 270,
            y: STAGE_HEIGHT / 2 - 25,
            width: 120,
            height: 150,
            fill: "darkgreen",
            stroke: "black",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        const rightText_2 = new Konva.Text({
            x: STAGE_WIDTH - 270 + 60,
            y: 2 * STAGE_HEIGHT / 4 - 25 + 60,
            text: "x = 1",
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        rightText_2.offsetX(rightText_2.width() / 2);
        rightText_2.offsetY(rightText_2.height() / 2);
        this.group.add(this.rightRect_2);
        this.group.add(rightText_2);

        // Answer 3
        this.rightRect_3 = new Konva.Rect({
            x: STAGE_WIDTH - 270,
            y: 3 * STAGE_HEIGHT / 4 - 25,
            width: 120,
            height: 150,
            fill: "darkgreen",
            stroke: "black",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        const rightText_3 = new Konva.Text({
            x: STAGE_WIDTH - 270 + 60,
            y: 3 * STAGE_HEIGHT / 4 -25 + 60,
            text: "x = 5",
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        rightText_3.offsetX(rightText_3.width() / 2);
        rightText_3.offsetY(rightText_3.height() / 2);
        this.group.add(this.rightRect_3);
        this.group.add(rightText_3);

        const startButtonGroup = new Konva.Group();
        const startButton = new Konva.Rect({
            x: 0,
            y: 860,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: 100,
            y: 875,
            text: "SWITCH TO MENU",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        startText.offsetX(startText.width() / 2);
        startButtonGroup.add(startButton);
        startButtonGroup.add(startText);
        startButtonGroup.on("click", () => {
            this.cleanupArrows();    
            onStartClick();          
        });
        this.group.add(startButtonGroup);

    }

    private arrowAnimation(leftRect: Konva.Rect): void {
        const mousePos = this.stage.getPointerPosition();
        const layer = this.stage.getLayers()[0];
        const arrowtail_x = leftRect.x() + leftRect.width();
        const arrowtail_y = leftRect.y() + leftRect.height() / 2;
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
                const a_1_Pos = this.rightRect_1.position();
                const a_2_Pos = this.rightRect_2.position();
                const a_3_Pos = this.rightRect_3.position();

                // Check if the arrow's head is within a_1 (radius + tolerance)
                const isOnA1 = this.rightRect_1.x() <= endPoint.x && endPoint.x <= (this.rightRect_1.x() + this.rightRect_1.width()) && 
                this.rightRect_1.y() <= endPoint.y && endPoint.y <= (this.rightRect_1.y() + this.rightRect_1.height());
                const isOnA2 = this.rightRect_2.x() <= endPoint.x && endPoint.x <= (this.rightRect_2.x() + this.rightRect_2.width()) && 
                this.rightRect_2.y() <= endPoint.y && endPoint.y <= (this.rightRect_2.y() + this.rightRect_2.height());
                const isOnA3 = this.rightRect_3.x() <= endPoint.x && endPoint.x <= (this.rightRect_3.x() + this.rightRect_3.width()) && 
                this.rightRect_3.y() <= endPoint.y && endPoint.y <= (this.rightRect_3.y() + this.rightRect_3.height());

                if (isOnA1) {
                    // Finalize arrow: Snap head to center of a
                    arrow.points([arrowtail_x, arrowtail_y, a_1_Pos.x, a_1_Pos.y + this.rightRect_1.height() / 2]);
                    arrow.fill("green");
                    arrow.stroke("green");
                    this.arrows.push(arrow);  
                } 
                else if (isOnA2){
                    arrow.points([arrowtail_x, arrowtail_y, a_2_Pos.x, a_2_Pos.y + this.rightRect_2.height() / 2]);
                    arrow.fill("red");
                    arrow.stroke("red");
                    this.arrows.push(arrow);  
                }
                else if (isOnA3){
                    arrow.points([arrowtail_x, arrowtail_y, a_3_Pos.x, a_3_Pos.y + this.rightRect_2.height() / 2]);
                    arrow.fill("purple");
                    arrow.stroke("purple");
                    this.arrows.push(arrow);  
                }
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

    // Destroy all arrows
    private cleanupArrows(): void {
        // destroy arrows
        this.arrows.forEach(a => a.destroy());
        this.arrows = [];
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
