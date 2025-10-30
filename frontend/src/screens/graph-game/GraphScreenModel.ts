import type { Question, EquationAnswerFormat } from "../../types";

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    private question: GraphQuestion;

    constructor() {
        this.question = new GraphQuestion();
    }
}

/**
 * Generate and store answer values for the Graphing Game
 */
class GraphQuestion implements Question {
    private questionType: string;
    private answer: EquationAnswerFormat;
    private submission: EquationAnswerFormat;

    constructor() {
        this.questionType = "";
        this.answer = null;
        this.submission = null;
    }

    generateAnswerValues(): void {

    }

    verifyAnswer(): boolean {
        return true;
    }
}