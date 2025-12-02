import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH,STAGE_HEIGHT } from "../../constants.ts";
import { generate_linear_equation } from "./EquationGenerator.ts";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MatchingScreenView implements View {
    private group: Konva.Group;
    private stage: Konva.Stage;

    private leftRect_1: Konva.Rect;
    private leftRect_2: Konva.Rect;
    private leftRect_3: Konva.Rect;

    private leftText_1: Konva.Text;
    private leftText_2: Konva.Text;
    private leftText_3: Konva.Text;

    private rightRect_1: Konva.Rect;
    private rightRect_2: Konva.Rect;
    private rightRect_3: Konva.Rect;

    private rightText_1: Konva.Text;
    private rightText_2: Konva.Text;
    private rightText_3: Konva.Text;

    private arrows: Konva.Arrow[] = [];
    private paired_questions: string[] = [];
    private paired_answers: string[] = [];

    private q_a_1: ReturnType<typeof generate_linear_equation>;
    private q_a_2: ReturnType<typeof generate_linear_equation>;
    private q_a_3: ReturnType<typeof generate_linear_equation>;

    private answer_sequence: string[] = [];
    private q_a_list: string[][] = [];

    constructor(onStartClick: () => void, stage:Konva.Stage) {
        this.group = new Konva.Group({ visible: true });
        this.stage = stage;

        this.q_a_1 = generate_linear_equation();
        this.q_a_2 = generate_linear_equation();
        this.q_a_3 = generate_linear_equation();

        this.q_a_list= [
            this.q_a_1, 
            this.q_a_2,
            this.q_a_3
        ];

        // Collect all answer strings (q_a_x[1]) into a temp array
        const answers = [
            this.q_a_1[1],  // e.g., "x=5"
            this.q_a_2[1],
            this.q_a_3[1]
        ];

        // Shuffle the array randomly
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        // Assign shuffled answers to private answer_sequence
        this.answer_sequence = answers;

        // Title text
        const title = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 10,
            text: "Matching Game",
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
        this.leftRect_1 = new Konva.Rect({
            x: 150,
            y: STAGE_HEIGHT / 4 - 25,
            width: 120,
            height: 150,
            fill: "#4A90E2",
            stroke: "navy",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        this.leftRect_1.on('mousedown touchstart', () => {
            this.arrowAnimation(this.leftRect_1, this.leftText_1.text());
        });
        this.leftText_1 = new Konva.Text({
            x: 150 + 60,
            y: STAGE_HEIGHT / 4 - 25 + 60,
            text: this.q_a_1[0],
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        this.leftText_1.offsetX(this.leftText_1.width() / 2);
        this.leftText_1.offsetY(this.leftText_1.height() / 2);
        this.group.add(this.leftRect_1);
        this.group.add(this.leftText_1);

        // Question 2
        this.leftRect_2 = new Konva.Rect({
            x: 150,
            y: STAGE_HEIGHT / 2 - 25,
            width: 120,
            height: 150,
            fill: "#4A90E2",
            stroke: "navy",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        this.leftRect_2.on('mousedown touchstart', () => {
            this.arrowAnimation(this.leftRect_2, this.leftText_2.text());
        });
        this.leftText_2 = new Konva.Text({
            x: 150 + 60,
            y: STAGE_HEIGHT / 2 - 25 + 60,
            text: this.q_a_2[0],
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        this.leftText_2.offsetX(this.leftText_2.width() / 2);
        this.leftText_2.offsetY(this.leftText_2.height() / 2);
        this.group.add(this.leftRect_2);
        this.group.add(this.leftText_2);

        // Question 3
        this.leftRect_3 = new Konva.Rect({
            x: 150,
            y: 3 * STAGE_HEIGHT / 4 - 25,
            width: 120,
            height: 150,
            fill: "#4A90E2",
            stroke: "navy",
            strokeWidth: 4,
            cornerRadius: 12,
        });
        this.leftRect_3.on('mousedown touchstart', () => {
            this.arrowAnimation(this.leftRect_3, this.leftText_3.text());
        });
        this.leftText_3 = new Konva.Text({
            x: 150 + 60,
            y: 3 * STAGE_HEIGHT / 4 - 25 + 60,
            text: this.q_a_3[0],
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        this.leftText_3.offsetX(this.leftText_3.width() / 2);
        this.leftText_3.offsetY(this.leftText_3.height() / 2);
        this.group.add(this.leftRect_3);
        this.group.add(this.leftText_3);

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
        this.rightText_1 = new Konva.Text({
            x: STAGE_WIDTH - 270 + 60,
            y: STAGE_HEIGHT / 4 - 25 + 60,
            text: this.answer_sequence[0],
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        this.rightText_1.offsetX(this.rightText_1.width() / 2);
        this.rightText_1.offsetY(this.rightText_1.height() / 2);
        this.group.add(this.rightRect_1);
        this.group.add(this.rightText_1);

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
        this.rightText_2 = new Konva.Text({
            x: STAGE_WIDTH - 270 + 60,
            y: 2 * STAGE_HEIGHT / 4 - 25 + 60,
            text: this.answer_sequence[1],
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        this.rightText_2.offsetX(this.rightText_2.width() / 2);
        this.rightText_2.offsetY(this.rightText_2.height() / 2);
        this.group.add(this.rightRect_2);
        this.group.add(this.rightText_2);

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
        this.rightText_3 = new Konva.Text({
            x: STAGE_WIDTH - 270 + 60,
            y: 3 * STAGE_HEIGHT / 4 -25 + 60,
            text: this.answer_sequence[2],
            fontSize: 18,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
            verticalAlign: "middle",
        });
        this.rightText_3.offsetX(this.rightText_3.width() / 2);
        this.rightText_3.offsetY(this.rightText_3.height() / 2);
        this.group.add(this.rightRect_3);
        this.group.add(this.rightText_3);

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
            this.cleanupQA();    
            onStartClick();          
        });
        this.group.add(startButtonGroup);

        const submitButtonGroup = new Konva.Group();
        const submitButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 100,
            y: 860,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const submitText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: 875,
            text: "SUBMIT",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        submitText.offsetX(submitText.width() / 2);
        submitButtonGroup.add(submitButton);
        submitButtonGroup.add(submitText);
        submitButtonGroup.on("click", () => {
            this.submitCheck();
        });
        this.group.add(submitButtonGroup);

        //new question group
        const newQuestionButtonGroup = new Konva.Group();
        const newQuestionButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 + 150,
            y: 860,
            width: 200,
            height: 60,
            fill: "white",
            cornerRadius: 10,
            stroke: "black",
            strokeWidth: 3,
        });
        const newQuestionText = new Konva.Text({
            x: STAGE_WIDTH / 2 + 250,
            y: 875,
            text: "NEW QUESTIONS",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
        });
        newQuestionText.offsetX(newQuestionText.width() / 2);
        newQuestionButtonGroup.add(newQuestionButton);
        newQuestionButtonGroup.add(newQuestionText);
        newQuestionButtonGroup.on("click", () => {
            this.cleanupArrows();
            this.cleanupQA(); 
            this.q_a_1 = generate_linear_equation();
            this.q_a_2 = generate_linear_equation();
            this.q_a_3 = generate_linear_equation();
            this.q_a_list = [this.q_a_1, this.q_a_2, this.q_a_3];

            const answers = [this.q_a_1[1], this.q_a_2[1], this.q_a_3[1]];
            for (let i = answers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [answers[i], answers[j]] = [answers[j], answers[i]];
            }
            this.answer_sequence = answers;

            // Update texts
            this.leftText_1.text(this.q_a_1[0]);
            this.leftText_2.text(this.q_a_2[0]);
            this.leftText_3.text(this.q_a_3[0]);

            this.rightText_1.text(this.answer_sequence[0]);
            this.rightText_2.text(this.answer_sequence[1]);
            this.rightText_3.text(this.answer_sequence[2]);

            // Re-center
            [this.leftText_1, this.leftText_2, this.leftText_3,
            this.rightText_1, this.rightText_2, this.rightText_3].forEach(t => {
                t.offsetX(t.width() / 2);
                t.offsetY(t.height() / 2);
            });

            this.group.getLayer()?.batchDraw();
        });
        this.group.add(newQuestionButtonGroup);

        //reset button group
        const resetButtonGroup = new Konva.Group();
        const resetButton = new Konva.Rect({
            x: STAGE_WIDTH-200,
            y: 860,
            width: 200,
            height: 60,
            fill: "white",
            cornerRadius: 10,
            stroke: "black",
            strokeWidth: 3,
        });
        const resetText = new Konva.Text({
            x: STAGE_WIDTH - 100,
            y: 875,
            text: "RESET",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "black",
            align: "center",
        });
        resetText.offsetX(resetText.width() / 2);
        resetButtonGroup.add(resetButton);
        resetButtonGroup.add(resetText);
        resetButton.on("click", () => {
            this.cleanupArrows();
            this.cleanupQA();    
        });
        this.group.add(resetButtonGroup);
    }

    private arrowAnimation(leftRect: Konva.Rect, question: string): void {
        if (this.paired_questions.includes(question)) {
            return;
        }
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
                    arrow.fill("black");
                    arrow.stroke("black");
                    this.arrows.push(arrow);
                    this.paired_answers.push(this.rightText_1.text());
                    this.paired_questions.push(question);  
                } 
                else if (isOnA2){
                    arrow.points([arrowtail_x, arrowtail_y, a_2_Pos.x, a_2_Pos.y + this.rightRect_2.height() / 2]);
                    arrow.fill("black");
                    arrow.stroke("black");
                    this.arrows.push(arrow);
                    this.paired_answers.push(this.rightText_2.text());
                    this.paired_questions.push(question);    
                }
                else if (isOnA3){
                    arrow.points([arrowtail_x, arrowtail_y, a_3_Pos.x, a_3_Pos.y + this.rightRect_2.height() / 2]);
                    arrow.fill("black");
                    arrow.stroke("black");
                    this.arrows.push(arrow);
                    this.paired_answers.push(this.rightText_3.text());
                    this.paired_questions.push(question);    
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

    //submit and check
    private submitCheck(): void {
        for (let i = 0; i < this.arrows.length; i++) {
            const arrow = this.arrows[i];
            const q = this.paired_questions[i];
            const a = this.paired_answers[i];
            for (let j = 0; j < this.q_a_list.length; j++) {
                if (q == this.q_a_list[j][0]) {
                    console.log(q);
                    console.log(a);
                    console.log(this.q_a_list[j][1]);
                    if (a == this.q_a_list[j][1]) {
                        arrow.fill("green");
                        arrow.stroke("green");
                    }
                    else {
                        arrow.fill("red");
                        arrow.stroke("red");
                    }
                    break;
                }
            }
        }
    }

    // Destroy all arrows
    private cleanupArrows(): void {
        // destroy arrows
        this.arrows.forEach(a => a.destroy());
        this.arrows = [];
    }

    // Destroy paired questions & answers
    private cleanupQA(): void {
        this.paired_questions = [];
        this.paired_answers = [];
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
