import mongoose from "mongoose";
import { shareCount } from "../actions/share.actions";

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },

//  FOR DELETED USERS / AUTHORS
  authorFallback: {
  name: { type: String, default: "Deleted User" },
  image: { type: String, default: "/nouser.jpg" },
  bio: { type: String, default: "" },
  username: { type: String, default: "deleted_user" },
},

  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt : {
    type : Date,
    default : Date.now()
  },
   
  parentId : {
    type : String,
  },

   likeCount: {
    type: Number,
    default: 0,
  },

   shareCount: {
    type: Number,
    default: 0, 
  },

   tagCount: {
    type: Number,
    default: 0,
  },

  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

const Thread = mongoose.models?.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
