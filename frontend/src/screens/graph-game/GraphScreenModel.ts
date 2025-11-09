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

    constructor(stage: number) {
        super();
        switch(stage) {
            case 0:
                this.submission = new Linear();
            break;
            case 1:
                this.submission = new AbsoluteValue();
            break;
            case 2:
                this.submission = new Quadratic();
            break;
            default:
                console.log("BAD STAGE INPUT");
        }
    }

}