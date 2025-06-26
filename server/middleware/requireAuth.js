// middlewares/requireAuth.js
import { getAuth } from "@clerk/express";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const dbUser = await User.findOne({ clerkUserId });

    if (!dbUser) {
      return res.status(404).json({ message: "User not found in database" });
    }

    req.user = {
      clerkUserId,
      dbUserId: dbUser._id.toString(),
    };

    next();
  } catch (err) {
    console.error("❌ Error in requireAuth middleware:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
