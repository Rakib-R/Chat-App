import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";

const CommunitySchema = new mongoose.Schema({
  id: {type: String, required: true, unique: true},
  username : {type: String, required: true, unique: true},
  name: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  threads: [
    {type: mongoose.Schema.Types.ObjectId,
      ref: "Thread"
    }
  ],
  members : [
    {type : mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
});

const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);

export default Community;   