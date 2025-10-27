import Konva from "konva";
import type { View } from "../../types";



export class GraphScreenView implements View {
    private group: Konva.Group;

    constructor() {
        this.group = new Konva.Group();
    }

    getGroup(): Konva.Group {
        return this.group;
    }

    show() {
        return;
    }

    hide() {
        return;
    }
}