import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { UserStats } from "../models/userStats.model";

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
          return res.status(400).json({ error: "email and password required" });
        }
    
        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
          return res.status(401).json({ error: "invalid credentials" });
        }
    
        const ok = await bcrypt.compare(password, (user as any).password);
        if (!ok) {
          return res.status(401).json({ error: "invalid credentials" });
        }
    
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        return res.json({
          token,
          user: { id: user.id, email: user.email },
        });
      } catch (e) {
        console.error("loginUser error:", e);
        return res.status(500).json({ error: "server error" });
      }
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as { email?: string; password?: string };
        if (!email || !password) {
          return res.status(400).json({ error: "email and password required" });
        }
        if (password.length < 8) {
          return res.status(400).json({ error: "password must be at least 8 characters" });
        }
    
        const normalizedEmail = email.toLowerCase().trim();
    
        // Pre-save hook on the schema will hash the password for us
        const user = await User.create({ email: normalizedEmail, password });
    
        const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        return res.status(201).json({ token, user: { id: user.id, email: user.email } });
      } catch (e: any) {
        if (e?.code === 11000) {
          return res.status(409).json({ error: "email already registered" });
        }
        console.error("registerUser error:", e);
        return res.status(500).json({ error: "server error" });
      }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId as string | undefined;
    if (!userId) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const user = await User.findById(userId).select("email createdAt updatedAt");
    if (!user) {
      return res.status(404).json({ error: "user not found or deleted" });
    }

    const stats = await UserStats.findOne({ userId }).lean();

    return res.json({
      user: {
        id: user.id,
        email: user.email,
      },
      stats: stats || {
        total: { answered: 0, correct: 0 },
        categories: {},
      },
    });
  } catch (e) {
    console.error("getUserProfile error:", e);
    return res.status(500).json({ error: "server error" });
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId as string | undefined;
        if (!userId) {
          return res.status(401).json({ error: "unauthorized" });
        }
    
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ error: "user not found" });
        }
    
        await User.findByIdAndDelete(userId);
    
        return res.json({ message: "account deleted successfully" });
      } catch (e) {
        console.error("deleteUserAccount error:", e);
        return res.status(500).json({ error: "server error" });
      }
};
