
import mongoose from "mongoose";

const shareSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thread: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
      required: true,
    },
    method: {
      type: String,
      enum: ["copy", "twitter", "facebook"],
      default: "copy",
    },
  },
  { timestamps: true }
);

const Share = mongoose.models.Share || mongoose.model("Share", shareSchema);
export default Share;
