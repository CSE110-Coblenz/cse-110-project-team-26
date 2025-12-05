import { compute } from "../../constants.ts";
import type { Step } from "../../types";
import type { StatsCategory } from "../statistics/StatisticsScreenModel.ts";
import { LinearEquation, EquationSolver } from "./maze-logic/LinearEquationLogic";

type MazeExplanationPayload = {
    latex: string[];
    givenAnswer: string[];
    correctAnswer: string[];
};

/**
 * GameScreenModel - Manages game state
 */
export class MazeScreenModel {
	private score = 0;
    private timeRemaining = 60;
	private readonly statsCategory: StatsCategory = "Multi-Step Algebraic Equations";
	/**
	 * Reset game state for a new game
	 */
	reset(): void {
		this.score = 0;
	}

	incrementScore(): void {
		this.score++;
	}

	getScore(): number {
		return this.score;
	}

    gettimeRemaining(): number {
        return this.timeRemaining;
    }

    async fetchExplanation(
        problem: ProblemModel | null,
        selectedChoice: ChoiceModel,
    ): Promise<string | null> {
        if (!problem) {
            return "No problem context available for explanation.";
        }

        const payload: MazeExplanationPayload = problem.getExplanationPayload(
            selectedChoice.getText(),
        );

        try {
            const res = await fetch("http://localhost:4000/game/maze/mazeHandleProblem", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = (await res.json().catch(() => null)) as
                    | { error?: string }
                    | null;
                return data?.error ?? `Failed to fetch explanation (${res.status}).`;
            }

            const data = (await res.json()) as { explanation?: string };
            return data.explanation ?? "No explanation returned.";
        } catch (error) {
            console.error("Maze explanation fetch error:", error);
            return "Network error while fetching explanation.";
        }
    }

	async recordAttempt(isCorrect: boolean): Promise<boolean> {
		const token = localStorage.getItem("authToken");
		if (!token) {
			console.warn("No auth token found; skipping stats update.");
			return false;
		}

		try {
			const res = await fetch("http://localhost:4000/auth/stats/attempt", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({
					category: this.statsCategory,
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
 * ProblemModel - Represents a math problem in the maze game
 */
export class ProblemModel {
    private problemStatement: string
    private linearEquation: LinearEquation
    private choices: ChoiceModel[] = [];
    private solver: EquationSolver
    private currentStep: Step | null = null;

    constructor(difficultyLevel: number) {
        this.linearEquation = new LinearEquation(difficultyLevel, compute);
        this.problemStatement = this.linearEquation.getEquationLaTeX();
        this.solver = new EquationSolver(this.linearEquation.getEquation(), compute);
        console.log("Steps to solve the equation:");
        console.log(JSON.parse(JSON.stringify(this.solver.steps)));
        const firstStep = this.solver.getStep();
        console.log(firstStep);
        this.currentStep = firstStep;
        this.generateChoices(firstStep);
        console.log("Generated Problem: ", this.problemStatement);
        }
    // Need logic to see when it is the last step
    private generateChoices(correctChoice: Step, isLastStep: boolean = false) {
        var newDescription= this.editDescription(correctChoice.description);
        this.choices.push(new ChoiceModel(newDescription, true));

        const operations = ["Add", "Divide", "Subtract", "Multiply"] as const;
        let randomNumber1: number;
        let randomNumber2: number;
        if (!isLastStep) {
            // Second choice
            for(let i = 0; i < 2; i++){
                let randomOperation = operations[Math.floor(Math.random() * operations.length)];
                randomNumber1 = Math.floor(Math.random() * 10) + 1;
                randomNumber2 = Math.floor(Math.random() * 10) + 1;
                if(randomOperation == "Divide" || randomOperation == "Subtract"){
                    var randChoiceDescription = this.editDescription(randomOperation.toString() + "," + randomNumber1.toString() + "," + randomNumber2.toString());
                }
                else{
                    var randChoiceDescription = this.editDescription(randomOperation.toString() + " " +randomNumber1.toString() + "," + randomNumber2.toString());
                }
                this.choices.push(new ChoiceModel(randChoiceDescription, false));
            }
        } else { 
            // NEED TO MAKE SURE INCORRECT CHOICES ARE NOT THE SOLUTION
            randomNumber1 = Math.floor(Math.random() * 10) + 1;
            this.choices.push(new ChoiceModel(`x = ${randomNumber1}`, false));
            randomNumber2 = Math.floor(Math.random() * 10) + 1;
            this.choices.push(new ChoiceModel(`x = ${randomNumber2}`, false));
        }
        this.shuffleChoices();
    }
    private editDescription(description: string){ //Make text options more readable PS: Remind me to do switch cases 
        var operation = description[0];
        if(operation == "A" && description.includes(",") && description.includes("x")){
            description = description.replace(","," and ");
            return description;
        }
        else if(operation == "A" && description.includes(",")){
            description = description.replace(","," and ");
            return description;
        }
        else if(operation == "S"){
            var tempArr = description.split(",");
            description = "Subtract " + tempArr[1] + " from " + tempArr[2];
            return description;
        }
        else if(operation == "D"){
            var tempArr = description.split(",");
            description = "Divide " + tempArr[1] + " by " + tempArr[2];
            return description;
        }
        else if(operation == "M"){
            description = description.replace(","," and ");
            return description;
        }
        else{
            return description;
        }
    }
    // Shuffle choices to randomize their order
    private shuffleChoices() {
        for (let i = this.choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.choices[i], this.choices[j]] = [this.choices[j], this.choices[i]];
        }
    }
    // Set the problem statement based on the current step
    private setProblemStatement(statement: string) {
        this.problemStatement = statement;
    }
    // Need to return problem with the next step applied rather than the original problem
    // Also Konva does not support LaTeX rendering directly, so we need to convert LaTeX to an image
    public getProblemStatement(): string {
        return this.problemStatement;
    }
    // Return the current choices
    public getChoices(): ChoiceModel[] {
        return this.choices;
    }
    // Clear current choices and generate new ones based on the next step
    public nextMove(): boolean {
        this.choices = [];
        if (this.solver.getStepsCount() === 0) {
            return false;
        }
        const newStep = this.solver.getStep(); // advance to next step
        console.log("Next Step: ", newStep);
        this.currentStep = newStep;
        this.generateChoices(newStep, this.solver.getStepsCount() === 0? true : false);
        this.setProblemStatement(newStep.current);
        return true;
    }

    public getExplanationPayload(selectedChoice: string): MazeExplanationPayload {
        return {
            latex: [this.problemStatement],
            givenAnswer: [selectedChoice],
            correctAnswer: [
                this.currentStep?.description ?? "No correct step available.",
            ],
        };
    }
}
/**
 * ChoiceModel - Represents a choice for solving the problem
 */
export class ChoiceModel {
    private text: string;
    private isCorrect: boolean;

    constructor(text: string, isCorrect: boolean) {
        this.text = text;
        this.isCorrect = isCorrect;
    }

    getText(): string {
        return this.text;
    }

    getIsCorrect(): boolean {
        return this.isCorrect;
    }
}
