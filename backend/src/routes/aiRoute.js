import express from "express";
import { sendAIMessage, getAIHistory } from "../controllers/aiController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/chat", protectedRoute, sendAIMessage);
router.get("/history", protectedRoute, getAIHistory);

export default router;
