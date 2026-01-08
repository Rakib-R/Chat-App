// lib/actions/cleanup.actions.ts
"use server";

import Thread from "../models/thread.model";
import { connectTODB } from "../mongoose";
import User from "../models/user.model";
import { auth, clerkClient } from "@clerk/nextjs/server";


export const cleanupDatabase = async () => {

  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");


  try {
    await connectTODB();
    const allUsers = await User.find({}, { _id: 1 });
    const validUserIds = allUsers.map((user) => user._id);
    //  Delete Threads with no author
   const threadRes = await Thread.deleteMany({
      $or: [
        { author: { $exists: false } },
        { author: null },
        { author: { $nin: validUserIds } } // The cross-match check
      ]
    });

    console.log(`Cleaned ${threadRes.deletedCount} threads`);
    return { success: true };
  } catch (error) {
    console.error("Cleanup failed:", error);
  }
};


export async function completeOnboarding() {
  const { userId } = await auth();
  if (!userId) return;

  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      isFirstTimeUser: false,
    },
  });
}