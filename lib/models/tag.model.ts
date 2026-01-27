
import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    mentionedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mentionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 1️⃣ Prevent duplicate mentions
tagSchema.index(
  { thread: 1, mentionedUser: 1 },
  { unique: true }
);



const Tag = mongoose.models.Tag || mongoose.model("Tag", tagSchema);
export default Tag;
