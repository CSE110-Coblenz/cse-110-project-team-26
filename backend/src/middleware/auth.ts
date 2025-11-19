import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export interface AuthedRequest extends Request {
  userId?: string;
}

export const requireAuth = async (req: AuthedRequest, res: Response, next: NextFunction) => {
    try {
      const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
      if (!token) return res.status(401).json({ error: "missing token" });
  
      const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { sub: string };
      // verify user still exists
      const user = await User.findById(payload.sub).select("_id");
      if (!user) return res.status(401).json({ error: "invalid or deleted user" });
  
      req.userId = user.id;
      next();
    } catch {
      return res.status(401).json({ error: "invalid token" });
    }
  };