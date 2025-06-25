import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.use("/api/chat", chatRoutes);

app.get("/", (req, res) => res.send("✅ Gemini Chat Server is Running"));

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
