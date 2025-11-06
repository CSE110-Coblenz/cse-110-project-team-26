import { Router, Request, Response } from "express";
import { registerUser, loginUser, deleteUserAccount } from "../controllers/userController";
import { requireAuth, AuthedRequest } from "../middleware/auth";

// -------------- Unprotected Routes --------------
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


// -------------- Protected Routes -----------------
router.get("/me", requireAuth, (req: AuthedRequest, res: Response) => {
    res.json({ userId: req.userId });
  });
router.delete("/delete", requireAuth, deleteUserAccount);

// router.post('/logout', authMiddleware, userController.logoutUser);
// router.delete('/me', authMiddleware, userController.deleteUserAccount);

export default router;