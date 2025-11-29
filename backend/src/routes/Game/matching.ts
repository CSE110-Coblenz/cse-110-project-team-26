import { Router } from "express";
import { handleMatchingProblem } from "../../controllers/gameController";

// Matching Game Endpoints
const router = Router();

router.post("/matchingHandleProblem", handleMatchingProblem);

export default router;
