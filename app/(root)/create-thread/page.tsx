"use server"

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {PostThread} from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";


 const EMOJI_DATA = [
  {
    label: "Faces & Emotions",
    list: { '😂': 'Joy', '😭': 'Sob', '😍': 'Heart-Eyes', '🥰': 'Hearts', '🤔': 'Thinking' }
  },
  {
    label: "Hand Gestures",
    list: { '👍': 'Thumbs Up', '👎': 'Thumbs Down', '✌️': 'Victory', '🤞': 'Crossed' }
  },
  {
    label: "Hearts & Symbols",
    list: { '❤️': 'Heart', '💔': 'Broken', '✨': 'Sparkles', '🔥': 'Fire' }
  },
  {
    label: "Nature & Objects",
    list : {'👀': 'Eyes','🎉': 'Party Popper','🎂': 'Birthday Cake','🚀': 'Rocket','📍': 'Round Pushpin'}
  }
];


async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <PostThread userId={String(userInfo._id)} emojis={EMOJI_DATA}/>
    </>
  );
}

export default Page;
