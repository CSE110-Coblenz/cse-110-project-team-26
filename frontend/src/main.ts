import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";
// Legacy imports kept for future merge:
// import { MenuScreenController } from "./screens/MenuScreen/MenuScreenController.ts";
// import { GameScreenController } from "./screens/GameScreen/GameScreenController.ts";
// import { ResultsScreenController } from "./screens/ResultsScreen/ResultsScreenController.ts";
// import { GraphScreenController } from "./screens/graph-game/GraphScreenController.ts";
import { TitleScreenController } from "./screens/title-screen/TitleScreenController.ts";
import { TutorialScreenController } from "./screens/tutorial-screen/TutorialScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "./constants.ts";

/**
 * Main Application - Coordinates all screens
 *
 * This class demonstrates screen management using Konva Groups.
 * Each screen (Menu, Game, Results) has its own Konva.Group that can be
 * shown or hidden independently.
 *
 * Key concept: All screens are added to the same layer, but only one is
 * visible at a time. This is managed by the switchToScreen() method.
 */
class App implements ScreenSwitcher {
	private stage: Konva.Stage;
	private layer: Konva.Layer;

	// private menuController: MenuScreenController;
	// private gameController: GameScreenController;
	// private resultsController: ResultsScreenController;
	// private graphController: GraphScreenController;
	private titleController: TitleScreenController;
	private tutorialController: TutorialScreenController;

	constructor(container: string) {
		// Initialize Konva stage (the main canvas)
		this.stage = new Konva.Stage({
			container,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
		});

		// Create a layer (screens will be added to this layer)
		this.layer = new Konva.Layer();
		this.stage.add(this.layer);

		// Initialize all screen controllers
		// Each controller manages a Model, View, and handles user interactions
		// TODO(team): Re-enable controllers once they're merged
		// this.menuController = new MenuScreenController(this);
		// this.gameController = new GameScreenController(this);
		// this.resultsController = new ResultsScreenController(this);
		// this.graphController = new GraphScreenController(this);
		this.titleController = new TitleScreenController(this);
		this.tutorialController = new TutorialScreenController(this);

		// Add all screen groups to the layer
		// All screens exist simultaneously but only one is visible at a time
		// this.layer.add(this.menuController.getView().getGroup());
		// this.layer.add(this.gameController.getView().getGroup());
		// this.layer.add(this.resultsController.getView().getGroup());
		// this.layer.add(this.graphController.getView().getGroup());
		this.layer.add(this.titleController.getView().getGroup());
		this.layer.add(this.tutorialController.getView().getGroup());

		// Draw the layer (render everything to the canvas)
		this.layer.draw();

		// Start with title screen visible
		this.titleController.getView().show();
	}

	/**
	 * Switch to a different screen
	 *
	 * This method implements screen management by:
	 * 1. Hiding all screens (setting their Groups to invisible)
	 * 2. Showing only the requested screen
	 *
	 * This pattern ensures only one screen is visible at a time.
	 */
	switchToScreen(screen: Screen): void {
		// Hide all screens first by setting their Groups to invisible
		// this.menuController.hide();
		// this.gameController.hide();
		// this.resultsController.hide();
		// this.graphController.hide();
		this.titleController.hide();
		this.tutorialController.hide();

		// Show the requested screen based on the screen type
		switch (screen.type) {
			case "title":
				this.titleController.show();
				break;

			case "tutorial":
				this.tutorialController.show();
				break;

			// case "graph":
			// 	this.graphController.show();
			// 	break;
		}
	}
}

// Initialize the application
new App("container");
