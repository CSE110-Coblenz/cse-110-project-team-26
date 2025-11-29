import { LinearEquation, EquationSolver } from "./screens/maze-game/maze-logic/LinearEquationLogic.ts";
import { compute } from "./constants.ts";
import type { Step, MathJson } from "./types.ts";

import { describe, it, expect } from "vitest";



describe("Equation Generation", () => {
    it("check if difficulty 1 equation exists", () => {
        const equation = new LinearEquation(1, compute);
        expect(equation).toBeDefined();
        const x = equation.getX();
        expect(x).toBeDefined();
        const y = equation.getY();
        expect(y).toBeDefined();
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 1 equation valid", () => {
        const equation = new LinearEquation(1, compute);
        expect(equation).toBeDefined();
        const x = equation.getX();
        const boxed = compute.box(equation.getEquation() as any);
        expect(boxed).toBeDefined();
        expect(boxed.subs({x: x}).evaluate().toString()).toBe("\"True\"");
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 1 equation contains LaTeX and MathJson", () => {
        const equation = new LinearEquation(1, compute);
        expect(typeof equation.getEquationLaTeX()).toBe("string");
        expect(typeof equation.getEquation()).toBe("object");
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 2 equation exists", () => {
        const equation = new LinearEquation(2, compute);
        expect(equation).toBeDefined();
        const x = equation.getX();
        expect(x).toBeDefined();
        const y = equation.getY();
        expect(y).toBeDefined();
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 2 equation valid", () => {
        const equation = new LinearEquation(2, compute);
        expect(equation).toBeDefined();
        const x = equation.getX();
        const boxed = compute.box(equation.getEquation() as any);
        expect(boxed).toBeDefined();
        expect(boxed.subs({x: x}).evaluate().toString()).toBe("\"True\"");
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 2 equation contains LaTeX and MathJson", () => {
        const equation = new LinearEquation(2, compute);
        expect(typeof equation.getEquationLaTeX()).toBe("string");
        expect(typeof equation.getEquation()).toBe("object");
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 3 equation exists", () => {
        const equation = new LinearEquation(3, compute);
        expect(equation).toBeDefined();
        const x = equation.getX();
        expect(x).toBeDefined();
        const y = equation.getY();
        expect(y).toBeDefined();
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 3 equation valid", () => {
        const equation = new LinearEquation(3, compute);
        expect(equation).toBeDefined();
        const x = equation.getX();
        const boxed = compute.box(equation.getEquation() as any);
        expect(boxed).toBeDefined();
        expect(boxed.subs({x: x}).evaluate().toString()).toBe("\"True\"");
    });
});

describe("Equation Generation", () => {
    it("check if difficulty 3 equation contains LaTeX and MathJson", () => {
        const equation = new LinearEquation(3, compute);
        expect(typeof equation.getEquationLaTeX()).toBe("string");
        expect(typeof equation.getEquation()).toBe("object");
    });
});

describe("Equation Solver", () => {
    it("check if solver provides valid steps for difficulty 1 equation", () => {
        const equation = new LinearEquation(1, compute);
        const solver = new EquationSolver(equation.getEquation(), compute);
        console.log("LOOK HERE FOR STEPS 1");
        expect(solver.steps.length).toBe(2);
        solver.steps.reverse();
        solver.steps.forEach((step) => {
            expect(step.result).not.toContain("~oo");
            expect(step.result).not.toContain("/");
            expect(step.result).not.toContain("^");
            expect(step.result).not.toContain("E");
            expect(step.result).not.toContain("Undefined");
            expect(step.result).not.toContain("Error");
            expect(step.result).not.toContain("NaN");
        });
    });
});

describe("Equation Solver", () => {
    it("check if solver provides valid steps for difficulty 2 equation", () => {
        const equation = new LinearEquation(2, compute);
        const solver = new EquationSolver(equation.getEquation(), compute);
        console.log("LOOK HERE FOR STEPS 2");
        console.log(solver.steps);
        expect(solver.steps.length).toBeGreaterThanOrEqual(2);
        expect(solver.steps.length).toBeLessThanOrEqual(4);
        solver.steps.reverse();
        solver.steps.forEach((step) => {
            expect(step.result).not.toContain("~oo");
            expect(step.result).not.toContain("/");
            expect(step.result).not.toContain("^");
            expect(step.result).not.toContain("E");
            expect(step.result).not.toContain("Undefined");
            expect(step.result).not.toContain("Error");
            expect(step.result).not.toContain("NaN");
        });
    });
});

describe("Equation Solver", () => {
    it("check if solver provides valid steps for difficulty 3 equation", () => {
        const equation = new LinearEquation(3, compute);
        const solver = new EquationSolver(equation.getEquation(), compute);
        console.log("LOOK HERE FOR STEPS 3");
        console.log(solver.steps);
        expect(solver.steps.length).toBeGreaterThanOrEqual(3);
        expect(solver.steps.length).toBeLessThanOrEqual(8);
        solver.steps.reverse();
        solver.steps.forEach((step) => {
            expect(step.result).not.toContain("~oo");
            expect(step.result).not.toContain("/");
            expect(step.result).not.toContain("^");
            expect(step.result).not.toContain("E");
            expect(step.result).not.toContain("Undefined");
            expect(step.result).not.toContain("Error");
            expect(step.result).not.toContain("NaN");
        });
    });
});

describe("Equation Solver", () => {
    it("check if solver works correctly for difficulty 1 equation", () => {
        const equation = ["Equal", ["Multiply", 3, "x"], 42] as MathJson;
        const solver = new EquationSolver(equation, compute);
        console.log("LOOK HERE FOR STEPS VALIDITY 1");
        console.log(solver.steps);        
        expect(solver.getStep().description).toBe("Divide,42,3");
        expect(solver.getStep().description).toBe("x = 14");
    });
});

describe("Equation Solver", () => {
    it("check if solver works correctly for difficulty 2 equation", () => {
        const equation = ['Equal', ['Add', 'x', ['Multiply', 6, 'x']], 105] as MathJson;
        const solver = new EquationSolver(equation, compute);
        console.log("LOOK HERE FOR STEPS VALIDITY 2");
        console.log(solver.steps);
        expect(solver.getStep().description).toBe("Add x, 6x");
        expect(solver.getStep().description).toBe("Divide,105,7");
        expect(solver.getStep().description).toBe("x = 15");
    });
});

describe("Equation Solver", () => {
    it("check if solver works correctly for difficulty 3 equation", () => {
        //"-14x-25=-277"
        const equation = ['Equal',['Add',[ 'Multiply', 3, 'x', ["Add", 4, -6] ],[ 'Multiply', -5, 'x' ],[ 'Multiply', -3, ['Add', 'x', 10] ],5],-277] as MathJson;
        const solver = new EquationSolver(equation, compute);
        console.log("LOOK HERE FOR STEPS VALIDITY 3"); 
        console.log(solver.steps);
        expect(solver.getStep().description).toBe("Add -6 + 4");
        expect(solver.getStep().description).toBe("Multiply -3 * 2 * x");
        expect(solver.getStep().description).toBe("Multiply -3(x + 10)");
        // Next step should be combining like terms
        expect(solver.getStep().description).toBe("Add -6x, -5x");
        expect(solver.getStep().description).toBe("Add -11x, -3x");
        expect(solver.getStep().description).toBe("Add -30,5");
        expect(solver.getStep().description).toBe("Subtract,25,277");
        expect(solver.getStep().description).toBe("Divide,-252,-14");
        expect(solver.getStep().description).toBe("x = 18");
    });
});