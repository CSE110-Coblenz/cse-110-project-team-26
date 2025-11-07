import { Router, Request, Response } from "express";
import { registerUser, loginUser, deleteUserAccount } from "../controllers/userController";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { User } from "../models/user.model";
import { UserStats } from "../models/userStats.model";
import { recordAttempt } from "../controllers/statistics";


// -------------- Unprotected Routes --------------
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


// -------------- Protected Routes -----------------
router.get("/me", requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "unauthorized" });
    }

    // Fetch user basic info
    const user = await User.findById(userId).select("email createdAt updatedAt");
    if (!user) {
      return res.status(404).json({ error: "user not found or deleted" });
    }

    // Fetch user stats
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
  } catch (err) {
    console.error("GET /auth/me error:", err);
    return res.status(500).json({ error: "server error" });
  }
});
router.delete("/delete", requireAuth, deleteUserAccount);
router.post("/stats/attempt", requireAuth, recordAttempt);

// router.post('/logout', authMiddleware, userController.logoutUser);

export default router;