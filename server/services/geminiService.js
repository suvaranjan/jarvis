import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

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

export const generateGeminiReply = async ({ message, imageUrl }) => {
  const contents = [];

  if (imageUrl) {
    const { mimeType, data } = await fetchImageAsBase64(imageUrl);
    contents.push({ inlineData: { mimeType, data } });
  }

  if (message) contents.push({ text: message });

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    generationConfig: {
      maxOutputTokens: 600,
      temperature: 0.7,
    },
  });

  return result.text;
};
