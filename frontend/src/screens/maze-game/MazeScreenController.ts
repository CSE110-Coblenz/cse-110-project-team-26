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
	private tutorialShown: boolean = false;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		// this.screenSwitcher = screenSwitcher;
		this.model = new MazeScreenModel();
        this.view = new MazeScreenView((choice: ChoiceModel, x:number, y:number) => this.handleChoiceClick(choice, x, y));
		const tutorialText = `Your rocket is running out of fuel!

But don't worry - you have landed on a planet filled with resources to collect.

Navigate through the cosmic maze, solve each challenge, and collect enough fuel to continue your journey.

Good luck and have fun!`;
		this.tutorial = new MazeTutorialView(() => this.handleNextClick(), tutorialText);
		this.screenSwitcher = screenSwitcher;
	}

	/**
	 * Start the game
	 */
	startGame(): void {
		// Reset model state
		this.model.reset();
		console.log("Game started. Model reset.");
		

		if (!this.tutorialShown) {
			this.tutorial.show();
		} else {
			this.handleNextClick();
			this.view.reset();
			console.log("Tutorial already shown, starting game directly.");
		}
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
		console.log("Next button clicked in tutorial.");
		// Generate a new problem
        this.problem = new ProblemModel(3);

		// Update view
        this.view.updateProblem(this.problem.getProblemStatement());
        this.view.updateChoices(this.problem.getChoices());
		this.view.updateTimer(GAME_DURATION);

		this.startTimer();
		this.tutorial.hide();
		this.view.show();
		this.tutorialShown = true;
	}

	// Handle choice click
	private async handleChoiceClick(choice : ChoiceModel, x:number, y:number): Promise<void> {
		console.log("Choice clicked:", choice.getText());
		console.log("Moving player to:", x, y);
		this.stopTimer();
		this.view.movePlayerTo(x, y).then(() => {
			this.view.fadeToBlack().then(async () => {
				if (choice.getIsCorrect()) {
					// Update model
					this.model.incrementScore();
					// Ensure a problem exists and advance or create as needed
					const prob = this.problem as ProblemModel;
					if(prob.nextMove()){
						this.view.updateTimer(GAME_DURATION);
						this.view.updateProblem(prob.getProblemStatement());
						this.view.updateChoices(prob.getChoices());
						this.view.displayMessage("Correct", () => {
						this.startTimer();
						this.view.fadeFromBlack();
						});
					} else {
						// If no more moves, generate a new problem
						this.view.updateTimer(GAME_DURATION);
						await this.model.recordAttempt(true);
						this.view.displayMessage("Congrats", () => {
							console.log("Solved the equation! Generating new problem.");
							this.view.hideComponents();
							this.view.switchToWinBackground();
							this.view.fadeFromBlack().then(() => this.view.playWinAnimation().then(() => this.screenSwitcher.switchToScreen({ type: "menu" })));
						});
					}
				}
				else {
					// For incorrect choice, just generate new problem
					this.view.updateTimer(GAME_DURATION);
					const dismissLoading = this.view.displayMessage(
						"Incorrect",
						undefined,
						"Generating explanation...",
						{ isLoading: true }
					);
					const explanation = await this.model.fetchExplanation(this.problem, choice);
					await this.model.recordAttempt(false);
					dismissLoading();
					this.problem = new ProblemModel(3);
					this.view.updateProblem(this.problem.getProblemStatement());
					this.view.updateChoices(this.problem.getChoices());
					this.view.displayMessage(
						"Incorrect",
						() => {
						this.startTimer();
					},
					explanation ?? undefined,
					{ requireContinue: true }
					);
				}
			})
		});
	};

	// End the game
	private endGame(): void {
		this.stopTimer();
		this.view.updateTimer(GAME_DURATION);
		this.view.fadeToBlack().then(() => {
			this.view.displayMessage("Timeout", () => {
				this.problem = new ProblemModel(3);
				this.view.updateProblem(this.problem.getProblemStatement());
				this.view.updateChoices(this.problem.getChoices());
				this.startTimer();	
			});
		});
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
