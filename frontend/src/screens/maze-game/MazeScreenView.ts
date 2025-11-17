import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { ChoiceModel } from "./MazeModels.ts";

export class ChoiceView {
    private group: Konva.Group;
    private choice: ChoiceModel | null = null;

    constructor(x: number, y: number) {
        this.group = new Konva.Group();

        const rectWidth = 100;
        const rectHeight = 100;

        const rect = new Konva.Rect({
            fill: "green",
            width: rectWidth,
            height: rectHeight
        });

        const text = new Konva.Text({
            text: "Choice",
            fontSize: 24,
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

    getGroup() { return this.group; }

    setText(newChoice: ChoiceModel) {
        this.choice = newChoice;
        const textNode = this.group.findOne<Konva.Text>('Text');
        if (textNode) {
            textNode.text(newChoice.getText());
        }
    }

    getChoice() { return this.choice; }

    onClick(handler: (choice: ChoiceModel) => void) {
        this.group.on('click', () => handler(this.choice as ChoiceModel));
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

	constructor(handler: (choice : ChoiceModel) => void) {
		this.group = new Konva.Group({ visible: false });

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
        this.problemText = new Konva.Text({
            text: "Problem Statement",
            fontSize: 24,
            fontFamily: "Arial",
            fill: "white",
            width: STAGE_WIDTH,
            align: "center",
        });
        this.problemText.y((STAGE_HEIGHT - this.problemText.height()) / 2);
        // 50 = half width of choice rectangle
		this.choiceOne = new ChoiceView(STAGE_WIDTH/2-50, STAGE_HEIGHT/2);
        this.choiceTwo = new ChoiceView(STAGE_WIDTH/2-250, STAGE_HEIGHT/2);
        this.choiceThree = new ChoiceView(STAGE_WIDTH/2+150, STAGE_HEIGHT/2);
        
        this.group.add(
            this.choiceOne.getGroup(),
            this.choiceTwo.getGroup(), 
            this.choiceThree.getGroup()
        );
        this.choiceOne.onClick(handler);
        this.choiceTwo.onClick(handler);
        this.choiceThree.onClick(handler);
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
        // Assuming choices array has exactly 3 elements
        const choiceTexts = [this.choiceOne, this.choiceTwo, this.choiceThree];
        for (let i = 0; i < 3; i++) {
            choiceTexts[i].setText(choices[i]);
        }
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
