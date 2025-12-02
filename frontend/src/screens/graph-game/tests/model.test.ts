import { describe, it, expect, beforeEach } from "vitest";
import { GraphScreenModel } from "../GraphScreenModel";
import { LINEAR, ABSVAL, QUADRATIC } from "../../../constants";
import { Linear, AbsoluteValue, Quadratic } from "../../../types";
import type { EquationAnswerFormat } from "../../../types";

describe("model", () => {
    describe("constructor", () => {
        it("should handle linear questions", () => {
            const model = new GraphScreenModel(0);
            expect(model.getQuestionType()).toBe(LINEAR);
        });
        it("should handle quadratic questions", () => {
            const model = new GraphScreenModel(1);
            expect(model.getQuestionType()).toBe(QUADRATIC);
        });
        it("should handle absolute value questions", () => {
            const model = new GraphScreenModel(2);
            expect(model.getQuestionType()).toBe(ABSVAL);
        });
    });

    describe("reset", () => {
        const model = new GraphScreenModel(0);
        it("should clear out answer values", () => {
            for (let i = 0; i < 10; i++) {
                const initialAnswer = model.getAnswer();
                model.reset();
                const type = model.getQuestionType();
                expect([LINEAR, QUADRATIC, ABSVAL]).toContain(type);
                expect(model.getAnswer()).toBeDefined();
                expect(model.getAnswer()).not.toBe(initialAnswer);
            }
        })
        
    });

    describe("verifyAnswer", () => {
        const linearModel = new GraphScreenModel(0);
        const linearAnswer = linearModel.getAnswer();
        it("should correctly determine correct answers: linear", () => {
            expect(linearModel.verifyAnswer(linearAnswer)).toBe(true);
        })

        const incorrectLinear = new Linear(false);
        it("should correctly determine wrong answers: linear", () => {
            expect(linearModel.verifyAnswer(incorrectLinear)).toBe(false);
        })

        const quadraticModel = new GraphScreenModel(1);
        const quadraticAnswer = quadraticModel.getAnswer();
        const incorrectQuadratic = new Quadratic(false);
        it("should correctly determine correct answers: quadratic", () => {
            expect(quadraticModel.verifyAnswer(quadraticAnswer)).toBe(true);
        })
        it("should correctly determine wrong answers: quadratic", () => {
            expect(quadraticModel.verifyAnswer(incorrectQuadratic)).toBe(false);
        })

        const absoluteValueModel = new GraphScreenModel(2);
        const absoluteValueAnswer = absoluteValueModel.getAnswer();
        const incorrectAbsoluteValue = new AbsoluteValue(false);
        it("should correctly determine correct answers: absval", () => {
            expect(absoluteValueModel.verifyAnswer(absoluteValueAnswer)).toBe(true);
        })
        it("should correctly determine wrong answers: absval", () => {
            expect(absoluteValueModel.verifyAnswer(incorrectAbsoluteValue)).toBe(false);
        })
    });

    describe("dialogue", () => {
        const model = new GraphScreenModel(0);
        it("should correctly set dialogue", () => {
            model.setDialogue("Hello World!");
            expect(model.getDialogue()).toEqual("Hello World!");

            model.setDialogue("");
            expect(model.getDialogue()).toEqual("");
        })
    });

});
