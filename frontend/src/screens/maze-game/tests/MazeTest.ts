import { describe, it, expect, beforeEach, vi } from "vitest";
import { LinearEquation, EquationSolver } from "../maze-logic/LinearEquationLogic";
import type { MathJson, Step } from "../../../types";


class MockExpr {
  mathjson: MathJson;
  constructor(mathjson: MathJson) {
    this.mathjson = mathjson;
  }

  toMathJson(): MathJson {
    return this.mathjson;
  }

  // simulate substitution: only supports expressions of the form ['Multiply', a, 'x'] or ['Symbol','x']
  subs(bindings: { x: number }) {
    const xVal = bindings.x;
    const self = this;
    return {
      evaluate() {
        // produce a QE-like object with toString
        const mj = self.mathjson;
        if (Array.isArray(mj)) {
          const head = mj[0];
          if (head === "Multiply") {
            const a = mj[1];
            // assume form ['Multiply', number, 'x']
            const val = Number(a) * Number(xVal);
            return { toString: () => String(val) };
          } else if (head === "Add") {
            // assume binary Add with term and constant ex: ['Add', ['Multiply',2,'x'], 4]
            const term = mj[1];
            const constant = mj[2];
            const termVal = (Array.isArray(term) && term[0] === "Multiply") ? Number(term[1]) * Number(xVal) : 0;
            const val = termVal + Number(constant);
            return { toString: () => String(val) };
          }
        }
        // fallback: if mathjson is just 'x'
        if (mj === "x") return { toString: () => String(xVal) };
        return { toString: () => "0" };
      }
    };
  }

  toString() {
    // Simple stringification for a small subset of MathJson types
    const mj = this.mathjson;
    if (!Array.isArray(mj)) return String(mj);
    const head = mj[0];
    if (head === "Multiply") {
      return `${mj[1]}*${mj[2]}`;
    }
    if (head === "Add") {
      const left = Array.isArray(mj[1]) ? `${mj[1][1]}*${mj[1][2]}` : mj[1];
      return `${left} + ${mj[2]}`;
    }
    return JSON.stringify(mj);
  }
}

class MockBox {
  mathjson: MathJson;
  constructor(mathjson: MathJson) {
    this.mathjson = mathjson;
  }

  // return the MathJson back
  toMathJson(): MathJson {
    return this.mathjson;
  }
  // a simple toString representation
  toString(): string {
    if (!Array.isArray(this.mathjson)) return String(this.mathjson);
    const head = this.mathjson[0];
    if (head === "Equal") {
      return `${new MockBox(this.mathjson[1]).toString()} = ${new MockBox(this.mathjson[2]).toString()}`;
    }
    if (head === "Add") {
      return `${new MockBox(this.mathjson[1]).toString()} + ${this.mathjson[2]}`;
    }
    if (head === "Multiply") {
      return `${this.mathjson[1]}*${this.mathjson[2]}`;
    }
    return JSON.stringify(this.mathjson);
  }

  toLatex(): string {
    // return a simple latex-ish string for testing use
    return `\\mathrm{${this.toString()}}`;
  }

  simplify() {
    // For tests simply return this (no-op)
    return this;
  }

  evaluate() {
    // Return an object with toMathJson in contexts where evaluate is used in original code
    return this;
  }
}

class MockComputeEngine {
  // parse a small subset of strings into simple MathJson forms
  parse(s: string, opts?: any): MockExpr {
    s = s.trim();
    // handle forms we generate in tests like "2*x" or "(2*x)/3"
    // handle simple "2*x", "x", "2*x + 4" (no spaces guaranteed)
    // prioritize detection for Multiply pattern
    // remove surrounding parentheses for simplicity
    if (s.startsWith("(") && s.endsWith(")")) {
      s = s.slice(1, -1);
    }

    // 2*x
    const mulMatch = s.match(/^(\d+)\s*\*\s*x$/);
    if (mulMatch) {
      return new MockExpr(["Multiply", Number(mulMatch[1]), "x"]);
    }

    // simple add pattern like "2*x+4" or "2*x + 4"
    const addMatch = s.match(/^(\d+)\s*\*\s*x\s*\+\s*(\d+)$/);
    if (addMatch) {
      return new MockExpr(["Add", ["Multiply", Number(addMatch[1]), "x"], Number(addMatch[2])]);
    }

    // If it's just 'x'
    if (s === "x") return new MockExpr("x");

    // fallback: try to parse number only
    const numMatch = s.match(/^(-?\d+)$/);
    if (numMatch) return new MockExpr(Number(numMatch[1]) as MathJson);

    // If unable to parse, return an "error-like" object (but keep shape)
    return new MockExpr(["Multiply", 0, "x"]);
  }

