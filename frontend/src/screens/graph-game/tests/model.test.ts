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
        for (let i = 0; i < 10; i++) {
            const initialAnswer = model.getAnswer();
            model.reset();
            const type = model.getQuestionType();
            expect([LINEAR, QUADRATIC, ABSVAL]).toContain(type);
            expect(model.getAnswer()).toBeDefined();
            expect(model.getAnswer()).not.toBe(initialAnswer);
        }
    });

    describe("verifyAnswer", () => {
        const linearModel = new GraphScreenModel(0);
        const answer = linearModel.getAnswer();
        expect(linearModel.verifyAnswer(answer)).toBe(true);

        const incorrectLinear = new Linear(false);
        expect(linearModel.verifyAnswer(incorrectLinear)).toBe(false);

        const quadraticModel = new GraphScreenModel(1);
        const incorrectQuadratic = new Quadratic(false);
        expect(quadraticModel.verifyAnswer(incorrectAbsoluteValue)).toBe(false);

        const absoluteValueModel = new GraphScreenModel(2);
        const incorrectAbsoluteValue = new AbsoluteValue(false);
        expect(absoluteValueModel.verifyAnswer(incorrectAbsoluteValue)).toBe(false);
    });

    describe("dialogue", () => {
        const model = new GraphScreenModel(0);
        model.setDialogue("Hello World!");
        expect(model.getDialogue()).toEqual("Hello World!");

        model.setDialogue("");
        expect(model.getDialogue()).toEqual("");
    });

    describe("sprite", () => {
        const model = new GraphScreenModel(0);
        const mockImage = new Image();
        const newMockImage = new Image();

        model.setSprite(mockImage);
        expect(model.getSprite()).toEqual(mockImage);

        model.setSprite(newMockImage);
        expect(model.getSprite()).toEqual(newMockImage);
    })
});
