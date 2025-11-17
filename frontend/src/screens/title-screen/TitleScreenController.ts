import { ScreenController } from "../../types";
import { TitleScreenView } from "./TitleScreenView";
import { TitleScreenModel } from "./TitleScreenModel";

/**
 * Controller for the Title/Login/Register screen.
 *
 * Wires up the Konva view to the auth model and the shared ScreenSwitcher.
 */
export class TitleScreenController extends ScreenController {
	private view: TitleScreenView;
	private model: TitleScreenModel;

	constructor(_screenSwitcher: unknown) { // screenSwitcher retained for future integration
		super();
		this.model = new TitleScreenModel();

		this.view = new TitleScreenView({
			onLogin: (email, password) => {
				console.log("[TitleScreen] Login button clicked");
				void this.handleSubmit("login", email, password);
			},
			onRegister: (email, password) => {
				console.log("[TitleScreen] Register button clicked");
				void this.handleSubmit("register", email, password);
			},
		});
	}

	getView(): TitleScreenView {
		return this.view;
	}

	private async handleSubmit(
		mode: "login" | "register",
		email: string,
		password: string,
	): Promise<void> {
		if (!email || !password) {
			this.view.showMessage("Please enter both email and password.", true);
			return;
		}

		this.model.switchMode(mode);
		this.model.setCredentials(email.trim(), password);

		const result = await this.model.submitAuth();
		if (result.success) {
			this.view.showMessage("Success! You're logged in.", false);
		} else {
			this.view.showMessage(result.message ?? "Login failed.", true);
		}
	}
}
