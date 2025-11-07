import mongoose, { Schema, Document } from "mongoose";

export type StatsCategory =
  | "Solving Linear Equations"
  | "Solving Quadratic Equations"
  | "One-Step Algebraic Equations"
  | "Multi-Step Algebraic Equations"
  | "Drawing Linear Equations"
  | "Drawing Quadratic Equations"
  | "Drawing Absolute Value Equations";

type Bucket = {
  answered: number;
  correct: number;
};

export interface IUserStats extends Document {
  userId: mongoose.Types.ObjectId;
  categories: Record<StatsCategory, Bucket>;
  total: {
    answered: number; // "Total Questions Answered"
    correct: number;
  };
  lastAnsweredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bucketDefaults: Bucket = { answered: 0, correct: 0 };

/**
 * UserStatsSchema defines the schema for user statistics in the database.
 * It includes the following fields:
 * 
 * - userId: A unique identifier for the user, referencing the User model.
 * - categories: A map of categories, each containing statistics for answered and correct responses.
 * - total: An object containing the total number of answered and correct responses across all categories.
 * - lastAnsweredAt: A date indicating when the user last answered a question.
 * 
 * The schema also includes timestamps for creation and updates.
 */
const UserStatsSchema = new Schema<IUserStats>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true, index: true, required: true },
    categories: {
      type: Map,
      of: new Schema<Bucket>(
        {
          answered: { type: Number, default: 0 },
          correct: { type: Number, default: 0 },
        },
        { _id: false }
      ),
      default: () => ({
        ["Solving Linear Equations"]: { ...bucketDefaults },
        ["Solving Quadratic Equations"]: { ...bucketDefaults },
        ["One-Step Algebraic Equations"]: { ...bucketDefaults },
        ["Multi-Step Algebraic Equations"]: { ...bucketDefaults },
        ["Drawing Linear Equations"]: { ...bucketDefaults },
        ["Drawing Quadratic Equations"]: { ...bucketDefaults },
        ["Drawing Absolute Value Equations"]: { ...bucketDefaults },
      }),
    },
    total: {
      answered: { type: Number, default: 0 },
      correct: { type: Number, default: 0 },
    },
    lastAnsweredAt: { type: Date },
  },
  { timestamps: true }
);

UserStatsSchema.index({ userId: 1 });

export const UserStats = mongoose.model<IUserStats>("UserStats", UserStatsSchema);
