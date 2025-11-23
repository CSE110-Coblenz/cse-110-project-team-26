import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export interface TitleScreenCallbacks {
	onLogin: (email: string, password: string) => void;
	onRegister: (email: string, password: string) => void;
}

/**
 * View for the Title/Login/Register screen.
 *
 * Uses Konva for the background/title art, and overlays simple HTML inputs
 * so users can actually enter credentials while we experiment with auth.
 */
export class TitleScreenView implements View {
	private group: Konva.Group;
	private formContainer: HTMLDivElement;
	private emailInput: HTMLInputElement;
	private passwordInput: HTMLInputElement;
	private messageNode: HTMLParagraphElement;

	constructor(callbacks: TitleScreenCallbacks) {
		this.group = new Konva.Group({ visible: false });

		const background = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#1e1e2f",
		});
		this.group.add(background);

		const titleText = new Konva.Text({
			x: 0,
			y: 80,
			width: STAGE_WIDTH,
			align: "center",
			text: "(Game Name)",
			fontSize: 40,
			fontFamily: "Arial",
			fill: "#ffffff",
		});
		this.group.add(titleText);

		this.formContainer = document.createElement("div");
		this.formContainer.style.position = "absolute";
		this.formContainer.style.top = "50%";
		this.formContainer.style.left = "50%";
		this.formContainer.style.transform = "translate(-50%, -10%)";
		this.formContainer.style.display = "none";
		this.formContainer.style.flexDirection = "column";
		this.formContainer.style.padding = "24px";
		this.formContainer.style.borderRadius = "12px";
		this.formContainer.style.background = "rgba(0, 0, 0, 0.65)";
		this.formContainer.style.gap = "12px";
		this.formContainer.style.width = "320px";
		this.formContainer.style.zIndex = "10";
		this.formContainer.style.color = "#fff";
		document.body.appendChild(this.formContainer);

		const heading = document.createElement("h2");
		heading.textContent = "Sign in or Register";
		heading.style.margin = "0";
		heading.style.textAlign = "center";
		this.formContainer.appendChild(heading);

		this.emailInput = document.createElement("input");
		this.emailInput.type = "email";
		this.emailInput.placeholder = "Email";
		this.emailInput.style.padding = "10px";
		this.emailInput.style.borderRadius = "6px";
		this.emailInput.style.border = "1px solid #333";
		this.emailInput.style.background = "#222";
		this.emailInput.style.color = "#fff";
		this.formContainer.appendChild(this.emailInput);

		this.passwordInput = document.createElement("input");
		this.passwordInput.type = "password";
		this.passwordInput.placeholder = "Password";
		this.passwordInput.style.padding = "10px";
		this.passwordInput.style.borderRadius = "6px";
		this.passwordInput.style.border = "1px solid #333";
		this.passwordInput.style.background = "#222";
		this.passwordInput.style.color = "#fff";
		this.formContainer.appendChild(this.passwordInput);

		const buttonRow = document.createElement("div");
		buttonRow.style.display = "flex";
		buttonRow.style.gap = "12px";
		buttonRow.style.justifyContent = "space-between";
		this.formContainer.appendChild(buttonRow);

		const loginButton = document.createElement("button");
		loginButton.type = "button";
		loginButton.textContent = "Login";
		loginButton.style.flex = "1";
		loginButton.style.padding = "10px";
		loginButton.style.border = "none";
		loginButton.style.borderRadius = "6px";
		loginButton.style.background = "#4CAF50";
		loginButton.style.color = "#fff";
		loginButton.style.cursor = "pointer";
		loginButton.addEventListener("click", () =>
			callbacks.onLogin(this.emailInput.value, this.passwordInput.value)
		);
		buttonRow.appendChild(loginButton);

		const registerButton = document.createElement("button");
		registerButton.type = "button";
		registerButton.textContent = "Register";
		registerButton.style.flex = "1";
		registerButton.style.padding = "10px";
		registerButton.style.border = "none";
		registerButton.style.borderRadius = "6px";
		registerButton.style.background = "#2196F3";
		registerButton.style.color = "#fff";
		registerButton.style.cursor = "pointer";
		registerButton.addEventListener("click", () =>
			callbacks.onRegister(this.emailInput.value, this.passwordInput.value)
		);
		buttonRow.appendChild(registerButton);

		this.messageNode = document.createElement("p");
		this.messageNode.style.margin = "0";
		this.messageNode.style.minHeight = "20px";
		this.messageNode.style.fontSize = "0.9rem";
		this.messageNode.style.textAlign = "center";
		this.formContainer.appendChild(this.messageNode);
	}

	getGroup(): Konva.Group {
		return this.group;
	}

	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
		this.formContainer.style.display = "flex";
	}

	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
		this.formContainer.style.display = "none";
	}

	showMessage(message: string | null, isError = false): void {
		if (!message) {
			this.messageNode.textContent = "";
			return;
		}

		this.messageNode.textContent = message;
		this.messageNode.style.color = isError ? "#ff8a80" : "#81c784";
	}
}
