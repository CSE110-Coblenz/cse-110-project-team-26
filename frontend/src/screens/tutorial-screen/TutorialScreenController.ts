import { ScreenController, type ScreenSwitcher } from "../../types";
import { TutorialScreenView } from "./TutorialScreenView";
import { TutorialScreenModel } from "./TutorialScreenModel";

/**
 * Controller for the Tutorial screen.
 *
 * Wires up the Konva view to the tutorial model and the shared ScreenSwitcher.
 */
export class TutorialScreenController extends ScreenController {
	private view: TutorialScreenView;
	private model: TutorialScreenModel;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new TutorialScreenModel();

		this.view = new TutorialScreenView({
			onContinue: () => {
				if (this.model.isLastStep()) {
					// On last step, route to main game (graph game)
					this.screenSwitcher.switchToScreen({ type: "main-game" });
				} else {
					// Move to next tutorial step
					this.model.nextStep();
					this.updateView();
				}
			},
			onPrevious: () => {
				this.model.previousStep();
				this.updateView();
			},
			onSkip: () => {
				// Skip tutorial and go directly to main game
				this.screenSwitcher.switchToScreen({ type: "main-game" });
			},
		});

		// Initialize view with first step content
		this.updateView();
	}

	private updateView(): void {
		const stepContent = this.model.getStepContent();
		this.view.updateContent(
			stepContent.title,
			stepContent.content,
			this.model.isFirstStep(),
			this.model.isLastStep()
		);
	}

	getView(): TutorialScreenView {
		return this.view;
	}

	show(): void {
		// Reset to first step when showing tutorial
		this.model.reset();
		this.updateView();
		super.show();
	}
}

