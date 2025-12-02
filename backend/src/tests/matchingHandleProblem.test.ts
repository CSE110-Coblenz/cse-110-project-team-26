// npx vitest --run src/tests/matchingHandleProblem.test.ts
vi.mock("@google/genai", () => {
  class MockGoogleGenAI {
    models = {
      generateContent: vi.fn().mockResolvedValue({
        text: "Mock matching explanation...",
      }),
    };
  }
  return { GoogleGenAI: MockGoogleGenAI };
});

import request from "supertest";
import { describe, test, expect, vi, beforeAll } from "vitest";
import { app } from "../../app";

describe("POST /game/matching/matchingHandleProblem", () => {
  const PATH = "/game/matching/matchingHandleProblem";

  beforeAll(() => {
    process.env.GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "test_gemini_key";
    process.env.GEMINI_TUTORIAL_MODEL =
      process.env.GEMINI_TUTORIAL_MODEL || "gemini-2.5-flash";
  });

  test("returns explanation from Gemini (mocked) when request body is valid", async () => {
    const payload = {
      question: "Match y = 2x + 3 to its slope/intercept parts.",
      given_answer: "slope = 1, intercept = 5",
      correct_answer: "slope = 2, intercept = 3",
    };

    const res = await request(app).post(PATH).send(payload);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("explanation");
    expect(res.body.explanation).toContain("Mock matching explanation");
  });

  test("returns 400 when body is missing required strings", async () => {
    const res = await request(app).post(PATH).send({
      question: ["not-a-string"],
      given_answer: "abc",
      // missing correct_answer
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/question, given_answer, correct_answer/i);
  });
});
