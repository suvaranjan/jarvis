import express from "express";
import {
  sendMessageToGemini,
  getChatHistory,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/", sendMessageToGemini);
router.get("/:userId", getChatHistory);

export default router;
