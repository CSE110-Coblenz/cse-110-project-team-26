import { it, expect, describe, vi } from "vitest";
import { Question, Linear, Quadratic, AbsoluteValue, generateRandomNumber } from "../../../types";
import type { EquationAnswerFormat } from "../../../types.ts";
import { LINEAR, ABSVAL, QUADRATIC } from "../../../constants"
import { GraphScreenModel } from "../GraphScreenModel";

describe("generateRandomNumber", () => {
    it("should return values within the range", () => {
        const max = 100;
        for(let i = 0; i < max; i++) {
            const result = generateRandomNumber(i, max);
            expect(result).toBeGreaterThanOrEqual(i);
            expect(result).toBeLessThanOrEqual(max);
        }
    });

    it("should return values within the range, and catch bad inputs", () => {
        const max = 100;
        const spy = vi.spyOn(console, "log").mockImplementation(() => {});
        for(let i = max; i > 0; i--) {
            const result = generateRandomNumber(i, max);
            expect(result).toBeGreaterThanOrEqual(i);
            expect(result).toBeLessThanOrEqual(max);
            expect(spy).toHaveBeenCalled();
        }
    });
});


