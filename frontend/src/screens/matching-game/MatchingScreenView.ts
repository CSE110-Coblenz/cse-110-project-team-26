import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH,STAGE_HEIGHT } from "../../constants.ts";
import { generate_quadratic_equation_1, generate_linear_equation_1, generate_linear_equation_2, generate_quadratic_equation_2 } from "./EquationGenerator.ts";
import galaxyBg from './assets/galaxy.jpg';
import { createNeonMetalBox, createPlanetBox, flameBlowUp} from "./ArtEffect.ts";
import { helpButtonGroup, instructionWindowGroup } from "./instructions.ts";
import "../../styles.css";

/**
 * MenuScreenView - Renders the menu screen
 */
export class MatchingScreenView implements View {
    private group: Konva.Group;
    private stage: Konva.Stage;

    private box_size = 200;

    private leftRects: Konva.Rect[] = [];
    private leftTexts: Konva.Text[] = [];
    private rightRects: Konva.Rect[] = [];
    private rightTexts: Konva.Text[] = [];

    private arrows: Konva.Arrow[] = [];
    private paired_questions: string[] = [];
    private paired_answers: string[] = [];

    private answer_sequence: string[] = [];
    private q_a_list: [string, string][] = [];

    private difficulty: number = 3;
    private arrowCount: number = 0;
    private onSubmit?: () => void;

