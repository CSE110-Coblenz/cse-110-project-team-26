import { Question, EquationAnswerFormat, Linear, Quadratic, AbsoluteValue } from "../../types";
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
class GraphQuestion extends Question {
    private submission: EquationAnswerFormat | null;
    private answer: EquationAnswerFormat | null;

    constructor() {
        super();
        this.submission = null;
        this.answer = null;
    }

}