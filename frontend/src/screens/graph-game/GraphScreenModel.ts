import { Question, Linear, Quadratic, AbsoluteValue, generateRandomNumber } from "../../types";
import type { EquationAnswerFormat } from "../../types.ts";
import type { StatsCategory } from "../statistics/StatisticsScreenModel.ts";
import { LINEAR, ABSVAL, QUADRATIC } from "../../constants"

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    
    private question: GraphQuestion;
    private dialogue: string;
    private sprite: HTMLImageElement;
    private xMin: number;
    private yMax: number;

    constructor(type: number) {
        this.question = new GraphQuestion(type);
    }
    
    reset(): void {
        this.question = new GraphQuestion(generateRandomNumber(0, 2));
    }

    getQuestionType(): string {
        return this.question.getQuestionType();
    }
    
    verifyAnswer(submission: EquationAnswerFormat): boolean {
        this.question.enterSubmission(submission);
        return this.question.verifyAnswer();
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

    private getStatsCategory(questionType: string): StatsCategory {
        switch (questionType) {
            case LINEAR:
                return "Drawing Linear Equations";
            case QUADRATIC:
                return "Drawing Quadratic Equations";
            case ABSVAL:
                return "Drawing Absolute Value Equations";
            default:
                console.warn(`Unknown graph question type '${questionType}', defaulting stats to Drawing Linear Equations.`);
                return "Drawing Linear Equations";
        }
    }

    async recordAttempt(isCorrect: boolean, questionType: string): Promise<boolean> {
        const token = localStorage.getItem("authToken");
        if (!token) {
            console.warn("No auth token found; skipping stats update.");
            return false;
        }

        const category = this.getStatsCategory(questionType);

        try {
            const res = await fetch("http://localhost:4000/auth/stats/attempt", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    category,
                    isCorrect,
                }),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as
                    | { error?: string }
                    | null;
                console.error("Failed to update stats:", data?.error ?? res.statusText);
                return false;
            }

            return true;
        } catch (error) {
            console.error("Stats update error:", error);
            return false;
        }
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
        console.log("Type: " + type);
    }

    getQuestionType(): string {
        return this.questionType;
    }

    getAnswer(): EquationAnswerFormat {
        return this.answer;
    }
}
