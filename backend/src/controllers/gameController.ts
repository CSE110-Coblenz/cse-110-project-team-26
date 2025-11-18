import type { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = process.env.GEMINI_TUTORIAL_MODEL ?? "gemini-2.5-flash";
let cachedGenAI: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
	const apiKey = process.env.GOOGLE_API_KEY;
	if (!apiKey) {
		return null;
	}

	if (!cachedGenAI) {
		cachedGenAI = new GoogleGenAI({ apiKey });
	}
	return cachedGenAI;
}

export const generateMainProblem = async (req: Request, res: Response) => {
    // logic
};
export const generateMatchingProblem = async (req: Request, res: Response) => {
    // logic
};
export const generateMazeProblem = async (req: Request, res: Response) => {
    // logic
};

export const handleMainProblem = async (req: Request, res: Response) => {
    // logic
};
export const handleMatchingProblem = async (req: Request, res: Response) => {
    // logic
};
export const handleMazeProblem = async (req: Request, res: Response) => {
	const latex = req.body?.latex ?? [];
	const givenAnswer = req.body?.givenAnswer ?? req.body?.["given answer"] ?? [];
	const correctAnswer =
		req.body?.correctAnswer ?? req.body?.["correct answer"] ?? [];

	if (
		!Array.isArray(latex) ||
		!Array.isArray(givenAnswer) ||
		!Array.isArray(correctAnswer)
	) {
		return res.status(400).json({
			error: "Request body must include arrays: latex, givenAnswer, correctAnswer.",
		});
	}

	const genAI = getGenAI();
	if (!genAI) {
		return res.status(500).json({
			error: "Gemini API key is not configured. Set GOOGLE_API_KEY in the backend environment.",
		});
	}

	try {
		const prompt = buildMazeExplanationPrompt(latex, givenAnswer, correctAnswer);
		const result = await genAI.models.generateContent({
			model: GEMINI_MODEL,
			contents: [
				{
					role: "user",
					parts: [{ text: prompt }],
				},
			],
		});
		const text = result.text || "No explanation returned.";

		return res.json({
			explanation: text,
		});
	} catch (error) {
		console.error("handleMazeProblem error:", error);
		return res.status(500).json({
			error: "Failed to generate explanation. Please try again.",
		});
	}
};

function buildMazeExplanationPrompt(
	latex: unknown[],
	givenAnswer: unknown[],
	correctAnswer: unknown[],
): string {
	const formatArray = (values: unknown[]) =>
		values.length
			? values.map((v, i) => `${i + 1}. ${String(v)}`).join("\n")
			: "None provided.";

	return `You are an encouraging math tutor helping students navigate a maze puzzle.

Problem statements (LaTeX):
${formatArray(latex)}

Student's submitted answer:
${formatArray(givenAnswer)}

Correct answer:
${formatArray(correctAnswer)}

Explain concisely why the student's answer is incorrect, referencing the specific mistakes.
Then clearly explain what the correct answer is and how to arrive at it.
Use friendly, encouraging language. Format the response as:

Why it is incorrect:
- ...
- ...

Correct approach:
- ...
- ...
`;
}