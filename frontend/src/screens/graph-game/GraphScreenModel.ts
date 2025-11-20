import { Question, Linear, Quadratic, AbsoluteValue, generateRandomNumber } from "../../types";
import type { EquationAnswerFormat } from "../../types.ts";
import { LINEAR, ABSVAL, QUADRATIC } from "../../constants"

type parameter = number | null;

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    
    private question: GraphQuestion;
    private dialogue: string;
    private sprite: HTMLImageElement;

    constructor(type: number) {
        this.question = new GraphQuestion(type);
    }
    
    reset(): void {
        this.question = new GraphQuestion(generateRandomNumber(0, 2));
    }

    getQuestionType(): string {
        return this.question.getQuestionType();
    }
    
    verifyAnswer(submission: EquationAnswerFormat) {
        this.question.enterSubmission(submission);
        this.question.verifyAnswer();
    }

    getAnswer(): EquationAnswerFormat {
        return this.question.getAnswer();
    }

    getDialogue(): string {
        return this.dialogue;
    }
    
    setDialogue(dialogue: string): void {
        this.dialogue = dialogue;
    }

    getSprite(): HTMLImageElement {
        return this.sprite;
    }

    setSprite(sprite: HTMLImageElement): void {
        this.sprite = sprite;
    }

    enterSubmission(submission: EquationAnswerFormat) {
        this.question.enterSubmission(submission);
    }
}

/**
 * Generate and store answer values for the Graphing Game
 */
class GraphQuestion extends Question {
    private questionType: string

    constructor(type: number) {
        super();

        switch (type) {
            case 0:
                this.questionType = LINEAR;
                this.answer = new Linear(true);
            break;
            case 1:
                this.questionType = QUADRATIC;
                this.answer = new Quadratic(true);
            break;
            case 2:
                this.questionType = ABSVAL;
                this.answer = new AbsoluteValue(true);
            break;
            default: 
                console.log("BAD TYPE INPUT");
        }
        console.log(67);
        console.log("Type: " + type);
    }

    getQuestionType(): string {
        return this.questionType;
    }

    getAnswer(): EquationAnswerFormat {
        return this.answer;
    }
}
