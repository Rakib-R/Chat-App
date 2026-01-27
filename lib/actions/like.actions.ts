
"use server";

import Like from "@/lib/models/like.model";
import Thread from "@/lib/models/thread.model";
import mongoose from "mongoose";
import { fetchUser } from "./user.actions";

export async function toggleLike(currentUserId: string, threadId: string) {
  
  const user = await fetchUser(currentUserId);
  const userId = user._id; 

  const existingLike = await Like?.findOne({
    user: userId,
    thread: threadId,
  });

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });

    await Thread.findByIdAndUpdate(threadId, {
      $inc: { likeCount: -1 },
    });

    return { liked: false };
  }

  await Like.create({
    user: userId,
    thread: threadId,
  });

  await Thread.findByIdAndUpdate(threadId, {
    $inc: { likeCount: 1 },
  });

  return { liked: true };
}


// COUNTING LIKES
export async function likeCount(userId: string) {

// LIKES I GAVE
const likesIGave = await Like.countDocuments({
    user: userId,
  });

// Likes I RECEIVED
  const receivedResult = await Like.aggregate([
    {
      $lookup: {
        from: "threads",
        localField: "thread",
        foreignField: "_id",
        as: "thread",
      },
    },
    { $unwind: "$thread" },
    {
      $match: {
        "thread.author": new mongoose.Types.ObjectId(userId),
      },
    },
    { $count: "totalLikesReceived" },
  ]);

  const likesIReceived =
    receivedResult.length > 0
      ? receivedResult[0].totalLikesReceived
      : 0;

  return {
    likesIGave,
    likesIReceived,
  };
}

