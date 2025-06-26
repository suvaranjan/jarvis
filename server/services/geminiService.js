import dotenv from "dotenv";
dotenv.config();
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

  // Add Markdown formatting instruction
  contents.push({
    text: `You are an AI assistant. Always format your response in GitHub-style Markdown with proper spacing.

Guidelines:
- Use headings like \`## Heading\` followed by a **blank line**
- Separate paragraphs with **two newlines**
- Use bullet lists with \`-\`, and separate items with newlines
- Use numbered lists like \`1.\`, and separate items with newlines
- Use triple backticks (\`\`\`) for code blocks and include the language (e.g., \`\`\`js)
- Include a blank line before and after code blocks
- Hyperlinks should be in [text](url) format

Example:
## Title

Here is a paragraph explaining something.

- First item
- Second item

\`\`\`javascript
const x = 1;
\`\`\`

End each section with two newlines to ensure clean formatting.`,
  });

  // Optional image input
  if (imageUrl) {
    const { mimeType, data } = await fetchImageAsBase64(imageUrl);
    contents.push({ inlineData: { mimeType, data } });
  }

  // Add user's actual message
  if (message) {
    contents.push({ text: message });
  }

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    generationConfig: {
      maxOutputTokens: 600,
      temperature: 0.7,
    },
  });

  console.log(result);

  return result.text;
};

// export const generateGeminiReply = async ({ message, imageUrl }) => {
//   const contents = [];

//   if (imageUrl) {
//     const { mimeType, data } = await fetchImageAsBase64(imageUrl);
//     contents.push({ inlineData: { mimeType, data } });
//   }

//   if (message) contents.push({ text: message });

//   const result = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents,
//     generationConfig: {
//       maxOutputTokens: 600,
//       temperature: 0.7,
//     },
//   });

//   return result.text;
// };
