import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";

export interface TutorialScreenCallbacks {
	onContinue: () => void;
	onPrevious: () => void;
	onSkip: () => void;
}

/**
 * View for the Tutorial screen.
 *
 * Displays tutorial content with dark theme styling consistent with the game.
 * Supports multi-step navigation with dynamic content.
 */
export class TutorialScreenView implements View {
	private group: Konva.Group;
	private titleText: Konva.Text;
	private contentText: Konva.Text;
	private continueButton: Konva.Rect;
	private continueText: Konva.Text;
	private previousButton: Konva.Rect;
	private previousText: Konva.Text;
	private skipButton: Konva.Rect;
	private skipText: Konva.Text;

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

		// Title text (will be updated dynamically)
		this.titleText = new Konva.Text({
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
		this.group.add(this.titleText);

		// Tutorial content (will be updated dynamically)
		this.contentText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 180,
			width: STAGE_WIDTH - 100,
			align: "center",
			text: "",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "#e0e0e0",
			lineHeight: 1.6,
		});
		this.contentText.offsetX((STAGE_WIDTH - 100) / 2);
		this.group.add(this.contentText);

		// Button dimensions
		const buttonWidth = 150;
		const buttonHeight = 50;
		const buttonY = STAGE_HEIGHT - 100;
		const buttonSpacing = 15;

		// Previous button (initially hidden)
		this.previousButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - buttonWidth * 1.5 - buttonSpacing,
			y: buttonY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#666666",
			cornerRadius: 8,
			visible: false,
		});
		this.previousText = new Konva.Text({
			x: STAGE_WIDTH / 2 - buttonWidth * 1.5 - buttonSpacing,
			y: buttonY + (buttonHeight - 24) / 2,
			width: buttonWidth,
			align: "center",
			text: "Previous",
			fontSize: 22,
			fontFamily: "Arial",
			fill: "#ffffff",
			visible: false,
		});

		this.previousButton.on("click", callbacks.onPrevious);
		this.previousText.on("click", callbacks.onPrevious);
		this.previousButton.on("mouseenter", () => {
			this.previousButton.fill("#555555");
			this.group.getLayer()?.draw();
		});
		this.previousButton.on("mouseleave", () => {
			this.previousButton.fill("#666666");
			this.group.getLayer()?.draw();
		});

		// Continue button
		this.continueButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - buttonWidth / 2,
			y: buttonY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#4CAF50",
			cornerRadius: 8,
		});
		this.continueText = new Konva.Text({
			x: STAGE_WIDTH / 2 - buttonWidth / 2,
			y: buttonY + (buttonHeight - 24) / 2,
			width: buttonWidth,
			align: "center",
			text: "Continue",
			fontSize: 22,
			fontFamily: "Arial",
			fill: "#ffffff",
		});

		this.continueButton.on("click", callbacks.onContinue);
		this.continueText.on("click", callbacks.onContinue);
		this.continueButton.on("mouseenter", () => {
			this.continueButton.fill("#45a049");
			this.group.getLayer()?.draw();
		});
		this.continueButton.on("mouseleave", () => {
			this.continueButton.fill("#4CAF50");
			this.group.getLayer()?.draw();
		});

		// Skip button (only shown on first step)
		this.skipButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 + buttonWidth / 2 + buttonSpacing,
			y: buttonY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#666666",
			cornerRadius: 8,
		});
		this.skipText = new Konva.Text({
			x: STAGE_WIDTH / 2 + buttonWidth / 2 + buttonSpacing,
			y: buttonY + (buttonHeight - 24) / 2,
			width: buttonWidth,
			align: "center",
			text: "Skip",
			fontSize: 22,
			fontFamily: "Arial",
			fill: "#ffffff",
		});

		this.skipButton.on("click", callbacks.onSkip);
		this.skipText.on("click", callbacks.onSkip);
		this.skipButton.on("mouseenter", () => {
			this.skipButton.fill("#555555");
			this.group.getLayer()?.draw();
		});
		this.skipButton.on("mouseleave", () => {
			this.skipButton.fill("#666666");
			this.group.getLayer()?.draw();
		});

		this.group.add(this.previousButton);
		this.group.add(this.previousText);
		this.group.add(this.continueButton);
		this.group.add(this.continueText);
		this.group.add(this.skipButton);
		this.group.add(this.skipText);
	}

	updateContent(title: string, content: string, isFirstStep: boolean, isLastStep: boolean): void {
		this.titleText.text(title);
		this.contentText.text(content);
		this.contentText.offsetX((STAGE_WIDTH - 100) / 2);

		// Show/hide Previous button (hidden on first step)
		this.previousButton.visible(!isFirstStep);
		this.previousText.visible(!isFirstStep);

		// Show/hide Skip button (only on first step)
		this.skipButton.visible(isFirstStep);
		this.skipText.visible(isFirstStep);

		// Update Continue button text on last step
		this.continueText.text(isLastStep ? "Start Game" : "Continue");

		this.group.getLayer()?.draw();
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

