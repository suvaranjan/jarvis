import dotenv from "dotenv";
import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/db.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { handleClerkWebhook } from "./controllers/webhookController.js";
import { requireAuth } from "./middleware/requireAuth.js";
import { generateImageToken } from "./services/imageKit.js";
// import cleanRoute from "./utils/book/clean.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS setup
app.use(cors());
app.use(clerkMiddleware());
// app.use("/api", cleanRoute);

// Clerk webhook must receive raw body, so define this BEFORE express.json
app.post(
  "/api/webhook/clerk",
  // bodyParser.raw({ type: "application/json" }),
  express.raw({ type: "application/json" }),
  handleClerkWebhook
);

// Parse JSON for all other routes
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/chat", requireAuth, chatRoutes);
app.use("/api/user", requireAuth, userRoutes);
app.get("/api/get-imagekit-token", requireAuth, generateImageToken);

// Health check route
app.get("/", async (req, res) => {
  res.json({ message: "Hello World" });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
