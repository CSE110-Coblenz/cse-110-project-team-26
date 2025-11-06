import type { Question, EquationAnswerFormat, Linear, Quadratic, AbsoluteValue } from "../../types";
import { LINEAR, ABSVAL, QUADRATIC } from "../../constants"

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    private question: GraphQuestion;

    constructor() {
        this.question = new GraphQuestion();
    }

    verifyAnswer(submission: EquationAnswerFormat) {
        this.question.enterSubmission(submission);
        this.question.verifyAnswer();
    }
}

/**
 * Generate and store answer values for the Graphing Game
 */
class GraphQuestion implements Question {
    private questionType: string;
    private answer: EquationAnswerFormat | null;
    private submission: EquationAnswerFormat | null;

    constructor() {
        this.questionType = "";
        this.answer = null;
        this.submission = null;
    }

    generateAnswerValues(): void {

    }

    enterSubmission(submission: EquationAnswerFormat) {
        this.submission = submission;
    }

    verifyAnswer(): boolean {
        return false;
    }
}