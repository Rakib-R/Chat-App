
import Share from "@/lib/models/share.model";
import Thread from "@/lib/models/thread.model";

export async function shareThread(
  userId: string,
  threadId: string,
  method: "copy" | "twitter" | "facebook"
) {
  await Share.create({
    user: userId,
    thread: threadId,
    method,
  });

  await Thread.findByIdAndUpdate(threadId, {
    $inc: { shareCount: 1 },
  });


}


export async function shareCount(
    userId: string,
){
    // My Shares
    Share.countDocuments({ user: userId });

    Share.aggregate([
    {   $lookup: {
        from: "threads",
        localField: "thread",
        foreignField: "_id",
        as: "thread",
        },
    },
    { $unwind: "$thread" },
    { $match: { "thread.author": userId } },
    { $count: "totalShares" },
]);
}