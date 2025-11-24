import { it, expect, describe, vi } from "vitest";
import { Question, Linear, Quadratic, AbsoluteValue, generateRandomNumber } from "../../../types";
import { LINEAR, ABSVAL, QUADRATIC } from "../../../constants"

describe("generateRandomNumber", () => {
    const max = 100;

    it("should return values within the range", () => {
        for(let i = 0; i < max; i++) {
            const result = generateRandomNumber(i, max);
            expect(result).toBeGreaterThanOrEqual(i);
            expect(result).toBeLessThanOrEqual(max);
        }
    });

    it("should return values within the range, and catch bad inputs", () => {
        const spy = vi.spyOn(console, "log").mockImplementation(() => {});
        for(let i = max; i > 0; i--) {
            const result = generateRandomNumber(i, max);
            expect(result).toBeGreaterThanOrEqual(i);
            expect(result).toBeLessThanOrEqual(max);
            expect(spy).toHaveBeenCalled();
        }
    });
});

describe("linear question", () => {
    it("should not have values if it isn't the answer", () => {
        const question = new Linear(false);
        expect(question.coefficient.numerator).toBeNull();
        expect(question.coefficient.denominator).toBeNull();
        expect(question.intercept).toBeNull();
    });

    it("generateAnswerValues should update fields", () => {
        const question = new Linear(false);
        question.generateAnswerValues();
        expect(question.coefficient.numerator).toBeTypeOf("number");
        expect(question.coefficient.denominator).toBeTypeOf("number");
        expect(question.intercept).toBeTypeOf("number");
    });

    it("verifyAnswer should verify answer", () => {
        const question = new Linear(false);
        question.setNumerator(1);
        question.setDenominator(1);
        question.setIntercept(1);
        
        const incorrectNumerator = new Linear(false);
        incorrectNumerator.setNumerator(2);
        incorrectNumerator.setDenominator(1);
        incorrectNumerator.setIntercept(1);

        const incorrectDenominator = new Linear(false);
        incorrectDenominator.setNumerator(1);
        incorrectDenominator.setDenominator(2);
        incorrectDenominator.setIntercept(1);

        const incorrectIntercept = new Linear(false);
        incorrectIntercept.setNumerator(1);
        incorrectIntercept.setDenominator(1);
        incorrectIntercept.setIntercept(2);

        const correct = new Linear(false);
        correct.setNumerator(1);
        correct.setDenominator(1);
        correct.setIntercept(1);

        expect(question.verifyAnswer(incorrectNumerator)).toBe(false);
        expect(question.verifyAnswer(incorrectDenominator)).toBe(false);
        expect(question.verifyAnswer(incorrectIntercept)).toBe(false);
        expect(question.verifyAnswer(correct)).toBe(true);
    });

    it("checkCompleteSubmission should check submission", () => {
        const complete = new Linear(false);
        complete.setNumerator(1);
        complete.setDenominator(1);
        complete.setIntercept(1);
        
        const noNumerator = new Linear(false);
        noNumerator.setDenominator(1);
        noNumerator.setIntercept(1);

        const noDenominator = new Linear(false);
        noDenominator.setNumerator(1);
        noDenominator.setIntercept(1);

        const noIntercept = new Linear(false);
        noIntercept.setNumerator(1);
        noIntercept.setDenominator(1);

        expect(complete.checkCompleteSubmission()).toBe(true);
        expect(noNumerator.checkCompleteSubmission()).toBe(false);
        expect(noDenominator.checkCompleteSubmission()).toBe(false);
        expect(noIntercept.checkCompleteSubmission()).toBe(false);
    });
});


describe("quadratic question", () => {
    it("should not have values if it isn't the answer", () => {
        const question = new Quadratic(false);
        expect(question.root1).toBeNull();
        expect(question.root2).toBeNull();
    });

    it("generateAnswerValues should update fields", () => {
        const question = new Quadratic(false);
        question.generateAnswerValues();
        expect(question.root1).toBeTypeOf("number");
        expect(question.root2).toBeTypeOf("number");
    });

    it("verifyAnswer should verify answer", () => {
        const question = new Quadratic(false);
        question.setRoot1(1);
        question.setRoot2(2);
        
        const incorrectRoot1 = new Quadratic(false);
        incorrectRoot1.setRoot1(2);
        incorrectRoot1.setRoot2(2);

        const incorrectRoot2 = new Quadratic(false);
        incorrectRoot2.setRoot1(1);
        incorrectRoot2.setRoot2(1);

        const correct = new Quadratic(false);
        correct.setRoot1(1);
        correct.setRoot2(2);

        expect(question.verifyAnswer(incorrectRoot1)).toBe(false);
        expect(question.verifyAnswer(incorrectRoot2)).toBe(false);
        expect(question.verifyAnswer(correct)).toBe(true);
    });

    it("checkCompleteSubmission should check submission", () => {
        const complete = new Quadratic(false);
        complete.setRoot1(1);
        complete.setRoot2(1);
        
        const noRoot2 = new Quadratic(false);
        noRoot2.setRoot1(1);

        const noRoot1 = new Quadratic(false);
        noRoot1.setRoot2(1);

        expect(complete.checkCompleteSubmission()).toBe(true);
        expect(noRoot1.checkCompleteSubmission()).toBe(false);
        expect(noRoot2.checkCompleteSubmission()).toBe(false);
    });
});
