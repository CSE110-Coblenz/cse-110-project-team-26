import Konva from "konva";
import type { ScreenSwitcher, Screen } from "../../types.ts";
import { GraphScreenController } from "./GraphScreenController.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from  "../../constants.ts";

class App implements ScreenSwitcher {
  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private graphScreenController: GraphScreenController;
  
  constructor(container: string) {
    this.stage = new Konva.Stage({
      container,
      width: STAGE_WIDTH,
      height: STAGE_HEIGHT,
    });

    this.graphScreenController = new GraphScreenController(this);

    this.stage.add(...this.graphScreenController.getView().getLayers());

    this.stage.draw();

    this.graphScreenController.getView().show();
  }
}

new App("container");
