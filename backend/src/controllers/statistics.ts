import { Request, Response } from "express";
import mongoose from "mongoose";
import { updateUserStats } from "../services/stats.service";

/**
 * Records an attempt made by a user in a specific category.
 * 
 * @param req - The request object containing user information and attempt details.
 * @param res - The response object used to send back the desired HTTP response.
 * 
 * @returns A JSON response indicating the success or failure of the operation.
 * 
 * @throws 401 Unauthorized if the user ID is not present in the request.
 * @throws 400 Bad Request if the provided category is not allowed.
 * @throws 500 Internal Server Error if an unexpected error occurs during processing.
 */
export const recordAttempt = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) return res.status(401).json({ error: "unauthorized" });

    const { category, isCorrect } = req.body as {
      category: string;
      isCorrect: boolean;
    };

    const allowed = new Set([
      "Solving Linear Equations",
      "Solving Quadratic Equations",
      "One-Step Algebraic Equations",
      "Multi-Step Algebraic Equations",
      "Drawing Linear Equations",
      "Drawing Quadratic Equations",
      "Drawing Absolute Value Equations",
    ]);
    if (!allowed.has(category)) {
      return res.status(400).json({ error: "invalid category" });
    }

    await updateUserStats(new mongoose.Types.ObjectId(userId), category as any, !!isCorrect);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("recordAttempt error:", e);
    return res.status(500).json({ error: "server error" });
  }
};
