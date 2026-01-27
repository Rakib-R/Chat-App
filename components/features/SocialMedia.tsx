'use client'

import React, { useState } from 'react'
import LikeButton from '../features/LikeButton';
import Reusable from '../features/Reusable'
import Link from 'next/link';


interface SocialMediaProps {
  id: string; // threadId
  currentUserId: string;
  author: string;
  authorId: string;
  community?: string | null;

}

const SocialMedia = ({author, id, currentUserId, community, authorId} : SocialMediaProps) => {

  return (
    <main>
        <section className='flex gap-3.5'>

            {/* WILL IMPLEMENT ONLY LIKE FEATURE  */}
            <LikeButton currentUserId={currentUserId} id={id} />

            {/* WILL IMPLEMENT REPLY FEATURE  */}
        <Link href={`/thread/${id}?q=${community}`}
            className='inline-flex items-center justify-center'>  
            <Reusable
                src="/assets/reply.svg"
                alt="reply"
                glow="drop-shadow-[0_0_12px_rgba(8,8,255,0.6)]"
            />
        </Link>
            {/* WILL IMPLEMENT SHARE FEATURE  */}
          <Reusable
                src="/assets/repost.svg"
                alt="reply"
                glow="drop-shadow-[0_0_12px_rgba(8,8,255,0.6)]"
            />

            {/* WILL IMPLEMENT TAG FEATURE  */}
            <Reusable
                src="/assets/reply.svg"
                alt="reply"
                glow="drop-shadow-[0_0_12px_rgba(8,8,255,0.6)]"
            />
        </section>

    </main>
  )
}

export default SocialMedia