  // box simply wraps a MathJson in MockBox
  box(mj: any, opts?: any) {
    // If mj is already a MockBox or MockExpr, adapt
    if (mj instanceof MockBox) return mj as any;
    if (mj instanceof MockExpr) return new MockBox(mj.toMathJson());
    // if it's a string representation, attempt to parse it
    if (typeof mj === "string") {
      // try parse the string back to mathjson then box it
      return new MockBox(this.parse(mj).toMathJson());
    }
    return new MockBox(mj);
  }

  // A "_reset" method is referenced in the code; make it a no-op
  _reset() {
    // no-op for tests
  }
}

/**
 * Helper to temporarily stub RandomUtils used in the module under test.
 * The module under test uses RandomUtils.getInt/getOp/yesNo statically, so we
 * stub them on the global object where module imported them from.
 *
 * Because the module imports RandomUtils internally, vitest's module isolation
 * may require we import the module after stubbing; but for simplicity here we
 * directly monkeypatch the RandomUtils on the module global after importing.
 */

/*
 Note:
 - Update the import path above to point to your module.
 - If your module imports RandomUtils internally (local class), the test file
   modifies the RandomUtils class on runtime since classes are reference types.
 */

describe("LinearEquation and EquationSolver (with MockComputeEngine)", () => {
  let ce: MockComputeEngine;

  beforeEach(() => {
    ce = new MockComputeEngine();

    // reset random stubs
    // the module's RandomUtils is a class defined in the source file; we can override its static methods:
    // We import the module dynamically to make sure these overrides apply before usage in constructors
    // But because the module under test defines RandomUtils internally, we patch global Math.random where appropriate.
    // For deterministic behavior we'll stub Math.random in tests that need it.
  });

  it("LinearEquation generates an 'Equal' MathJson and sets X and Y correctly (deterministic stub)", () => {
    // Make Math.random deterministic for this test:
    // Sequence of calls to RandomUtils.getInt/getOp/yesNo occurs in constructor:
    // - LinearEquation sets this.x = RandomUtils.getInt(1,20);
    // - generateLinearEquation -> EquationBuilder.simpleTerm() -> RandomUtils.getInt(1,10)
    // We'll force Math.random so getInt returns predictable numbers.

    // Stub Math.random to always return 0.1 so getInt(min,max) will produce min + floor(0.1*(max-min+1))
    const mathRandomSpy = vi.spyOn(Math, "random").mockReturnValue(0.1);

    const le = new LinearEquation(1, ce as unknown as any);

    // restore Math.random
    mathRandomSpy.mockRestore();

    // Expect the equation to be an Array with 'Equal', lhs, rhs
    // restore Math global
    vi.unstubAllGlobals();
    expect(eq[0]).toBe("Equal");
    // getX should be >= 1 and getY should be a string
    expect(typeof le.getX()).toBe("number");
    expect(typeof le.getY()).toBe("string");
    // For our deterministic stub, the LHS should be a Multiply form because simpleTerm -> a* x
    const lhs = eq[1];
    expect(Array.isArray(lhs)).toBe(true);
    expect(lhs[0]).toBe("Multiply");
    // rhs should equal le.getY() (string)
    expect(String(eq[2])).toBe(le.getY());
  });

  it("EquationSolver throws on invalid equation format", () => {
    // pass something that isn't ['Equal', lhs, rhs]
    expect(() => new EquationSolver("not an array" as unknown as MathJson, ce as unknown as any)).toThrow();
    expect(() => new EquationSolver(["NotEqual"] as unknown as MathJson, ce as unknown as any)).toThrow();
  });

  it("EquationSolver can process a simple equation and produce steps", () => {
    // Create a simple equation 2*x + 4 = 10 expressed as MathJson:
    const equation: MathJson = ["Equal", ["Add", ["Multiply", 2, "x"], 4], 10];

    // Construct solver with our mock CE
    const solver = new EquationSolver(equation, ce as unknown as any);

    // Steps should be available
    expect(solver.getStepsCount()).toBeGreaterThan(0);

    const step = solver.getStep();
    expect(step).toHaveProperty("description");
    expect(step).toHaveProperty("current");
    expect(step).toHaveProperty("result");
    // The final steps list should eventually yield x
    // call until empty to ensure no runtime exceptions
    while (solver.getStepsCount() > 0) {
      const s = solver.getStep();
      expect(s).toBeDefined();
    }
  });
});
