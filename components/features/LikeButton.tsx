
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { toggleLike } from '@/lib/actions/like.actions';


export default function LikeButton({
  currentUserId, 
  id,
  
}: {
  currentUserId: string;
  id: string;
}) {


  // USERID CONVERT TO DATABASE OBJECT ID
 

  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleClick = async () => {
    setAnimating(true);

    setTimeout(() => setAnimating(false), 300);
    
    // HANDLING LIKE SERVER FUNCTIONS
    setLiked(prev => !prev);
    await toggleLike(currentUserId, id);
  };


  return (
    <button
      onClick={handleClick}
      className="relative group"
    >
      <Image
        src={liked ? "/assets/heart-filled.svg" : "/assets/heart-gray.svg"}
        alt="like"
        width={24}
        height={24}
        className={`
          transition-all duration-300 ease-out
          cursor-pointer
          
          /* Hover */
          group-hover:scale-110
          group-hover:drop-shadow-[0_0_12px_rgba(255,0,120,0.6)]

          /* Click animation */
          ${animating ? "scale-125 -translate-y-1 rotate-[-15deg]" : ""}
        `}
      />
    </button>
  );
}
