import { ScreenController } from "../../types";
import { GraphScreenView } from "./GraphScreenView";
import { GraphScreenModel } from "./GraphScreenModel";
import type { ScreenSwitcher } from "../../types";

export class GraphScreenController extends ScreenController {
    private view: GraphScreenView;

    constructor() {
        super();

        this.view = new GraphScreenView();
    }

    getView(): GraphScreenView {
        return this.view;
    }
}