import { Router } from "express";
import { handleMainProblem } from "../../controllers/gameController";

// Main game Endpoints
const router = Router();

router.post("/mainHandleProblem", handleMainProblem);

export default router;
