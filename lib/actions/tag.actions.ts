
import Tag from "@/lib/models/tag.model";
import User from "@/lib/models/user.model";

// TAG / MENTION FUNCTIONALITY
// This is how @username works in real apps.

export async function tagUsersInThread(
  threadId: string,
  authorId: string,
  usernames: string[]
) {

  const users = await User.find({
    username: { $in: usernames },
  }).select("_id");

  const tags = users.map((user : any) => ({
    thread: threadId,
    mentionedUser: user._id,
    mentionedBy: authorId,
  }));

// 2️⃣ Ignore self-mentions
  const _tags_mention = users
  .filter(u => u._id.toString() !== authorId)
  .map(user => ({
    thread: threadId,
    mentionedUser: user._id,
    mentionedBy: authorId,
  }));

  // Who I mentioned
  await Tag.find({ mentionedBy: authorId })
  .populate("mentionedUser", "username image");

  if (tags.length) {
    await Tag.insertMany(tags);
  }

// Who mentioned me
Tag.find({ mentionedUser: authorId }).populate("thread");


}

// 🧠 Extract Mentions from Text
export function extractMentions(text: string) {
  return [...text.matchAll(/@(\w+)/g)].map(m => m[1]);
}

