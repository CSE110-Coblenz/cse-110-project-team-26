import { Router } from "express";
import { registerUser, loginUser, deleteUserAccount, getUserProfile } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";
import { recordAttempt } from "../controllers/statistics";


// -------------- Unprotected Routes --------------
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


// -------------- Protected Routes -----------------
router.get("/me", requireAuth, getUserProfile);
router.delete("/delete", requireAuth, deleteUserAccount);
router.post("/stats/attempt", requireAuth, recordAttempt);

// router.post('/logout', authMiddleware, userController.logoutUser);

export default router;
