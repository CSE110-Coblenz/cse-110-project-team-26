import { Router } from "express";
import { handleMazeProblem } from "../../controllers/gameController";

const router = Router();

// Maze Game Endpoints
router.post("/mazeHandleProblem", handleMazeProblem);

export default router;