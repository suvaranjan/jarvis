import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { generateGeminiReply } from "../services/geminiService.js";

// 🔁 Reusable function to process user & Gemini messages
const processGeminiMessage = async ({ chatId, text, imageUrl }) => {
  const userMessage = await Message.create({
    chatId,
    sender: "user",
    text,
    imageUrl,
  });

  const geminiReply = await generateGeminiReply({ message: text, imageUrl });

  const geminiMessage = await Message.create({
    chatId,
    sender: "gemini",
    text: geminiReply,
  });

  return { userMessage, geminiMessage };
};

// POST /api/chat/create
export const createChat = async (req, res) => {
  try {
    const { title, userMessage, imageUrl } = req.body;
    const { dbUserId } = req.user;

    if (!dbUserId) {
      return res.status(401).json({ error: "Unauthorized: missing user" });
    }

    // 1. Create the new chat
    const newChat = await Chat.create({
      userId: dbUserId,
      title: title || "New Chat",
    });

    let messages = null;

    // 2. If initial message is provided, process it
    if (userMessage || imageUrl) {
      messages = await processGeminiMessage({
        chatId: newChat._id,
        text: userMessage,
        imageUrl,
      });
    }

    // 3. Respond
    res.status(201).json({
      chat: newChat,
      ...messages,
    });
  } catch (error) {
    console.error("❌ Error creating chat:", error);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

// POST /api/chat/ask-to-gemini
export const sendMessageToGemini = async (req, res) => {
  const { text, imageUrl, chatId } = req.body;
  const { dbUserId } = req.user;

  if (!text && !imageUrl) {
    return res.status(400).json({ error: "Text or imageUrl required." });
  }

  if (!chatId) {
    return res.status(400).json({ error: "Chat ID is required." });
  }

  try {
    const chat = await Chat.findOne({ _id: chatId, userId: dbUserId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found for this user." });
    }

    const messages = await processGeminiMessage({ chatId, text, imageUrl });

    res.status(201).json(messages);
  } catch (err) {
    console.error("❌ Error in sendMessageToGemini:", err);
    res.status(500).json({
      error: "Failed to send message to Gemini",
      details: err.message,
    });
  }
};

export const getMessagesForChat = async (req, res) => {
  const { id: chatId } = req.params;
  const { dbUserId } = req.user;

  try {
    // Validate access
    const chat = await Chat.findOne({ _id: chatId, userId: dbUserId });
    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized." });
    }

    // Fetch messages
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 }); // Oldest → Newest

    res.status(200).json(messages);
  } catch (err) {
    console.error("❌ Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages", details: err.message });
  }
};