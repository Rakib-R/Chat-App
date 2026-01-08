import mongoose from "mongoose";

  const CommunitySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true }, // Changed from 'bio' to match 'description'
    image: String,
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    threads: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Thread" }
    ],
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ]
});


const Community = mongoose.models.Community || mongoose.model('Community', CommunitySchema);

export default Community;   