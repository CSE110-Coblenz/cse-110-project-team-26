import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user";
import mazeRoutes from "./src/routes/Game/maze";
import cors from "cors";

dotenv.config();
console.log("GOOGLE_API_KEY present?", Boolean(process.env.GOOGLE_API_KEY));

export const app = express();
app.use(express.json());

// Allow requests from the frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Mount routes
app.use("/auth", userRoutes);
app.use("/game/maze", mazeRoutes);

export async function connectDB(uri?: string) {
  const mongoUri = uri ?? process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
