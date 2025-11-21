/**
 * Model for the Tutorial screen.
 * Steps:
 * 0: Welcome/Introduction
 * 1: Main Game (Graph Game) tutorial
 * 2: Maze Game tutorial
 * 3: Matching Game tutorial
 */
export class TutorialScreenModel {
	private currentStep: number;
	private totalSteps: number;

	constructor() {
		this.currentStep = 0;
		this.totalSteps = 4; // Welcome + 3 game tutorials
	}

	getCurrentStep(): number {
		return this.currentStep;
	}

	getTotalSteps(): number {
		return this.totalSteps;
	}

	isFirstStep(): boolean {
		return this.currentStep === 0;
	}

	isLastStep(): boolean {
		return this.currentStep === this.totalSteps - 1;
	}

	nextStep(): void {
		if (this.currentStep < this.totalSteps - 1) {
			this.currentStep++;
		}
	}

	previousStep(): void {
		if (this.currentStep > 0) {
			this.currentStep--;
		}
	}

	reset(): void {
		this.currentStep = 0;
	}

	getStepContent(): { title: string; content: string } {
		const steps = [
			{
				title: "Welcome!",
				content:
					"Welcome to (Game Name)!\n\nThis tutorial will teach you how to play.\n\nYou are a space explorer looking to navigate the galaxy by solving graph-based puzzles. Use your skills to connect the stars and unlock new worlds!\n\nEnter values to plot paths for your spaceship to avoid obstacles and reach checkpoints for additional resources to continue your adventure!\n\nPress continue to learn more about the controls and gameplay mechanics.",
			},
			{
				title: "Main Game",
				content:
					"The Main Game is a graph-based puzzle where you plot equations to navigate your spaceship.\n\n• Enter equations in the input field\n• Plot your path on the coordinate plane\n• Avoid obstacles and reach checkpoints\n• Use linear, quadratic, and absolute value equations\n\nMaster the graph game to unlock new worlds and challenges!",
			},
			{
				title: "Maze Game",
				content:
					"The Maze Game challenges you to solve math problems to navigate through a maze.\n\n• Solve equations to move through the maze\n• Each correct answer opens a new path\n• Find the exit by solving all problems correctly\n• If you get a wrong answer, no worries! We will explain why the answer is wrong and give you a new chance to restart and solve a new problem!",
			},
			{
				title: "Matching Game",
				content:
					"After crashing into a asteriod, you need to repair the damages to your spaceship.\n\n• Match the correct answers to the questions to repair the damages\n• Drag and drop to make connections\n• Time yourself to improve your speed\n• Learn to recognize patterns quickly\n\nPerfect your matching skills to become a graph master! \n\n If you get a wrong answer, no worries! We will explain why the answer is wrong and give you a new chance to restart and solve a new problem!",
			},
		];

		return steps[this.currentStep] || steps[0];
	}
}

