import { ScreenController, type ScreenSwitcher } from "../../types";
import { StatisticsScreenView } from "./StatisticsScreenView";
import { StatisticsScreenModel } from "./StatisticsScreenModel";

/**
 * Controller for the Statistics screen.
 *
 * Wires up the Konva view to the statistics model and the shared ScreenSwitcher.
 */
export class StatisticsScreenController extends ScreenController {
	private view: StatisticsScreenView;
	private model: StatisticsScreenModel;
	private screenSwitcher: ScreenSwitcher;

	constructor(screenSwitcher: ScreenSwitcher) {
		super();
		this.screenSwitcher = screenSwitcher;
		this.model = new StatisticsScreenModel();

		this.view = new StatisticsScreenView({
			onReturnToGame: () => {
				// Return to main game (graph game)
				this.screenSwitcher.switchToScreen({ type: "main-game" });
			},
		});
	}

	getView(): StatisticsScreenView {
		return this.view;
	}

	/**
	 * Shows the statistics screen and fetches the latest stats.
	 */
	async show(): Promise<void> {
		this.view.show();
		this.view.showLoading();
		await this.model.fetchStats();

		const state = this.model.getState();
		if (state.error) {
			this.view.showError(state.error);
		} else {
			this.view.hideLoadingAndError();
			this.view.updateStats(state.stats, (answered, correct) =>
				this.model.getAccuracy(answered, correct)
			);
		}
	}
}

