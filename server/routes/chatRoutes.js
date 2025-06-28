import express from "express";
import {
  sendMessageToGemini,
  getMessagesForChat,
  createChat,
  getChatsForUser,
  deleteChat,
  editChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/create", createChat);
router.post("/ask-to-gemini", sendMessageToGemini);
router.get("/:id/get-messages", getMessagesForChat);
router.get("/list", getChatsForUser);
router.delete("/:chatId", deleteChat);
router.put("/:chatId", editChat);

export default router;
