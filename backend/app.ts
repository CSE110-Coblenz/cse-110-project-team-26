import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./src/routes/user";
import cors from "cors";

dotenv.config();


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
