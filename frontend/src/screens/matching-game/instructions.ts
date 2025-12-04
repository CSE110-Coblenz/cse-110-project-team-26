import Konva from "konva";
import { STAGE_HEIGHT, STAGE_WIDTH } from "../../constants";
import "../../styles.css";

export function helpButtonGroup(x: number, y: number): Konva.Group {
        //help button
        const helpButtonGroup = new Konva.Group({
            x: x,
            y: y,
            listening: true
        });

        const helpButton = new Konva.Rect({
            width: 100,
            height: 40,
            fill: '#333333',
            stroke: '#ffffff',
            strokeWidth: 2,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOpacity: 0.5
        });

        const helpIcon = new Konva.Text({
            text: '?',               // or use "?" for a question mark button
            fontSize: 36,
            fontFamily: 'Arial',
            fontStyle: 'bold',
            fill: 'white',
            x: -25,
            y: 2,
            width: 150,
            align: 'center'
        });

        helpButtonGroup.add(helpButton);
        helpButtonGroup.add(helpIcon);

        // Hover effect (optional but nice)
        helpButtonGroup.on('mouseenter', () => helpButton.fill('#555555'));
        helpButtonGroup.on('mouseleave', () => helpButton.fill('#333333'));

        return helpButtonGroup;
}

export function instructionWindowGroup(type: string): Konva.Group {
    const instructionWindowGroup = new Konva.Group({
        x: STAGE_WIDTH / 2 - 300,   // center horizontally (600px width)
        y: STAGE_HEIGHT / 2 - 225,  // center vertically (450px height)
        visible: true,
        listening: true
    });
    const bg = new Konva.Rect({
        width: 600,
        height: 450,
        fill: '#000000',
        opacity: 0.65,               // 50%-80% transparency range → 0.5 to 0.8
        cornerRadius: 16,
        shadowColor: 'black',
        shadowBlur: 30,
        shadowOpacity: 0.7
    });
    instructionWindowGroup.add(bg);
    // Title
    const InstructionTitle = new Konva.Text({
        x: 20,
        y: 50,
        width: 600,
        text: 'Hello there, Captain!',
        fontSize: 34,
        fontFamily: 'medodica',
        fontStyle: 'bold',
        fill: 'white',
        align: 'center'
    });
    instructionWindowGroup.add(InstructionTitle);
    // Instruction lines
    let lines: string[] = [];
    switch (type) {
        case 'matching-game-instructions':
            lines = [
                '• The spacecraft took a big hit! The wiring is all messed up in the control panel. We need your help to fix it!',
                '• Match the components on the left with their correct positions on the right.',
                '• Left-click and drag to connect components with a wire.',
                '• Click Reset if you think you made a mistake.',
                '• Be careful - wrong matches will cause more damage to the ship!',
                '• GLHF. (╭☞ ͡° ͜ʖ ͡° )╭☞'
            ];
            break;
        case 'matching-game-win':
            lines = [
                '• Amazing work, Captain! The control panel is fully repaired thanks to you.',
                '• The spacecraft systems are back online and functioning perfectly.',
                '• Prepare for takeoff and get ready for the next adventure!',
            ];
            break;
        case 'maze-game-instructions':
            lines = [
                '• Your rocket is running out of fuel!',
                '• But don\'t worry - you can navigate through the cosmic maze to collect resources.',
                '• Choose the correct next step to simplify the given linear equation',
                '• After completely simplifying the equation, you can choose the correct value for x to collect fuel!',
                '• Be careful - you will lose your progress in the maze if you make a wrong choice!',
            ];
            break;
        default:
            break;
    }
    

    lines.forEach((line, i) => {
        const text = new Konva.Text({
            x: 60,
            y: 100 + i * 50,
            width: 480,
            text: line,
            fontSize: 18,
            fontFamily: 'medodica',
            fill: 'white',
            align: 'left'
        });
        instructionWindowGroup.add(text);
    });

    // Footer hint
    const footer = new Konva.Text({
        x: 0,
        y: 420,
        width: 600,
        text: 'Click here to close',
        fontSize: 18,
        fontFamily: 'medodica',
        fill: '#cccccc',
        align: 'center'
    });
    instructionWindowGroup.add(footer);

    return instructionWindowGroup;
}