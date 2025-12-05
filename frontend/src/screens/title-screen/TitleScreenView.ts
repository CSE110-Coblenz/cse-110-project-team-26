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
			fill: "#2b2b2b",
		});
		this.group.add(background);

		const titleText = new Konva.Text({
			x: 0,
			y: 80,
			width: STAGE_WIDTH,
			align: "center",
			text: "Game Name",
			fontSize: 48,
			fontFamily: "medodica, sans-serif",
			fill: "#e9f3ff",
			shadowColor: "#0a8ea8",
			shadowBlur: 10,
			shadowOffset: { x: 3, y: 3 },
		});
		this.group.add(titleText);

		this.formContainer = document.createElement("div");
		this.formContainer.style.position = "absolute";
		this.formContainer.style.top = "50%";
		this.formContainer.style.left = "50%";
		this.formContainer.style.transform = "translate(-50%, -50%)";
		this.formContainer.style.display = "none";
		this.formContainer.style.flexDirection = "column";
		this.formContainer.style.padding = "32px";
		this.formContainer.style.borderRadius = "0";
		this.formContainer.style.background = "rgba(54, 54, 54, 0.9)";
		this.formContainer.style.border = "4px solid #0a3b52";
		this.formContainer.style.boxShadow = "8px 8px 0 #04070f, 0 0 10px rgba(10, 59, 82, 0.7)";
		this.formContainer.style.gap = "14px";
		this.formContainer.style.width = "420px";
		this.formContainer.style.zIndex = "10";
		this.formContainer.style.color = "#fff";
		this.formContainer.style.fontFamily = "medodica, sans-serif";
		this.formContainer.style.textTransform = "uppercase";
		document.body.appendChild(this.formContainer);

		const heading = document.createElement("h2");
		heading.textContent = "Sign in or Register";
		heading.style.margin = "0";
		heading.style.textAlign = "center";
		heading.style.fontSize = "18px";
		heading.style.letterSpacing = "1px";
		heading.style.fontFamily = "medodica, sans-serif";
		this.formContainer.appendChild(heading);

		this.emailInput = document.createElement("input");
		this.emailInput.type = "email";
		this.emailInput.placeholder = "Email";
		this.emailInput.style.padding = "16px";
		this.emailInput.style.borderRadius = "0";
		this.emailInput.style.border = "3px solid #0a3b52";
		this.emailInput.style.background = "#080c18";
		this.emailInput.style.color = "#fff";
		this.emailInput.style.fontFamily = "medodica, sans-serif";
		this.emailInput.style.fontSize = "16px";
		this.formContainer.appendChild(this.emailInput);

		this.passwordInput = document.createElement("input");
		this.passwordInput.type = "password";
		this.passwordInput.placeholder = "Password";
		this.passwordInput.style.padding = "16px";
		this.passwordInput.style.borderRadius = "0";
		this.passwordInput.style.border = "3px solid #0a3b52";
		this.passwordInput.style.background = "#080c18";
		this.passwordInput.style.color = "#fff";
		this.passwordInput.style.fontFamily = "medodica, sans-serif";
		this.passwordInput.style.fontSize = "16px";
		this.formContainer.appendChild(this.passwordInput);

		const buttonRow = document.createElement("div");
		buttonRow.style.display = "flex";
		buttonRow.style.gap = "10px";
		buttonRow.style.justifyContent = "space-between";
		this.formContainer.appendChild(buttonRow);

		const loginButton = document.createElement("button");
		loginButton.type = "button";
		loginButton.textContent = "Login";
		loginButton.style.flex = "1";
		loginButton.style.padding = "16px";
		loginButton.style.border = "3px solid #0a3b52";
		loginButton.style.borderRadius = "0";
		loginButton.style.background = "#0f3a26";
		loginButton.style.boxShadow = "6px 6px 0 #050912";
		loginButton.style.color = "#fff";
		loginButton.style.fontFamily = "medodica, sans-serif";
		loginButton.style.fontSize = "16px";
		loginButton.style.cursor = "pointer";
		loginButton.addEventListener("click", () =>
			callbacks.onLogin(this.emailInput.value, this.passwordInput.value)
		);
		buttonRow.appendChild(loginButton);

		const registerButton = document.createElement("button");
		registerButton.type = "button";
		registerButton.textContent = "Register";
		registerButton.style.flex = "1";
		registerButton.style.padding = "16px";
		registerButton.style.border = "3px solid #0a3b52";
		registerButton.style.borderRadius = "0";
		registerButton.style.background = "#102b52";
		registerButton.style.boxShadow = "6px 6px 0 #050912";
		registerButton.style.color = "#fff";
		registerButton.style.fontFamily = "medodica, sans-serif";
		registerButton.style.fontSize = "16px";
		registerButton.style.cursor = "pointer";
		registerButton.addEventListener("click", () =>
			callbacks.onRegister(this.emailInput.value, this.passwordInput.value)
		);
		buttonRow.appendChild(registerButton);

		this.messageNode = document.createElement("p");
		this.messageNode.style.margin = "0";
		this.messageNode.style.minHeight = "20px";
		this.messageNode.style.fontSize = "16px";
		this.messageNode.style.textAlign = "center";
		this.messageNode.style.fontFamily = "medodica, sans-serif";
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
