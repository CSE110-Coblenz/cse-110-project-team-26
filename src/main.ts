import Konva from "konva";
import type { ScreenSwitcher, Screen } from "./types.ts";

import { MenuTestScreenController } from "./screens/MenuTestScreen/MenuTestScreenController.ts";
import { MatchingScreenController } from "./screens/MatchingScreen/MatchingScreenController.ts";
import { MazeScreenController } from "./screens/MazeScreen/MazeScreenController.ts";
import { MainScreenController } from "./screens/MainScreen/MainScreenController.ts";

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

	private menuTestController: MenuTestScreenController;
	private matchingScreenController: MatchingScreenController;
	private mazeScreenController: MazeScreenController;
	private mainScreenController: MainScreenController;

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
		this.menuTestController = new MenuTestScreenController(this);
		this.matchingScreenController = new MatchingScreenController(this, this.stage);
		this.mazeScreenController = new MazeScreenController(this);
		this.mainScreenController = new MainScreenController(this);

		// Add all screen groups to the layer
		// All screens exist simultaneously but only one is visible at a time

		this.layer.add(this.menuTestController.getView().getGroup());
		this.layer.add(this.matchingScreenController.getView().getGroup());
		this.layer.add(this.mazeScreenController.getView().getGroup());
		this.layer.add(this.mainScreenController.getView().getGroup());

		// Draw the layer (render everything to the canvas)
		this.layer.draw();

		// Start with menu screen visible
		this.switchToScreen({ type: "menu" });
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
		this.menuTestController.hide();
		this.matchingScreenController.hide();
		this.mazeScreenController.hide();
		this.mainScreenController.hide();

		// Show the requested screen based on the screen type
		switch (screen.type) {
			case "menu":
				this.menuTestController.show();
				break;

			case "matching-game":
				this.matchingScreenController.show();
				break;

			case "maze-game":
				this.mazeScreenController.show();
				break;

			case "main-game":
				this.mainScreenController.show();
				break;
		}
	}
}

// Initialize the application
new App("container");
