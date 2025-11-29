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
	private screenSwitcher: ScreenSwitcher;
  private game: string;
  private steps: number;
  private content: object;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
    this.screenSwitcher = screenSwitcher;
	}

  configure(screen: string, steps: number, content: object) {
    this.model = new TutorialScreenModel(steps);
		this.view = new TutorialScreenView({
			onContinue: () => {
        const isLastScreen = this.model.nextStep();
        if(isLastScreen) {
          this.screenSwitcher.switchToScreen({ type: screen });
          this.model.reset();
          this.view.updateContentText(content["step0"]);
          this.screenSwitcher.switchToScreen({ type: screen });
        } else {
          this.view.updateContentText(content[`step${this.model.getCurrentStep()}`]);
        }
			},
			onSkip: () => {
				this.screenSwitcher.switchToScreen({ type: screen });
			},
		});
    this.view.updateContentText(content["step0"]);
    this.view.updateTitleText(content["title"]);
  }

	getView(): TutorialScreenView {
		return this.view;
	}
}

