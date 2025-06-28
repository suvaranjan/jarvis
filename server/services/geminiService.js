import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";
import { identityPrompt } from "./customPrompts.js";
// import { loadMahabharatText } from "../utils/book/loadMahabharatText.js";

// const mahabharatText = await loadMahabharatText();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const fetchImageAsBase64 = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Image fetch failed");
  const contentType = response.headers.get("content-type");
  const buffer = Buffer.from(await response.arrayBuffer());
  return {
    mimeType: contentType,
    data: buffer.toString("base64"),
  };
};

export const generateGeminiReply = async ({ messages }) => {
  const contents = [];

  // Custom Prompts
  contents.push({
    role: "user",
    parts: [
      { text: identityPrompt },
      // {
      //   text: `You are a Mahabharat expert. Use the following cleaned full text as your source of truth for answering only Mahabharat-related questions. Avoid hallucinations. Focus only on the context below:\n\n${mahabharatText.slice(
      //     0,
      //     100_000
      //   )}\n\n[End of Mahabharat Excerpt]`,
      // },
    ],
  });

  // 2. Format all prior messages
  for (const msg of messages) {
    const role = msg.sender === "user" ? "user" : "model";
    const parts = [];

    if (msg.text) parts.push({ text: msg.text });

    if (msg.imageUrl) {
      const { mimeType, data } = await fetchImageAsBase64(msg.imageUrl);
      parts.push({ inlineData: { mimeType, data } });
    }

    contents.push({ role, parts });
  }

  // 3. Generate Gemini response
  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    generationConfig: {
      maxOutputTokens: 600,
      temperature: 0.7,
    },
  });

  const reply = result.text;
  return reply;
};
