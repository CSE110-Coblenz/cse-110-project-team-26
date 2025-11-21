import { Question, Linear, Quadratic, AbsoluteValue } from "../../types";
import type { EquationAnswerFormat } from "../../types.ts";
import { LINEAR, ABSVAL, QUADRATIC } from "../../constants"

type parameter = number | null;

type Fraction = {
  numerator: parameter,
  denominator: parameter,
  positive: boolean
}

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    
    private question: GraphQuestion;
    private slope: Fraction;
    private intercept: parameter;
    private equation: string;
    private dialogue: string;
    private sprite: HTMLImageElement;
    private xMin: number;
    private yMax: number;

    constructor(xMin: number, yMax: number) {
        this.question = new GraphQuestion(LINEAR);
        this.slope = {
            numerator: null,
            denominator: null,
            positive: true
        };
        this.intercept = null;
        this.xMin = xMin;
        this.yMax = yMax;
        this.dialogue = "";
        this.equation = "y=(_/_)x+_";
        this.sprite = new Image();
    }
    
    reset(): void {
        this.question = new GraphQuestion(LINEAR);
        this.slope = {
            numerator: null,
            denominator: null,
            positive: true
        };
        this.intercept = null;
        this.equation = "y=(_/_)x+_";
    }

    getQuestionType(): string {
        return this.question.getQuestionType();
    }
    
    verifyAnswer(submission: EquationAnswerFormat) {
        this.question.enterSubmission(submission);
        this.question.verifyAnswer();
    }

    getParameters(): { slope: Fraction, intercept: parameter } {
        return {
            slope: this.slope,
            intercept: this.intercept
        }
    }

    setParameters(slope: Fraction, intercept: parameter): void {
        this.slope.numerator = slope.numerator;
        this.slope.denominator = slope.denominator;
        this.slope.positive = slope.positive;
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
