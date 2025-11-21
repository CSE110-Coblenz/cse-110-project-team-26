import Konva from "konva";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";

export class MazeTutorialView {
    private group: Konva.Group;
    private tutorialText: Konva.Text
    private nextButton: Konva.Rect;
    
    constructor(handler: () => void, tutorialText: string = "") {
        this.group = new Konva.Group({visible: false});
        const bg = new Konva.Rect({
                    x: 0,
                    y: 0,
                    width: STAGE_WIDTH,
                    height: STAGE_HEIGHT,
                    fill: "#616567ff", // Sky blue
        });
        this.group.add(bg);
        this.tutorialText = new Konva.Text({
            text: "",
            fontSize: 18,
            fontFamily: "Arial",
            fill: "black",
            width: 400,
            align: "center",
        });
        this.updateTutorialText(tutorialText);
        this.group.add(this.tutorialText);
        this.nextButton = new Konva.Rect({
            x: 150,
            y: 300,
            width: 100,
            height: 50,
            fill: "blue",
            cornerRadius: 10,
        });
        const nextButtonText = new Konva.Text({
            x: 175,
            y: 315,
            text: "Next",
            fontSize: 20,
            fontFamily: "Arial",
            fill: "white",
        });
        this.nextButton.on('click', () => handler());
        this.group.add(this.nextButton, nextButtonText);
    }
    // Update the tutorial text with the provided steps
    private updateTutorialText(instructions : string) {
        const tutorialContent = instructions;
        this.tutorialText.text(tutorialContent);
    }
    // Show the tutorial view
    show() {
        console.log("Showing tutorial");
        console.log(this.group.getLayer());

        this.group.visible(true);
        this.group.getLayer()?.draw();
    }
    // Hide the tutorial view
    hide() {
        this.group.visible(false);
        this.group.getLayer()?.draw();
    }
    // Get the Konva group for this view
    getGroup() {
        return this.group;
    }
}