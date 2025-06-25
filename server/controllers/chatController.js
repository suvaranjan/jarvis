// import User from "../models/User.js";
import Chat from "../models/Chat.js";
import { generateGeminiReply } from "../services/geminiService.js";

// POST /api/chat/
export const sendMessageToGemini = async (req, res) => {
  const { userId, message, imageUrl } = req.body;

  if (!message && !imageUrl)
    return res.status(400).json({ error: "Text or image required." });

  try {
    const reply = await generateGeminiReply({ message, imageUrl });

    const chat = await Chat.create({
      userId,
      message,
      imageUrl,
      reply,
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error("❌ Error sending chat:", err.message);
    res
      .status(500)
      .json({ error: "Failed to process chat", details: err.message });
  }
};

// GET /api/chat/:userId
export const getChatHistory = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.params.userId }).sort({
      createdAt: -1,
    });
    res.json(chats);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch chat history", details: err.message });
  }
};
