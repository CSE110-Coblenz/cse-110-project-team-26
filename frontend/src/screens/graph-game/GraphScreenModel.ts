import { Question, Linear, Quadratic, AbsoluteValue } from "../../types";
import type { EquationAnswerFormat } from "../../types.ts";
import { LINEAR, ABSVAL, QUADRATIC } from "../../constants"

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    private question: GraphQuestion;

    constructor() {
        this.question = new GraphQuestion(LINEAR);
    }
    verifyAnswer(submission: EquationAnswerFormat) {
        this.question.enterSubmission(submission);
        this.question.verifyAnswer();
    }
}

/**
 * Generate and store answer values for the Graphing Game
 */
class GraphQuestion extends Question {
    private questionType: string;

    constructor(type: string) {
        super();
        this.questionType = type;
    }

    generateAnswerValues(): void {

    }

    verifyAnswer(): boolean {
        return false;
    }
}
