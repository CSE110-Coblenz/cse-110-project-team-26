import mongoose from "mongoose";
import { UserStats, StatsCategory } from "../models/userStats.model";

/**
 * Updates the user statistics for a specific category based on whether the answer was correct or not.
 *
 * @param userId - The ID of the user whose statistics are to be updated. Can be a string or a mongoose ObjectId.
 * @param category - The category of the statistics to be updated.
 * @param isCorrect - A boolean indicating whether the user's answer was correct.
 *
 * @returns A promise that resolves when the update operation is complete.
 */
export async function updateUserStats(
  userId: mongoose.Types.ObjectId | string,
  category: StatsCategory,
  isCorrect: boolean
) {
  const incs: Record<string, number> = {
    "total.answered": 1,
    ...(isCorrect ? { "total.correct": 1 } : {}),
  };

  // dynamic category paths
  incs[`categories.${category}.answered`] = 1;
  if (isCorrect) incs[`categories.${category}.correct`] = 1;

  await UserStats.updateOne(
    { userId },
    {
      $inc: incs,
      $set: { lastAnsweredAt: new Date() },
      $setOnInsert: { userId },
    },
    { upsert: true }
  );
}
