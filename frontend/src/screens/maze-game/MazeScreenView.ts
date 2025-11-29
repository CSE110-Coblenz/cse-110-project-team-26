import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { ChoiceModel } from "./MazeModels.ts";
import '../../styles.css';

// Component to represent a choice in the maze game
export class ChoiceView {
    private group: Konva.Group;
    private choice: ChoiceModel | null = null;
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        this.group = new Konva.Group();
        this.x = x;
        this.y = y;
        const rectWidth = 100;
        const rectHeight = 100;

        const rect = new Konva.Rect({
            fill: "black",
            width: rectWidth,
            height: rectHeight
        });

        const text = new Konva.Text({
            text: "Choice",
            fontSize: 24,
            fontFamily: "medodica",
            fill: "white",
            width: rectWidth,
            align: "center",
        });

        // center vertically:
        text.y((rectHeight - text.height()) / 2);

        this.group.add(rect, text);
        this.group.position({ x, y });
    }
    // Get the Konva group for this choice
    getGroup() { return this.group; }
    // Update the displayed text for the choice
    setText(newChoice: ChoiceModel) {
        this.choice = newChoice;
        const textNode = this.group.findOne<Konva.Text>('Text');
        if (textNode) {
            textNode.text(newChoice.getText());
        }
    }
    // Get the associated ChoiceModel
    getChoice() { return this.choice; }
    // Register click handler for this choice
    onClick(handler: (choice: ChoiceModel, x:number, y:number) => void) {
        this.group.on('click', () => handler(this.choice as ChoiceModel, this.x, this.y+50));
        console.log("Registered click handler for choice at:", this.x, this.y);
    }
}

/**
 * GameScreenView - Renders the game UI using Konva
 */
export class MazeScreenView implements View {
	private group: Konva.Group;
	private scoreText: Konva.Text;
	private timerText: Konva.Text;
    private problemText: Konva.Image;
    private choiceOne : ChoiceView;
    private choiceTwo : ChoiceView;
    private choiceThree : ChoiceView;
    private transitionScreen: Konva.Rect;
    private player: Konva.Sprite|null = null;

