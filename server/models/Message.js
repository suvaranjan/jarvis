import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: String,
      required: true,
      enum: ["user", "gemini"],
    },
    text: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

// Enforce: text is required unless imageUrl is present
messageSchema.pre("validate", function (next) {
  const hasText = typeof this.text === "string" && this.text.trim().length > 0;
  const hasImage =
    typeof this.imageUrl === "string" && this.imageUrl.trim().length > 0;

  if (!hasText && !hasImage) {
    return next(
      new Error(
        "Message must contain text or an image. Text is required unless an image is provided."
      )
    );
  }

  next();
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
