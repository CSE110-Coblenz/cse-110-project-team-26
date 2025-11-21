import { Question, Linear, Quadratic, AbsoluteValue } from "../../types";
import type { EquationAnswerFormat } from "../../types.ts";
import { LINEAR, ABSVAL, QUADRATIC } from "../../constants"

type parameter = number | null;

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    
    private question: GraphQuestion;
    private slope: parameter;
    private intercept: parameter;
    private dialogue: string;
    private sprite: HTMLImageElement;

    constructor() {
        this.question = new GraphQuestion(LINEAR);
        this.slope = null;
        this.intercept = null;
        this.dialogue = "";
        this.sprite = new Image();
    }
    
    reset(): void {
        this.question = new GraphQuestion(LINEAR);
        this.slope = null;
        this.intercept = null;
    }

    getQuestionType(): string {
        return this.question.getQuestionType();
    }
    
    verifyAnswer(submission: EquationAnswerFormat): boolean {
        this.question.enterSubmission(submission);
        return this.question.verifyAnswer();
    }

    getParameters(): { slope: parameter, intercept: parameter } {
        return {
            slope: this.slope,
            intercept: this.intercept
        }
    }

    setParameters(slope: parameter, intercept: parameter): void {
        this.slope = slope;
        this.intercept = intercept;
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
}

/**
 * Generate and store answer values for the Graphing Game
 */
class GraphQuestion extends Question {
    private questionType: string

    constructor(type: string) {
        super();
        this.questionType = type;

        switch (type) {
            case LINEAR:
                this.answer = new Linear();
            break;
            case QUADRATIC:
                this.answer = new Quadratic();
            break;
            case ABSVAL:
                this.answer = new AbsoluteValue();
            break;
            default: 
                console.log("BAD TYPE INPUT");
        }
    }

    getQuestionType(): string {
        return this.questionType;
    }

}
