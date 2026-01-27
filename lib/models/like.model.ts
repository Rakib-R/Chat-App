import mongoose, { Schema, models, model } from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    thread: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Thread", 
      required: true 
    },
  },
  { timestamps: true }
);

// Prevent duplicate likes
likeSchema.index({ user: 1, thread: 1 }, { unique: true });

// ✅ FIX: Use 'mongoose.models?.Like' (note the question mark)
// This prevents the crash if 'models' is initially undefined
const Like = models?.Like || model("Like", likeSchema);

export default Like;