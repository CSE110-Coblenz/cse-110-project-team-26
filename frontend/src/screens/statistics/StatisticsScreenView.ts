import Konva from "konva";
import type { View } from "../../types";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants";
import type { UserStats } from "./StatisticsScreenModel";
import { ALL_CATEGORIES } from "./StatisticsScreenModel";

export interface StatisticsScreenCallbacks {
	onReturnToGame: () => void;
}

/**
 * View for the Statistics screen.
 *
 * Displays user statistics with dark theme styling consistent with the game.
 */
export class StatisticsScreenView implements View {
	private group: Konva.Group;
	private titleText: Konva.Text;
	private totalStatsText: Konva.Text;
	private tableGroup: Konva.Group;
	private errorText: Konva.Text;
	private loadingText: Konva.Text;
	private returnButton: Konva.Rect;
	private returnText: Konva.Text;

	constructor(callbacks: StatisticsScreenCallbacks) {
		this.group = new Konva.Group({ visible: false });

		// Dark background matching game theme
		const background = new Konva.Rect({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
			fill: "#1e1e2f",
		});
		this.group.add(background);

		// Title
		this.titleText = new Konva.Text({
			x: 0,
			y: 40,
			width: STAGE_WIDTH,
			align: "center",
			text: "Your Statistics",
			fontSize: 48,
			fontFamily: "Arial",
			fill: "#ffffff",
			fontStyle: "bold",
		});
		this.group.add(this.titleText);

		// Total stats text
		this.totalStatsText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: 120,
			width: STAGE_WIDTH - 100,
			align: "center",
			text: "",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "#e0e0e0",
			lineHeight: 1.4,
		});
		this.totalStatsText.offsetX((STAGE_WIDTH - 100) / 2);
		this.group.add(this.totalStatsText);

		// Table group for statistics (centered)
		const tableWidth = STAGE_WIDTH - 200;
		this.tableGroup = new Konva.Group({
			x: STAGE_WIDTH / 2,
			y: 220,
		});
		this.tableGroup.offsetX(tableWidth / 2);
		this.group.add(this.tableGroup);

		// Error text
		this.errorText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			width: STAGE_WIDTH - 100,
			align: "center",
			text: "",
			fontSize: 20,
			fontFamily: "Arial",
			fill: "#ff8a80",
			visible: false,
		});
		this.errorText.offsetX((STAGE_WIDTH - 100) / 2);
		this.group.add(this.errorText);

		// Loading text
		this.loadingText = new Konva.Text({
			x: STAGE_WIDTH / 2,
			y: STAGE_HEIGHT / 2,
			width: STAGE_WIDTH - 100,
			align: "center",
			text: "Loading statistics...",
			fontSize: 24,
			fontFamily: "Arial",
			fill: "#ffffff",
			visible: false,
		});
		this.loadingText.offsetX((STAGE_WIDTH - 100) / 2);
		this.group.add(this.loadingText);

		// Return to Game button
		const buttonWidth = 200;
		const buttonHeight = 50;
		const buttonY = STAGE_HEIGHT - 80;

		this.returnButton = new Konva.Rect({
			x: STAGE_WIDTH / 2 - buttonWidth / 2,
			y: buttonY,
			width: buttonWidth,
			height: buttonHeight,
			fill: "#4CAF50",
			cornerRadius: 8,
		});
		this.returnText = new Konva.Text({
			x: STAGE_WIDTH / 2 - buttonWidth / 2,
			y: buttonY + (buttonHeight - 24) / 2,
			width: buttonWidth,
			align: "center",
			text: "Return to Game",
			fontSize: 22,
			fontFamily: "Arial",
			fill: "#ffffff",
		});

		this.returnButton.on("click", callbacks.onReturnToGame);
		this.returnText.on("click", callbacks.onReturnToGame);
		this.returnButton.on("mouseenter", () => {
			this.returnButton.fill("#45a049");
			this.group.getLayer()?.draw();
		});
		this.returnButton.on("mouseleave", () => {
			this.returnButton.fill("#4CAF50");
			this.group.getLayer()?.draw();
		});

		this.group.add(this.returnButton);
		this.group.add(this.returnText);
	}

	updateStats(stats: UserStats | null, getAccuracy: (answered: number, correct: number) => number): void {
		// Clear existing table content
		this.tableGroup.destroyChildren();

		if (!stats) {
			this.totalStatsText.text("");
			return;
		}

		// Update total stats
		const totalAccuracy = getAccuracy(stats.total.answered, stats.total.correct);
		this.totalStatsText.text(
			`Total Questions: ${stats.total.answered}\n` +
				`Correct Answers: ${stats.total.correct}\n` +
				`Accuracy: ${totalAccuracy}%`
		);

		// Table dimensions
		const tableWidth = STAGE_WIDTH - 200;
		const rowHeight = 35;
		const headerHeight = 40;
		const cellPadding = 10;
		const borderWidth = 2;

		// Column widths (proportional)
		const colWidths = {
			category: tableWidth * 0.5,
			answered: tableWidth * 0.15,
			correct: tableWidth * 0.15,
			difficulty: tableWidth * 0.2,
		};

		// Create header row
		const headerY = 0;
		const headerBg = new Konva.Rect({
			x: 0,
			y: headerY,
			width: tableWidth,
			height: headerHeight,
			fill: "#2a2a3f",
			stroke: "#4a4a6a",
			strokeWidth: borderWidth,
		});
		this.tableGroup.add(headerBg);

		// Header text
		const headers = [
			{ text: "Category", x: cellPadding, width: colWidths.category },
			{ text: "Answered", x: colWidths.category + cellPadding, width: colWidths.answered },
			{ text: "Correct", x: colWidths.category + colWidths.answered + cellPadding, width: colWidths.correct },
			{ text: "Difficulty Level", x: colWidths.category + colWidths.answered + colWidths.correct + cellPadding, width: colWidths.difficulty },
		];

		headers.forEach((header) => {
			const headerText = new Konva.Text({
				x: header.x,
				y: headerY + (headerHeight - 20) / 2,
				width: header.width - cellPadding * 2,
				text: header.text,
				fontSize: 18,
				fontFamily: "Arial",
				fill: "#ffffff",
				fontStyle: "bold",
				align: "left",
			});
			this.tableGroup.add(headerText);
		});

		// Create data rows
		let currentY = headerHeight;
		for (const category of ALL_CATEGORIES) {
			// Get stats for this category, defaulting to 0/0 if not present
			const bucket = stats.categories[category] || { answered: 0, correct: 0 };

			// Row background (alternating colors)
			const rowIndex = ALL_CATEGORIES.indexOf(category);
			const rowBg = new Konva.Rect({
				x: 0,
				y: currentY,
				width: tableWidth,
				height: rowHeight,
				fill: rowIndex % 2 === 0 ? "#1e1e2f" : "#252538",
				stroke: "#4a4a6a",
				strokeWidth: borderWidth,
			});
			this.tableGroup.add(rowBg);

			// Category name
			const categoryText = new Konva.Text({
				x: cellPadding,
				y: currentY + (rowHeight - 16) / 2,
				width: colWidths.category - cellPadding * 2,
				text: category,
				fontSize: 16,
				fontFamily: "Arial",
				fill: "#e0e0e0",
				align: "left",
			});
			this.tableGroup.add(categoryText);

			// Answered count
			const answeredText = new Konva.Text({
				x: colWidths.category + cellPadding,
				y: currentY + (rowHeight - 16) / 2,
				width: colWidths.answered - cellPadding * 2,
				text: bucket.answered.toString(),
				fontSize: 16,
				fontFamily: "Arial",
				fill: "#d0d0d0",
				align: "center",
			});
			this.tableGroup.add(answeredText);

			// Correct count
			const correctText = new Konva.Text({
				x: colWidths.category + colWidths.answered + cellPadding,
				y: currentY + (rowHeight - 16) / 2,
				width: colWidths.correct - cellPadding * 2,
				text: bucket.correct.toString(),
				fontSize: 16,
				fontFamily: "Arial",
				fill: "#81c784",
				align: "center",
			});
			this.tableGroup.add(correctText);

			// Difficulty level (placeholder)
			const difficultyText = new Konva.Text({
				x: colWidths.category + colWidths.answered + colWidths.correct + cellPadding,
				y: currentY + (rowHeight - 16) / 2,
				width: colWidths.difficulty - cellPadding * 2,
				text: "-",
				fontSize: 16,
				fontFamily: "Arial",
				fill: "#999999",
				align: "center",
			});
			this.tableGroup.add(difficultyText);

			currentY += rowHeight;
		}

		this.group.getLayer()?.draw();
	}

	showLoading(): void {
		this.loadingText.visible(true);
		this.errorText.visible(false);
		this.totalStatsText.text("");
		this.tableGroup.destroyChildren();
		this.group.getLayer()?.draw();
	}

	showError(error: string | null): void {
		this.loadingText.visible(false);
		this.errorText.visible(error !== null);
		this.errorText.text(error || "");
		this.totalStatsText.text("");
		this.tableGroup.destroyChildren();
		this.group.getLayer()?.draw();
	}

	hideLoadingAndError(): void {
		this.loadingText.visible(false);
		this.errorText.visible(false);
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

