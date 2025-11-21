import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MazeScreenModel, ProblemModel, ChoiceModel } from "./MazeModels.ts";
import { MazeScreenView } from "./MazeScreenView.ts";
import { MazeTutorialView } from "./MazeTutorialView.ts";
import { GAME_DURATION } from "../../constants.ts";

/**
 * MazeScreenController - Coordinates game logic between Model and View
 */
export class MazeScreenController extends ScreenController {
	private model: MazeScreenModel;
	private view: MazeScreenView;
	private tutorial: MazeTutorialView;
	private screenSwitcher: ScreenSwitcher;
    private problem : ProblemModel | null = null;
	private gameTimer: number | null = null;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new MazeScreenModel();
        this.view = new MazeScreenView((choice: ChoiceModel, x:number, y:number) => this.handleChoiceClick(choice, x, y));
		const tutorialText = `Welcome to the Maze Game Tutorial!

In this game, you'll solve linear equations step-by-step.

At each step, choose the correct operation to isolate the variable.

Good luck and have fun!`;
		this.tutorial = new MazeTutorialView(() => this.handleNextClick(), tutorialText);
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.reset();
		console.log("Game started. Model reset.");
		this.tutorial.show();
		//this.startTimer();
	}
    // Start the timer
	private startTimer(): void {
		let timeRemaining = GAME_DURATION;
		this.gameTimer = setInterval(() => {
			timeRemaining--;
			this.view.updateTimer(timeRemaining)
			if (timeRemaining <= 0) {
				this.endGame();
			}
		}, 1000);
	}

	// Stop the timer
	private stopTimer(): void {
		// TODO: Task 3 - Stop the timer using clearInterval
		if (this.gameTimer) {
			clearInterval(this.gameTimer);
			this.gameTimer = null;
		}
	}
	private handleNextClick(): void {
		// Generate a new problem
        this.problem = new ProblemModel(3);

		// Update view
        this.view.updateProblem(this.problem.getProblemStatement());
        this.view.updateChoices(this.problem.getChoices());
		this.view.updateScore(this.model.getScore());
		this.view.updateTimer(GAME_DURATION);

		this.startTimer();
		this.tutorial.hide();
		this.view.show();
	}

	// Handle choice click
	private handleChoiceClick(choice : ChoiceModel, x:number, y:number): void {
		console.log("Choice clicked:", choice.getText());

		console.log("Moving circle to:", x, y);
		this.view.moveCircleTo(x, y);
		if (choice.getIsCorrect()) {
			// Update model
			this.model.incrementScore();

			// Update view
			this.view.updateScore(this.model.getScore());

			// Ensure a problem exists and advance or create as needed
			const prob = this.problem ?? (this.problem = new ProblemModel(3));
			if(prob.nextMove()){
				this.view.updateProblem(prob.getProblemStatement());
				this.view.updateChoices(prob.getChoices());
			} else {
				// If no more moves, generate a new problem
				console.log("Solved the equation! Generating new problem.");
				this.problem = new ProblemModel(3);
				this.view.updateProblem(this.problem.getProblemStatement());
				this.view.updateChoices(this.problem.getChoices());
			}
		}
		else {
			// For incorrect choice, just generate new problem
			this.problem = new ProblemModel(3);
			this.view.updateProblem(this.problem.getProblemStatement());
			this.view.updateChoices(this.problem.getChoices());
		}
		this.stopTimer();
		this.startTimer();
	}

	// End the game
	private endGame(): void {
		this.stopTimer();
	}

	// Get the final score
	getFinalScore(): number {
		return this.model.getScore();
	}

	
	/**
	 * Get the view group
	 */
	getView(): MazeScreenView {
		return this.view;
	}

	getTutorialView(): MazeTutorialView {
		return this.tutorial;
	}
}
