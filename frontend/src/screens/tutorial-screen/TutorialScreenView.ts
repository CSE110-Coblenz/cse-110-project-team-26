import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export interface TutorialScreenCallbacks {
	onContinue: () => void;
	onSkip: () => void;
}

/**
 * View for the Tutorial screen.
 *
 * Displays tutorial content with dark theme styling consistent with the game.
 * TODO(team): Add actual tutorial content, images, and interactive elements.
 */
export class TutorialScreenView implements View {
	private group: Konva.Group;

	constructor(callbacks: TutorialScreenCallbacks) {
		this.group = new Konva.Group({ visible: false });

		// Dark background matching title screen theme
		const background = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#1e1e2f",
		});
		this.group.add(background);

		// Title text
		const titleText = new Konva.Text({
			x: 0,
			y: 60,
			width: STAGE_WIDTH,
			align: "center",
			text: "Tutorial",
			fontSize: 48,
			fontFamily: "Arial",
			fill: "#ffffff",
			fontStyle: "bold",
		});
		this.group.add(titleText);

		// Tutorial content placeholder
		const contentText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 180,
			width: STAGE_WIDTH - 100,
			align: "center",
			text: "Welcome to (Game Name)!\n\nThis tutorial will teach you how to play.\n\nTODO: Add tutorial content here.",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "#e0e0e0",
			lineHeight: 1.6,
		});
		contentText.offsetX(contentText.width() / 2);
		this.group.add(contentText);

		// Button dimensions
		const buttonWidth = 180;
		const buttonHeight = 50;
		const buttonY = STAGE_HEIGHT - 100;
		const buttonSpacing = 20;

		// Continue button
		const continueButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - buttonWidth - buttonSpacing / 2,
			y: buttonY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#4CAF50",
			cornerRadius: 8,
		});
		const continueText = new Konva.Text({
			x: STAGE_WIDTH / 2 - buttonWidth - buttonSpacing / 2,
			y: buttonY + (buttonHeight - 24) / 2,
			width: buttonWidth,
			align: "center",
			text: "Continue",
			fontSize: 22,
			fontFamily: "Arial",
			fill: "#ffffff",
		});

		continueButton.on("click", callbacks.onContinue);
		continueText.on("click", callbacks.onContinue);
		continueButton.on("mouseenter", () => {
			continueButton.fill("#45a049");
			this.group.getLayer()?.draw();
		});
		continueButton.on("mouseleave", () => {
			continueButton.fill("#4CAF50");
			this.group.getLayer()?.draw();
		});

		// Skip button
		const skipButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 + buttonSpacing / 2,
			y: buttonY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#666666",
			cornerRadius: 8,
		});
		const skipText = new Konva.Text({
			x: STAGE_WIDTH / 2 + buttonSpacing / 2,
			y: buttonY + (buttonHeight - 24) / 2,
			width: buttonWidth,
			align: "center",
			text: "Skip",
			fontSize: 22,
			fontFamily: "Arial",
			fill: "#ffffff",
		});

		skipButton.on("click", callbacks.onSkip);
		skipText.on("click", callbacks.onSkip);
		skipButton.on("mouseenter", () => {
			skipButton.fill("#555555");
			this.group.getLayer()?.draw();
		});
		skipButton.on("mouseleave", () => {
			skipButton.fill("#666666");
			this.group.getLayer()?.draw();
		});

		this.group.add(continueButton);
		this.group.add(continueText);
		this.group.add(skipButton);
		this.group.add(skipText);
	}

	getGroup(): Konva.Group {
		return this.group;
	}

	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}
}

