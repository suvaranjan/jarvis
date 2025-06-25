import dotenv from "dotenv";
dotenv.config();

import { Webhook } from "svix";
import User from "../models/User.js";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

export const handleClerkWebhook = async (req, res) => {
  if (!webhookSecret) {
    console.error("❌ Missing Clerk Webhook Secret");
    return res.status(500).send("Webhook secret not configured");
  }

  try {
    const body = req.body.toString("utf8");
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const wh = new Webhook(webhookSecret);
    const event = wh.verify(body, headers);

    const { type: eventType, data } = event;

    const emailObj = data.email_addresses.find(
      (email) => email.id === data.primary_email_address_id
    );
    const email = emailObj?.email_address;
    const name = `${data.first_name || ""} ${data.last_name || ""}`.trim();
    const imageUrl = data.image_url;
    const clerkUserId = data.id;

    if (!email) {
      console.warn("❌ Webhook rejected: missing email");
      return res.status(400).send("No email");
    }

    if (!name) {
      console.warn("❌ Webhook rejected: missing name");
      return res.status(400).send("No name");
    }

    console.log(`📩 Event received: ${eventType}`);

    switch (eventType) {
      case "user.created":
      case "user.updated":
        await User.findOneAndUpdate(
          { clerkUserId },
          {
            clerkUserId,
            email,
            name,
            imageUrl,
          },
          { new: true, upsert: true }
        );
        console.log(`✅ User upserted (${eventType}):`, email);
        break;

      case "user.deleted":
        await User.findOneAndUpdate({ clerkUserId }, { deletedAt: new Date() });
        console.log("🗑️ Soft-deleted user:", email);
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${eventType}`);
        break;
    }

    return res.status(200).json({ message: "Webhook processed" });
  } catch (err) {
    console.error("❌ Webhook verification failed:", err.message);
    return res.status(400).send("Invalid signature");
  }
};