	constructor(handler: (choice : ChoiceModel, x:number, y:number) => void) {
		this.group = new Konva.Group({ visible: false });

        // overlay for transition effect
        this.transitionScreen = new Konva.Rect({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            fill: "black",
            opacity: 0.0,
        });
        this.group.add(this.transitionScreen);

		// Background
		const bg = new Konva.Image({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
            image: (() => {
                const image = new Image();
                image.src = "/cave.png";
                return image;
            })()
		});
		this.group.add(bg);

		// Score display (top-left)
		this.scoreText = new Konva.Text({
			x: 20,
			y: 20,
			text: "Score: 0",
			fontSize: 32,
			fontFamily: "medodica",
			fill: "black",
		});
		this.group.add(this.scoreText);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 60",
			fontSize: 32,
			fontFamily: "Arial",
			fill: "red",
		});
		this.group.add(this.timerText);

		// Objects in scene
        // Problem statement
        this.problemText = new Konva.Image({
            x: 0,
            y: 0,
            image: new Image(),
        });
        this.problemText.x((STAGE_WIDTH - this.problemText.width()) / 2-100);
        this.problemText.y((STAGE_HEIGHT - this.problemText.height() - 350) / 2);
        // Choices
        // 50 = half width of choice rectangle
		this.choiceOne = new ChoiceView(STAGE_WIDTH/2-50, STAGE_HEIGHT/2);
        this.choiceTwo = new ChoiceView(STAGE_WIDTH/2-350, STAGE_HEIGHT/2+20);
        this.choiceThree = new ChoiceView(STAGE_WIDTH/2+250, STAGE_HEIGHT/2+20);
        // Add to group
        this.group.add(
            this.choiceOne.getGroup(),
            this.choiceTwo.getGroup(), 
            this.choiceThree.getGroup(),
            this.problemText
        );
        // Register click handlers, passing the choice model to the handler
        this.choiceOne.onClick(handler);
        this.choiceTwo.onClick(handler);
        this.choiceThree.onClick(handler);


        // Player circle
        const image = new Image();
        image.src = "/mazegame.png";
        image.onload = () => {
            console.log("Sprite image loaded");
            this.player = new Konva.Sprite({
                x: STAGE_WIDTH / 2 - 64,
                y: STAGE_HEIGHT - 150,
                image: image,
                animation: "idle",
                animations: {
                idle: [
                    0, 0, 160, 160,
                    160, 0, 160, 160,
                    320, 0, 160, 160,
                    480, 0, 160, 160,
                ],
                walk: [
                    640, 0, 160, 160,
                    800, 0, 160, 160,
                    960, 0, 160, 160,
                    1120, 0, 160, 160,
                    1280, 0, 160, 160,
                    1440, 0, 160, 160,
                    1600, 0, 160, 160,
                    1760, 0, 160, 160,
                ],
                win: [
                    1920, 0, 160, 160,
                    2080, 0, 160, 160,
                    2240, 0, 160, 160,
                    2400, 0, 160, 160,
                    2560, 0, 160, 160,
                    2720, 0, 160, 160,
                    2880, 0, 160, 160,
                    3040, 0, 160, 160,
                ]
                },
                frameRate: 3,
                frameIndex: 0,
                scale: { x: 0.8, y: 0.8 },
            });
            this.group.add(this.player);
            this.player.start();
        };
	}

	/**
	 * Update score display
	 */
	updateScore(score: number): void {
		this.scoreText.text(`Score: ${score}`);
		this.group.getLayer()?.draw();
	}

	/**
	 * Update timer display
	 */
	updateTimer(timeRemaining: number): void {
		this.timerText.text(`Time: ${timeRemaining}`);
		this.group.getLayer()?.draw();
	}

    // Update problem display
    async updateProblem(latex: string) {
        const canvas = await this.loadLatexImage(latex);
        this.problemText.image(canvas);
        this.problemText.width(canvas.width);
        this.problemText.height(canvas.height);
        this.problemText.x((STAGE_WIDTH - this.problemText.width()) / 2);
        this.problemText.y((STAGE_HEIGHT - this.problemText.height() - 400) / 2);
        this.problemText.getLayer()?.draw();
    }
    

    // Update choices display
    updateChoices(choices: ChoiceModel[]): void {
        const choiceTexts = [this.choiceOne, this.choiceTwo, this.choiceThree];
        for (let i = 0; i < 3; i++) {
            choiceTexts[i].setText(choices[i]);
        }
        this.group.getLayer()?.draw();
    }
    // Fade to black transition
    fadeToBlack(duration: number = 0.4): Promise<void> {
    this.transitionScreen.moveToTop();
        return new Promise((resolve) => {
            new Konva.Tween({
            node: this.transitionScreen,
            opacity: 1,
            duration,
            onFinish: () => {
            this.resetPlayerPosition();
            this.player?.scaleX(0.8);
            this.player?.scaleY(0.8);
            resolve();
        },
            }).play();
        });
    }
    // Fade from black transition
    fadeFromBlack(duration: number = 0.5): Promise<void> {
        return new Promise((resolve) => {
            new Konva.Tween({
            node: this.transitionScreen,
            opacity: 0,
            duration,
            onFinish: () => {
            this.transitionScreen.moveToBottom();
            resolve();
        },
            }).play();
        });
    }
    transitMovetoBottom(){
        this.transitionScreen.moveToBottom();
        this.transitionScreen.opacity(0);
    }
    // Helper function to set player animation
    setAnimation(name: string) {
        if (!this.player) return;
        if (name === "idle") {
            this.player.frameRate(3);
        }
        if (name === "walk") {
            this.player.frameRate(10);
        }
        if (name === "win") {
            this.player.frameRate(2);
        }
        this.player.animation(name);
        this.player.start();
    }
    // Move the player circle to new position
    movePlayerTo(x: number, y: number): Promise<void> {
        if (!this.player) return Promise.resolve();
        const dx = x - this.player.x();
        const dy = y - this.player.y();
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Constant speed
        const SPEED = Math.abs(x-(STAGE_WIDTH/2-50))<50? 75:200; 
        const duration = distance / SPEED;
        this.setAnimation("walk");
        return new Promise((resolve) => {
            new Konva.Tween({
                node: this.player as Konva.Sprite,
                x,
                y,
                duration,
                scaleX: 0.6,
                scaleY: 0.6,
                easing: Konva.Easings.Linear,
                onFinish: () => { 
                    this.setAnimation("idle");
                    resolve();
                }
            }).play();
        });
    }
    resetPlayerPosition() {
        console.log("Resetting player position");
        if (!this.player) return;
        this.player.position({ x: STAGE_WIDTH / 2 - 64, y: STAGE_HEIGHT - 150 });
        this.group.getLayer()?.draw();
    }
    displayMessage(correctness : string, callBack?: () => void){
        const bg = new Konva.Image({
        x: 0,
        y: 0,
        width: STAGE_WIDTH,
        height: STAGE_HEIGHT,
        image: (() => {
            const image = new Image();
            image.src = "/backgroundMessage.png";
            return image;
            })()
        });
        
        const message = new Konva.Text({
            x: 200,
            y: STAGE_HEIGHT/3,
            align: 'center',
            verticalAlign: 'middle',
            fontSize: 60,
            fontFamily: "medodica",
            fill: "white",
        }); 
        
        switch (correctness){
            case "Correct":
                message.text("Tunnel Choice Correct! \n Keep Moving Forward");
                break;
            case "Incorrect":
                message.text("Tunnel Choice Incorrect \n Try another route from the beginning");
                message.x(10);
                break;
            case "Congrats": 
                message.text("Congratulations!!! \n You escaped the Maze");
                break;
            case "Timeout":
                message.text("You have run out of time! \n Try another route from the beginning");
                message.x(10)
                break;
        }

        setTimeout(()=>{ // Delays the message display to let fadeIn Animation finish
            this.group.add(bg)
            this.group.add(message);

        },100);

        bg.on('click', () => {
            bg.destroy();
            message.destroy();
            this.transitMovetoBottom();
            if(callBack) callBack();
            clearTimeout(timeOut);

            //console.log("destroyed on click")
        });
                
        const timeOut = setTimeout(()=>{
            bg.destroy();
            this.transitMovetoBottom();
            message.destroy();
            if(callBack) callBack();
            console.log("destroyed on time")
        },5000);

    }

    // Helper function to render LaTeX to Konva canvas
    async loadLatexImage(latex: string): Promise<HTMLImageElement> {
        const img = new Image();
        // encode LaTeX for URL
        console.log("Loading LaTeX image for:", latex);
        const encoded = encodeURIComponent(`\\large&space;\\dpi{200}\\bg{black}{\\color{White}\\mathbf ${latex}`);
        img.src = `https://latex.codecogs.com/png.image?${encoded}`;

        // wait for it to load
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = reject;
        });
    
        return img;
    }
    // Clean up resources
    destroy(): void {
        // remove choice groups from the scene
        this.choiceOne.getGroup().destroy();
        this.choiceTwo.getGroup().destroy();
        this.choiceThree.getGroup().destroy();
        this.problemText.destroy();
    }
    // Animation when winning
    playWinAnimation(): Promise<void> {
        return this.movePlayerTo(STAGE_WIDTH / 2 - 64, STAGE_HEIGHT / 2)
            .then(() => {
                this.setAnimation("win");
                return new Promise<void>(resolve => {
                    setTimeout(resolve, 4000); // length of win animation
                });
            });
    }
	/**
	 * Show the screen
	 */
	show(): void {
		this.group.visible(true);
		this.group.getLayer()?.draw();
	}

	/**
	 * Hide the screen
	 */
	hide(): void {
		this.group.visible(false);
		this.group.getLayer()?.draw();
	}

	getGroup(): Konva.Group {
		return this.group;
	}
}
