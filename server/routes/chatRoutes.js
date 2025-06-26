import express from "express";
import {
  sendMessageToGemini,
  getMessagesForChat,
  createChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/create", createChat);
router.post("/ask-to-gemini", sendMessageToGemini);
router.get("/:id/get-messages", getMessagesForChat);

export default router;
