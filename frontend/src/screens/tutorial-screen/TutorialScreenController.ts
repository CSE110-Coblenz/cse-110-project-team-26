import { ScreenController, type ScreenSwitcher } from "../../types";
import { TutorialScreenView } from "./TutorialScreenView";
// TODO(team): Uncomment when implementing tutorial logic
// import { TutorialScreenModel } from "./TutorialScreenModel";

/**
 * Controller for the Tutorial screen.
 *
 * Wires up the Konva view to the tutorial model and the shared ScreenSwitcher.
 */
export class TutorialScreenController extends ScreenController {
	private view: TutorialScreenView;
	// TODO(team): Use model and screenSwitcher when implementing tutorial logic
	// private model: TutorialScreenModel;
	// private screenSwitcher: ScreenSwitcher;

	constructor(_screenSwitcher: ScreenSwitcher) {
		super();
		// this.screenSwitcher = screenSwitcher;
		// this.model = new TutorialScreenModel();

		this.view = new TutorialScreenView({
			onContinue: () => {
				// TODO(team): Decide which screen to route to after tutorial
				// For now, this just logs - you can route to menu, graph game, etc.
				console.log("[TutorialScreen] Continue button clicked");
				// Example: this.screenSwitcher.switchToScreen({ type: "menu" });
			},
			onSkip: () => {
				// TODO(team): Decide which screen to route to when skipping tutorial
				console.log("[TutorialScreen] Skip button clicked");
				// Example: this.screenSwitcher.switchToScreen({ type: "menu" });
			},
		});
	}

	getView(): TutorialScreenView {
		return this.view;
	}
}

