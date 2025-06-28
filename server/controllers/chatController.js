import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import { generateGeminiReply } from "../services/geminiService.js";

// 🔁 Reusable function to process user & Gemini messages
// const processGeminiMessage = async ({ chatId, text, imageUrl }) => {
//   const userMessage = await Message.create({
//     chatId,
//     sender: "user",
//     text,
//     imageUrl,
//   });

//   const geminiReply = await generateGeminiReply({ message: text, imageUrl });

//   const geminiMessage = await Message.create({
//     chatId,
//     sender: "gemini",
//     text: geminiReply,
//   });

//   return { userMessage, geminiMessage };
// };

const processGeminiMessage = async ({ chatId, text, imageUrl }) => {
  // 1. Save user message
  const userMessage = await Message.create({
    chatId,
    sender: "user",
    text,
    imageUrl,
  });

  // 2. Fetch prior messages (including current one)
  const previousMessages = await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .limit(20); // optional limit

  // 3. Call Gemini with full conversation
  const geminiReply = await generateGeminiReply({
    messages: previousMessages,
  });

  // 4. Save Gemini reply
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
    res
      .status(500)
      .json({ error: "Failed to fetch messages", details: err.message });
  }
};

export const getChatsForUser = async (req, res) => {
  const { dbUserId } = req.user;

  try {
    const chats = await Chat.find({ userId: dbUserId })
      .select("_id title createdAt")
      .sort({ createdAt: -1 }); // Newest first

    const formattedChats = chats.map((chat) => ({
      id: chat._id,
      title: chat.title,
      createdAt: chat.createdAt,
    }));

    res.status(200).json(formattedChats);
  } catch (err) {
    console.error("❌ Error fetching chats:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch chat list", details: err.message });
  }
};

// DELETE /api/chat/:chatId
export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const { dbUserId } = req.user;

  try {
    const chat = await Chat.findOneAndDelete({ _id: chatId, userId: dbUserId });

    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized." });
    }

    // Also delete associated messages
    await Message.deleteMany({ chatId });

    res.status(200).json({ message: "Chat and associated messages deleted." });
  } catch (err) {
    console.error("❌ Error deleting chat:", err);
    res
      .status(500)
      .json({ error: "Failed to delete chat", details: err.message });
  }
};

// PUT /api/chat/:chatId
export const editChat = async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body;
  const { dbUserId } = req.user;

  if (!title) {
    return res.status(400).json({ error: "Title is required to update chat." });
  }

  try {
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId: dbUserId },
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ error: "Chat not found or unauthorized." });
    }

    res.status(200).json({ message: "Chat updated successfully", chat });
  } catch (err) {
    console.error("❌ Error editing chat:", err);
    res
      .status(500)
      .json({ error: "Failed to edit chat", details: err.message });
  }
};
