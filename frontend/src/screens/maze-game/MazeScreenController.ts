import { ScreenController } from "../../types.ts";
import type { ScreenSwitcher } from "../../types.ts";
import { MazeScreenModel, ProblemModel, ChoiceModel } from "./MazeModels.ts";
import { MazeScreenView } from "./MazeScreenView.ts";
import { GAME_DURATION } from "../../constants.ts";

/**
 * MazeScreenController - Coordinates game logic between Model and View
 */
export class MazeScreenController extends ScreenController {
	private model: MazeScreenModel;
	private view: MazeScreenView;
	private screenSwitcher: ScreenSwitcher;
    private problem : ProblemModel | null = null;
	private gameTimer: number | null = null;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new MazeScreenModel();
        this.view = new MazeScreenView((choice: ChoiceModel) => this.handleChoiceClick(choice));
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.reset();

        // Generate a new problem
        this.problem = new ProblemModel(3);

		// Update view
        this.view.updateProblem(this.problem.getProblemStatement());
        this.view.updateChoices(this.problem.getChoices());
		this.view.updateScore(this.model.getScore());
		this.view.updateTimer(GAME_DURATION);
		this.view.show();

		this.startTimer();
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

	// Handle choice click
	private handleChoiceClick(choice : ChoiceModel): void {
		console.log("Choice clicked:", choice.getText());
		if (choice.getIsCorrect()) {
			// Update model
			this.model.incrementScore();

			// Update view
			this.view.updateScore(this.model.getScore());

			// Ensure a problem exists and advance or create as needed
			const prob = this.problem ?? (this.problem = new ProblemModel(3));
			prob.nextMove();

			this.view.updateProblem(prob.getProblemStatement());
			this.view.updateChoices(prob.getChoices());
		}
		else {
			// For incorrect choice, just generate new problem
			this.problem = new ProblemModel(3);
			this.view.updateProblem(this.problem.getProblemStatement());
			this.view.updateChoices(this.problem.getChoices());
		}
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
}
