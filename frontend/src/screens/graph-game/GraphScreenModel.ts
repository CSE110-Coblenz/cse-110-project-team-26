import { Question, EquationAnswerFormat, Linear, Quadratic, AbsoluteValue } from "../../types";
import { LINEAR, ABSVAL, QUADRATIC } from "../../constants"

/**
 * Model for the Graphing Game Module
 */
export class GraphScreenModel {
    private question: GraphQuestion;
    private stage: number;

    constructor() {
        this.stage = 0;
        this.question = new GraphQuestion(this.stage);
    }

    verifyAnswer(submission: EquationAnswerFormat): boolean { 
        this.question.enterSubmission(submission); 
        return this.question.verifyAnswer(); 
    } 

    // FOR PLOTTING PURPOSES
    getQuestion(): GraphQuestion {
        return this.question;
    }
}

/**
 * Generate and store answer values for the Graphing Game
 */
class GraphQuestion extends Question {
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