    constructor(stage:Konva.Stage, difficulty: number, onSubmit?: () => void) {
        this.group = new Konva.Group({ visible: true });
        this.stage = stage;

        // ===== ADD GALAXY BACKGROUND HERE =====
        const img = new Image();
        img.src = "/wires.png";
        const background = new Konva.Image({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            image: img,  // ← directly use the imported image (it's already loaded by Vite!)
            listening: false,
        });

        /* const overlay = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: 'rgba(0, 0, 50, 0.75)',  // dark overlay for text readability
            listening: false,
        }); */

        // ADD THEM FIRST — THIS IS CRITICAL
        this.group.add(background);
        /* this.group.add(overlay); */

        // Add twinkling stars
        /* for (let i = 0; i < 80; i++) {
            const star = new Konva.Circle({
                x: Math.random() * STAGE_WIDTH,
                y: Math.random() * STAGE_HEIGHT,
                radius: Math.random() * 2,
                fill: 'white',
                opacity: Math.random() * 0.8 + 0.2,
                listening: false,
            });

            // Animate twinkling
            new Konva.Tween({
                node: star,
                duration: Math.random() * 3 + 2,
                opacity: Math.random() * 0.5 + 0.5,
                easing: Konva.Easings.EaseInOut,
                yoyo: true,
                repeat: -1,
            }).play();

            this.group.add(star);
        } */
        background.moveToTop();
        
        this.difficulty = difficulty;
        this.onSubmit = onSubmit;

        /* // Title text
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
        this.group.add(title); */


        // Adding question and answer rectangles and texts
        for (let i = 0; i < difficulty; i++) {
            this.leftRects.push(new Konva.Rect({
                x: 60,
                y: i * (STAGE_HEIGHT / difficulty)+STAGE_HEIGHT / (2+difficulty * difficulty),
                width: 120,
                height: 90,
                fill: "#969696ff",
                stroke: "white",
                strokeWidth: 4,
            }));

            this.leftTexts.push(new Konva.Text({
                x: 128,
                y: i * (STAGE_HEIGHT / difficulty)+STAGE_HEIGHT / (2+difficulty * difficulty)+45,
                text: i.toString(),
                fontSize: 24,
                fontFamily: "medodica",
                fill: "white",
                align: "center",
                verticalAlign: "middle",
            }));
            this.leftTexts[i].offsetX(this.leftTexts[i].width() / 2);
            this.leftTexts[i].offsetY(this.leftTexts[i].height() / 2);
            this.leftRects[i].on('mousedown touchstart', () => {
                this.arrowAnimation(this.leftRects[i], this.leftTexts[i].text());
            });
            this.rightRects.push(new Konva.Rect({
                x: STAGE_WIDTH - 180,
                y: i * (STAGE_HEIGHT / difficulty)+STAGE_HEIGHT / (2+difficulty * difficulty),
                width: 120,
                height: 90,
                fill: "#969696ff",
                stroke: "white",
                strokeWidth: 4,
            }));
            this.rightTexts.push(new Konva.Text({
                x: STAGE_WIDTH - 116,
                y: i * (STAGE_HEIGHT / difficulty)+STAGE_HEIGHT / (2+difficulty * difficulty)+45,
                text: this.answer_sequence[i],
                fontSize: 24,
                fontFamily: "medodica",
                fill: "white",
                align: "center",
                verticalAlign: "middle",
            }));
            this.rightTexts[i].offsetX(this.rightTexts[i].width() / 2);
            this.rightTexts[i].offsetY(this.rightTexts[i].height() / 2);
            this.group.add(this.leftRects[i]);
            this.group.add(this.leftTexts[i]);
            this.group.add(this.rightRects[i]);
            this.group.add(this.rightTexts[i]);
        }

        this.new_questions();
        /*
        const startButtonGroup = new Konva.Group();
        const startButton = new Konva.Rect({
            x: 0,
            y: STAGE_HEIGHT-100,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const startText = new Konva.Text({
            x: startButton.x() + 100,
            y: startButton.y() + 15,
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

        const level1ButtonGroup = new Konva.Group();
        const level1Button = new Konva.Rect({
            x: 0,
            y: 50,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const level1Text = new Konva.Text({
            x: level1Button.x() + 100,
            y: level1Button.y() + 15,
            text: "LEVEL 1",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        level1Text.offsetX(level1Text.width() / 2);
        level1ButtonGroup.add(level1Button);
        level1ButtonGroup.add(level1Text);
        level1ButtonGroup.on("click", () => {
            this.difficulty = "linear 1";
            this.new_questions()                    
        });
        this.group.add(level1ButtonGroup);

        const level2ButtonGroup = new Konva.Group();
        const level2Button = new Konva.Rect({
            x: 205,
            y: 50,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const level2Text = new Konva.Text({
            x: level2Button.x() + 100,
            y: level2Button.y() + 15,
            text: "LEVEL 2",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        level2Text.offsetX(level2Text.width() / 2);
        level2ButtonGroup.add(level2Button);
        level2ButtonGroup.add(level2Text);
        level2ButtonGroup.on("click", () => {
            this.difficulty = "linear 2";  // or maybe "quadratic" for level 2?
            this.new_questions();
        });
        this.group.add(level2ButtonGroup);

        //level3
        const level3ButtonGroup = new Konva.Group();
        const level3Button = new Konva.Rect({
            x: STAGE_WIDTH - 410,
            y: 50,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const level3Text = new Konva.Text({
            x: level3Button.x() + 100,
            y: level3Button.y() + 15,
            text: "LEVEL 3",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        level3Text.offsetX(level3Text.width() / 2);
        level3ButtonGroup.add(level3Button);
        level3ButtonGroup.add(level3Text);
        level3ButtonGroup.on("click", () => {
            this.difficulty = "quadratic_1"; 
            this.new_questions();
        });
        this.group.add(level3ButtonGroup);

        //level4
        const level4ButtonGroup = new Konva.Group();
        const level4Button = new Konva.Rect({
            x: STAGE_WIDTH - 200,
            y: 50,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const level4Text = new Konva.Text({
            x: level4Button.x() + 100,
            y: level4Button.y() + 15,
            text: "LEVEL 4",
            fontSize: 16,
            fontFamily: "Arial",
            fill: "white",
            align: "center",
        });
        level4Text.offsetX(level4Text.width() / 2);
        level4ButtonGroup.add(level4Button);
        level4ButtonGroup.add(level4Text);
        level4ButtonGroup.on("click", () => {
            this.difficulty = "quadratic_2";  // or maybe "quadratic" for level 2?
            this.new_questions();
        });
        this.group.add(level4ButtonGroup);
        */

        //instruction window
        const instructionWindow: Konva.Group = instructionWindowGroup("matching-game-instructions");
        instructionWindow.on('click tap', () => {
            instructionWindow.hide();
            this.group.getLayer()?.draw();
        });
        this.group.add(instructionWindow);
        /*
        const submitButtonGroup = new Konva.Group();
        const submitButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 - 100,
            y: STAGE_HEIGHT - 100,
            width: 200,
            height: 60,
            fill: "green",
            cornerRadius: 10,
            stroke: "darkgreen",
            strokeWidth: 3,
        });
        const submitText = new Konva.Text({
            x: STAGE_WIDTH / 2,
            y: submitButton.y() + 15,
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
        */
        //help button group
        const helpButton = helpButtonGroup(STAGE_WIDTH/2-120, STAGE_HEIGHT - 50);
        helpButton.on('click tap', () => {
            instructionWindow.show();
            instructionWindow.moveToTop();   // bring to front if other objects overlap
            this.group.getLayer()?.draw();
        });
        this.group.add(helpButton);
        /*
        //new question group
        const newQuestionButtonGroup = new Konva.Group();
        const newQuestionButton = new Konva.Rect({
            x: STAGE_WIDTH / 2 + 150,
            y: STAGE_HEIGHT - 100,
            width: 200,
            height: 60,
            fill: "white",
            cornerRadius: 10,
            stroke: "black",
            strokeWidth: 3,
        });
        const newQuestionText = new Konva.Text({
            x: STAGE_WIDTH / 2 + 250,
            y: newQuestionButton.y() + 15,
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
            this.new_questions();
        });
        this.group.add(newQuestionButtonGroup);
        */
        //reset button group
        const resetButtonGroup = new Konva.Group();
        const resetButton = new Konva.Rect({
            x: STAGE_WIDTH/2+20,
            y: STAGE_HEIGHT - 50,
            width: 100,
            height: 40,
            fill: "white",
            stroke: "black",
            strokeWidth: 3,
        });
        const resetText = new Konva.Text({
            x: resetButton.x() + 60,
            y: resetButton.y()+10,
            text: "RESET",
            fontSize: 16,
            fontFamily: "medodica",
            fill: "black",
            align: "center",
        });
        resetText.offsetX(resetText.width() / 2);
        resetButtonGroup.add(resetButton);
        resetButtonGroup.add(resetText);
        resetButtonGroup.on("click", () => {
            console.log("reset clicked");
            for (let i = 0; i < this.leftRects.length; i++) {
                this.leftRects[i].stroke("white");
                this.rightRects[i].stroke("white");
            }
            this.cleanupArrows();
            this.cleanupQA();    
        });
        this.group.add(resetButtonGroup);
    }

