import type { Question } from "../../types";

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

    constructor() {
        this.questionType = "";
    }

    generateAnswerValues(): void {

    }

    verifyAnswer(): boolean {
        return true;
    }
}