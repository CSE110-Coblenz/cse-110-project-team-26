import { Router } from "express";
import { handleMainProblem } from "../../controllers/gameController";

// Main game Endpoints
const router = Router();

// Old placeholder line retained for reference
// router.post('/mainHandleProblem', gameController.mainHandleProblem(problem, answer));

router.post("/mainHandleProblem", handleMainProblem);

export default router;