    private arrowAnimation(leftRect: Konva.Rect, question: string): void {
        if (this.paired_questions.includes(question)) {
            return;
        }
        let mousePos = this.stage.getPointerPosition();
        const layer = this.stage.getLayers()[0];
        const arrowtail_x = leftRect.x() + leftRect.width() + leftRect.strokeWidth();
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
            fill: 'white',
            stroke: 'white',
            strokeWidth: 10,
        });
        if (mousePos){
            arrow.points([arrowtail_x, arrowtail_y, mousePos.x, mousePos.y]);
            layer.add(arrow);
            layer.batchDraw();
        }        

        // Handle dragmove on stage to update arrow head
        this.stage.on('mousemove touchmove', () => {
            if (arrow) {
                mousePos = this.stage.getPointerPosition();
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
                const a_Pos: { x: number; y: number }[] = []; // Positions
                for (let i = 0; i < this.rightRects.length; i++) {
                    a_Pos.push(this.rightRects[i].position());
                }

                // Check if the arrow's head is within a_1 (radius + tolerance)
                const isOnAi : boolean[] = [];
                for (let i = 0; i < a_Pos.length; i++) {
                    const isOnA = this.rightRects[i].x() <= endPoint.x && endPoint.x <= (this.rightRects[i].x() + this.rightRects[i].width()) && 
                    this.rightRects[i].y() <= endPoint.y && endPoint.y <= (this.rightRects[i].y() + this.rightRects[i].height());
                    isOnAi.push(isOnA);
                }
                // If dropped on any answer rectangle, snap arrow head to center of that rectangle
                for (let i = 0; i < isOnAi.length; i++) {
                    console.log(this.paired_answers);
                    console.log(this.rightTexts[i].text());
                    if (isOnAi[i] && !this.paired_answers.includes(this.rightTexts[i].text())) {
                        // Finalize arrow: Snap head to center of a_i
                        arrow.points([arrowtail_x, arrowtail_y, a_Pos[i].x, a_Pos[i].y + this.rightRects[i].height() / 2]);
                        leftRect.stroke("gray")
                        this.rightRects[i].stroke("gray");
                        arrow.fill("black");
                        arrow.stroke("black");
                        this.group.add(arrow);
                        this.arrows.push(arrow);
                        this.paired_answers.push(this.rightTexts[i].text());
                        this.paired_questions.push(question);  
                        layer.batchDraw();
                        arrow = null; // Reset arrow
                        if (this.paired_questions.length >= this.difficulty) this.submitCheck();
                        return;
                    }
                }
                // If not dropped on any answer, remove the arrow
                arrow.destroy();
                // this.leftRect.moveToTop();
                layer.batchDraw();
                arrow = null; // Reset arrow
            }
        });
    }

    //submit and check
    private submitCheck(): void {
        let incorrect_count = 0;
        for (let i = 0; i < this.arrows.length; i++) {
            const arrow = this.arrows[i];
            const q = this.paired_questions[i];
            const a = this.paired_answers[i];
            for (let j = 0; j < this.q_a_list.length; j++) {
                if (q == this.q_a_list[j][0]) {
                    if (a == this.q_a_list[j][1]) {
                        arrow.fill("green");
                        arrow.stroke("green");
                    }
                    else {
                        arrow.fill("red");
                        arrow.stroke("red");
                        incorrect_count += 1;
                        console.log(this.return_incorrect(q,a,this.q_a_list[j][1]));
                        for (let m = 0; m < 2; m++) {
                            setTimeout(() => {
                            flameBlowUp(STAGE_WIDTH/2, 2*STAGE_HEIGHT/3, this.stage);
                            setTimeout(() => {
                                flameBlowUp(STAGE_WIDTH/3, STAGE_HEIGHT/3, this.stage);
                            }, 300);
                            setTimeout(() => {
                                flameBlowUp(2*STAGE_WIDTH/3, 2*STAGE_HEIGHT/3, this.stage);
                            }, 600);
                            }, m * 1000);
                        }
                    }
                    break;
                }
            }
        }
        if (incorrect_count > 0) {
            setTimeout(() => {
                // add if wrong here
                this.new_questions();
            }, 2000);
        } else {
            const instructionWindow: Konva.Group = instructionWindowGroup("matching-game-win");
            instructionWindow.on('click tap', () => {
                instructionWindow.hide();
                this.group.getLayer()?.draw();
                this.cleanupArrows();
                this.cleanupQA();
                this.fadeToBlackScreen().then(() => {
                    // Call onSubmit callback after transition
                    instructionWindow.destroy();
                    this.onSubmit?.();
                });
            });
            this.group.add(instructionWindow);
            instructionWindow.show();
            instructionWindow.moveToTop();   // bring to front if other objects overlap
            this.group.getLayer()?.draw();
        }
    }

    private return_incorrect(question: String, user_answer: String, correct_answer: String): any {
        return {
            question: question,
            given_answer: user_answer,
            correct_answer: correct_answer
        }
    }

    //transition black screen
    private fadeToBlackScreen(): Promise<void> {
        return new Promise((resolve) => {
            const blackScreen = new Konva.Rect({
                x: 0,
                y: 0,
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT,
                fill: 'black',
                opacity: 0,
                listening: false,
            });
            this.group.add(blackScreen);
            const fadeIn = new Konva.Tween({
                node: blackScreen,
                duration: 0.5,
                opacity: 1,
                onFinish: () => {
                    blackScreen.destroy();
                    resolve();
                }
            });
            fadeIn.play();
        });
    }
    private fadeFromBlackScreen(): Promise<void> {
        return new Promise((resolve) => {
            const blackScreen = new Konva.Rect({
                x: 0,
                y: 0,
                width: STAGE_WIDTH,
                height: STAGE_HEIGHT,
                fill: 'black',
                opacity: 1,
                listening: false,
            });
            this.group.add(blackScreen);
            const fadeOut = new Konva.Tween({
                node: blackScreen,
                duration: 0.5,
                opacity: 0,
                onFinish: () => {
                    blackScreen.destroy();
                    resolve();
                }
            });
            fadeOut.play();
        });
    }

    /* private generate_equation(): void {
        if (this.difficulty == "linear 1") {
            this.q_a_1 = generate_linear_equation_1();
            this.q_a_2 = generate_linear_equation_1();
            this.q_a_3 = generate_linear_equation_1();
        }
        else if (this.difficulty == "linear 2") {
            this.q_a_1 = generate_linear_equation_2();
            this.q_a_2 = generate_linear_equation_2();
            this.q_a_3 = generate_linear_equation_2();
        }
        else if (this.difficulty == "quadratic_1") {
            this.q_a_1 = generate_quadratic_equation_1();
            this.q_a_2 = generate_quadratic_equation_1();
            this.q_a_3 = generate_quadratic_equation_1();
        }
        else {
            this.q_a_1 = generate_quadratic_equation_2();
            this.q_a_2 = generate_quadratic_equation_2();
            this.q_a_3 = generate_quadratic_equation_2();
        }
    } */

    private new_questions(): void {
        this.cleanupArrows();
        this.cleanupQA();
        
        const generatedAnswers: string[] = [];
        for (let i = 0; i < this.difficulty; i++) {
            // make sure no duplicate answers
            while (true) {
                this.q_a_list[i] = generate_linear_equation_1() as [string, string];
                if (!generatedAnswers.includes(this.q_a_list[i][1])) {
                    generatedAnswers.push(this.q_a_list[i][1]);
                    break;
                }
            }
        }
        
        // Collect all answer strings (q_a_x[1]) into a temp array
        const answers = this.q_a_list.map(qa => qa[1]);


        // Shuffle the array randomly
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }

        // Assign shuffled answers to private answer_sequence
        this.answer_sequence = answers;

        // Update texts
        for (let i = 0; i < this.difficulty; i++) {
            this.leftTexts[i].text(this.q_a_list[i][0]);
            this.leftRects[i].stroke("white");
            this.rightTexts[i].text(this.answer_sequence[i]);
            this.rightRects[i].stroke("white");

            // Re-center
            this.leftTexts[i].offsetX(this.leftTexts[i].width() / 2);
            this.leftTexts[i].offsetY(this.leftTexts[i].height() / 2);
            this.rightTexts[i].offsetX(this.rightTexts[i].width() / 2);
            this.rightTexts[i].offsetY(this.rightTexts[i].height() / 2);
        }

        this.group.getLayer()?.batchDraw();
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

    // reset all states
    reset(): void {
        this.fadeFromBlackScreen().then(() => {
            this.cleanupArrows();
            this.cleanupQA();
            this.new_questions();
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
