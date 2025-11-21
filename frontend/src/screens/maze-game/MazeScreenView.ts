import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { ChoiceModel } from "./MazeModels.ts";

// Component to represent a choice in the maze game
export class ChoiceView {
    private group: Konva.Group;
    private choice: ChoiceModel | null = null;
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.group = new Konva.Group();
        this.x = x;
        this.y = y;
        const rectWidth = 100;
        const rectHeight = 100;

        const rect = new Konva.Rect({
            fill: "black",
            width: rectWidth,
            height: rectHeight
        });

        const text = new Konva.Text({
            text: "Choice",
            fontSize: 14,
            fontFamily: "Arial",
            fill: "white",
            width: rectWidth,
            align: "center",
        });

        // center vertically:
        text.y((rectHeight - text.height()) / 2);

        this.group.add(rect, text);
        this.group.position({ x, y });
    }
    // Get the Konva group for this choice
    getGroup() { return this.group; }
    // Update the displayed text for the choice
    setText(newChoice: ChoiceModel) {
        this.choice = newChoice;
        const textNode = this.group.findOne<Konva.Text>('Text');
        if (textNode) {
            textNode.text(newChoice.getText());
        }
    }
    // Get the associated ChoiceModel
    getChoice() { return this.choice; }
    // Register click handler for this choice
    onClick(handler: (choice: ChoiceModel, x:number, y:number) => void) {
        this.group.on('click', () => handler(this.choice as ChoiceModel, this.x+50, this.y+50));
        console.log("Registered click handler for choice at:", this.x, this.y);
    }
}

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class MazeScreenView implements View {
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
    private problemText: Konva.Text = new Konva.Text();
    private choiceOne : ChoiceView;
    private choiceTwo : ChoiceView;
    private choiceThree : ChoiceView;
    private transitionScreen: Konva.Rect;
    private player: Konva.Circle;

	constructor(handler: (choice : ChoiceModel, x:number, y:number) => void) {
		this.group = new Konva.Group({ visible: false });

        // overlay for transition effect
        this.transitionScreen = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "black",
            opacity: 0.0,
        });
        this.group.add(this.transitionScreen);

		// Background
		const bg = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#616567ff", // Sky blue
		});
		this.group.add(bg);

		// Score display (top-left)
		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "black",
		});
		this.group.add(this.scoreText);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "red",
		});
		this.group.add(this.timerText);

		// Objects in scene
        // Problem statement
        this.problemText = new Konva.Text({
            text: "Problem Statement",
            fontSize: 40,
            fontFamily: "Arial",
            fill: "white",
            width: STAGE_WIDTH,
            align: "center",
        });
        this.problemText.y((STAGE_HEIGHT - this.problemText.height() - 200) / 2);
        // Choices
        // 50 = half width of choice rectangle
		this.choiceOne = new ChoiceView(STAGE_WIDTH/2-50, STAGE_HEIGHT/2);
        this.choiceTwo = new ChoiceView(STAGE_WIDTH/2-250, STAGE_HEIGHT/2);
        this.choiceThree = new ChoiceView(STAGE_WIDTH/2+150, STAGE_HEIGHT/2);
        // Add to group
        this.group.add(
            this.choiceOne.getGroup(),
            this.choiceTwo.getGroup(), 
            this.choiceThree.getGroup(),
            this.problemText
        );
        // Register click handlers, passing the choice model to the handler
        this.choiceOne.onClick(handler);
        this.choiceTwo.onClick(handler);
        this.choiceThree.onClick(handler);

        this.player = new Konva.Circle({
            x: STAGE_WIDTH / 2,
            y: STAGE_HEIGHT - 100,
            radius: 50,
            fill: "#e43a3aff",
        });
        this.group.add(this.player);
	}

	/**
	 * Update score display
	 */
	updateScore(score: number): void {
		this.scoreText.text(`Score: ${score}`);
		this.group.getLayer()?.draw();
	}

	/**
	 * Update timer display
	 */
	updateTimer(timeRemaining: number): void {
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
	}

    // Update problem display
    updateProblem(problemStatement: string): void {
        this.problemText.text(problemStatement);
        this.group.getLayer()?.draw();
    }

    // Update choices display
    updateChoices(choices: ChoiceModel[]): void {
        const choiceTexts = [this.choiceOne, this.choiceTwo, this.choiceThree];
        for (let i = 0; i < 3; i++) {
            choiceTexts[i].setText(choices[i]);
        }
        this.group.getLayer()?.draw();
    }

    fadeToBlack(duration: number = 0.2): Promise<void> {
    this.transitionScreen.moveToTop();
    return new Promise((resolve) => {
        new Konva.Tween({
        node: this.transitionScreen,
        opacity: 1,
        duration,
        onFinish: () => {
        this.fadeFromBlack();
        this.resetCirclePosition();
        resolve();
    },
        }).play();
    });
    }
    fadeFromBlack(duration: number = 0.5): Promise<void> {
    return new Promise((resolve) => {
        new Konva.Tween({
        node: this.transitionScreen,
        opacity: 0,
        duration,
        onFinish: () => {
        this.transitionScreen.moveToBottom();
        resolve();
    },
        }).play();
    });
    }
    moveCircleTo(x: number, y: number) {
    new Konva.Tween({
        node: this.player,
        x,
        y,
        duration: 0.5,
        easing: Konva.Easings.EaseInOut,
        onFinish: () => { this.fadeToBlack(); }
    }).play();
    }
    resetCirclePosition() {
        console.log("Resetting player position");
        this.player.position({ x: STAGE_WIDTH / 2, y: STAGE_HEIGHT - 100 });
        this.group.getLayer()?.draw();
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

