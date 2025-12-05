import Konva from "konva";
import type { View } from "../../types.ts";
import { STAGE_WIDTH, STAGE_HEIGHT } from "../../constants.ts";
import { ChoiceModel } from "./MazeModels.ts";
import { instructionWindowGroup } from "../matching-game/instructions.ts";

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
	private timerText: Konva.Text;
    private problemText: Konva.Image;
    private choiceOne : ChoiceView;
    private choiceTwo : ChoiceView;
    private choiceThree : ChoiceView;
    private bg: Konva.Image;
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
		this.bg = new Konva.Image({
			x: 0,
			y: 0,
			width: STAGE_WIDTH,
			height: STAGE_HEIGHT,
            image: (() => {
                const image = new Image();
                image.src = "/backgrounds/cave.png";
                return image;
            })()
		});
		this.group.add(this.bg);

        // Instruction window (hidden by default)
        const instructionWindow: Konva.Group = instructionWindowGroup("maze-game-instructions");
        instructionWindow.on('click tap', () => {
            instructionWindow.hide();
            this.group.getLayer()?.draw();
        });
        this.group.add(instructionWindow);
        instructionWindow.hide();

		// Help button (top-left)
        const helpButtonGroup = new Konva.Group({
            x: 20,
            y: 20,
        });

        const helpButton = new Konva.Sprite({
            x: -25,
            y: -25,
            image: (() => {
                const image = new Image();
                image.src = "/sprites/helpButton.png";
                return image;
            })(),
            animation: 'idle',
            animations: {
                idle: [
                    0, 0, 160, 160,
                ],
                highlighted: [
                    160, 0, 160, 160,
                ],
            },
            frameRate: 1,
            frameIndex: 0,
            scale: { x: 0.64, y: 0.64 },
        });
        
        const helpIcon = new Konva.Text({
            text: '?',               // or use "?" for a question mark button
            fontSize: 36,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: 'white',
            x: -50,
            y: 8,
            width: 150,
            align: 'center'
        });

        helpButtonGroup.add(helpButton);
        helpButtonGroup.add(helpIcon);

        // Hover effect (optional but nice)
        helpButtonGroup.on('mouseenter', () => helpButton.animation('highlighted'));
        helpButtonGroup.on('mouseleave', () => helpButton.animation('idle'));
        helpButtonGroup.on('click', () => {
            instructionWindow.show();
            instructionWindow.moveToTop();
            this.group.getLayer()?.draw();
            //need to pause the game timer here if implemented
        });
        this.group.add(helpButtonGroup);

		// Timer display (top-right)
		this.timerText = new Konva.Text({
			x: STAGE_WIDTH - 150,
			y: 20,
			text: "Time: 60",
			fontSize: 40,
			fontFamily: "medodica",
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
        image.src = "/sprites/mazegame.png";
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
        this.transitionScreen.moveToTop();
        this.transitionScreen.opacity(1);
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
    displayMessage(
        correctness : string,
        callBack?: () => void,
        explanation?: string,
        options?: { isLoading?: boolean; requireContinue?: boolean }
    ): () => void {
        const bg = new Konva.Image({
            x: 0,
            y: 0,
            width: STAGE_WIDTH,
            height: STAGE_HEIGHT,
            image: (() => {
                const image = new Image();
                image.src = "/backgrounds/backgroundMessage.png";
                return image;
            })()
        });
        
        const hasExplanation = Boolean(explanation);
        const message = new Konva.Text({
            x: 40,
            y: 40,
            align: "center",
            verticalAlign: "top",
            fontSize: hasExplanation ? 28 : 48,
            fontFamily: "medodica",
            fill: "white",
            width: STAGE_WIDTH - 80,
            height: STAGE_HEIGHT * 0.7,
            wrap: "word",
        }); 
        
        let baseMessage = "";
        switch (correctness){
            case "Correct":
                baseMessage = "Tunnel Choice Correct! \n Keep Moving Forward";
                break;
            case "Incorrect":
                baseMessage = "Tunnel Choice Incorrect \n Try another route from the beginning";
                break;
            case "Congrats": 
                baseMessage = "Congratulations!!! \n You escaped the Maze";
                break;
            case "Timeout":
                baseMessage = "You have run out of time! \n Try another route from the beginning";
                break;
        }

        if (options?.isLoading) {
            baseMessage = "Tunnel Choice Incorrect \n Generating explanation...";
        }

        if (hasExplanation) {
            baseMessage += `\n\nExplanation:\n${explanation}`;
        }
        message.text(baseMessage);

        let timeoutHandle: number | null = null;
        let dismissed = false;
        const cleanup = () => {
            if (dismissed) return;
            dismissed = true;
            if (timeoutHandle) clearTimeout(timeoutHandle);
            bg.destroy();
            message.destroy();
            continueButton?.destroy();
            continueText?.destroy();
            this.transitMovetoBottom();
            if(callBack) callBack();
        };

        setTimeout(()=>{ // Delays the message display to let fadeIn Animation finish
            this.group.add(bg);
            this.group.add(message);

        },100);

        let continueButton: Konva.Rect | null = null;
        let continueText: Konva.Text | null = null;
        if (options?.requireContinue) {
            continueButton = new Konva.Rect({
                x: STAGE_WIDTH / 2 - 100,
                y: STAGE_HEIGHT * 0.8,
                width: 200,
                height: 60,
                fill: "#333",
                cornerRadius: 10,
            });
            continueText = new Konva.Text({
                x: STAGE_WIDTH / 2 - 100,
                y: STAGE_HEIGHT * 0.8,
                width: 200,
                height: 60,
                text: "Continue",
                align: "center",
                verticalAlign: "middle",
                fill: "white",
                fontSize: 24,
                fontFamily: "Arial",
            });
            continueButton.on("click", cleanup);
            continueText.on("click", cleanup);
            this.group.add(continueButton, continueText);
        }

        if (!options?.requireContinue && !options?.isLoading) {
            bg.on('click', cleanup);
            timeoutHandle = window.setTimeout(()=>{
                cleanup();
                console.log("destroyed on time")
            },5000);
        } else if (options?.isLoading) {
            // loading overlay stays until cleanup is called programmatically
        } else {
            bg.on("click", cleanup);
        }

        return cleanup;
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
    hideComponents(): void {
        // remove choice groups from the scene
        this.choiceOne.getGroup().hide();
        this.choiceTwo.getGroup().hide();
        this.choiceThree.getGroup().hide();
        this.problemText.hide();
    }
    // Switch to win background
    switchToWinBackground(): Promise<void> {
        const img = new Image();
        img.src = "/backgrounds/caveWin.png";
        return new Promise<void>((resolve) => {
            img.onload = () => {
                this.bg.image(img);
                this.bg.getLayer()?.draw();
                resolve();
            }
        });;
    }
    // Animation when winning
    playWinAnimation(): Promise<void> {
        return this.movePlayerTo(STAGE_WIDTH / 2 - 50, STAGE_HEIGHT / 2+100)
            .then(() => {
                this.setAnimation("win");
                return new Promise<void>(resolve => {
                    setTimeout(resolve, 4000); // length of win animation
                });
            });
    }
    // reset view to initial state
    reset(): void {
        this.resetPlayerPosition();
        this.setAnimation("idle");
        this.choiceOne.getGroup().show();
        this.choiceTwo.getGroup().show();
        this.choiceThree.getGroup().show();
        this.problemText.show();
    }
	/**
	 * Show the screen
	 */
	show(): void {
        this.transitionScreen.moveToTop();
        this.transitionScreen.opacity(1);
        this.group.visible(true);
        this.group.getLayer()?.draw();
        this.fadeFromBlack();  
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
