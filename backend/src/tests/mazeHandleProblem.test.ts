// npx vitest --run src/tests/mazeHandleProblem.test.ts
vi.mock("@google/genai", () => {
    class MockGoogleGenAI {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: "Mock explanation...",
        }),
      };
    }
    return { GoogleGenAI: MockGoogleGenAI };
  });

import request from "supertest";
import { app } from "../../app";
import { describe, test, expect, vi, beforeAll } from "vitest";

describe("POST /game/maze/mazeHandleProblem", () => {
  const PATH = "/game/maze/mazeHandleProblem";

  beforeAll(() => {
    // Any non-empty value will satisfy the controller's key check.
    process.env.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "test_gemini_key";
    // Use a fixed model so behavior is deterministic in tests.
    process.env.GEMINI_TUTORIAL_MODEL =
      process.env.GEMINI_TUTORIAL_MODEL || "gemini-2.5-flash";
  });

  test("returns explanation from Gemini (mocked) when request body is valid", async () => {
    const payload = {
      latex: ["x^2 + 2x + 1 = 0"],
      givenAnswer: ["x = 2"],
      correctAnswer: ["x = -1"],
    };

    const res = await request(app).post(PATH).send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("explanation");
    expect(res.body.explanation).toContain("Mock explanation");
  });

  test("returns 400 when body is missing required arrays", async () => {
    const res = await request(app).post(PATH).send({
      // missing latex / correctAnswer etc.
      givenAnswer: "not-an-array",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/latex, givenAnswer, correctAnswer/i);
  });
}
);