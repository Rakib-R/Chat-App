"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const createMeeting = (mode: string) => {
    const roomId = uuidv4();
    router.push(`/room/${roomId}?mode=${mode}`);
  };

  const openCall = () => {
    setIsOpen(!isOpen);
  };

  // Animation Variants
  const menuVariants = {
    hidden: { 
      opacity: 0, 
      y: -10, // Starts slightly higher (closer to the main button)
      transition: { 
        when: "afterChildren", // Animate children out before hiding container
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        when: "beforeChildren", // Show container then animate children
        staggerChildren: 0.1 // Delay between Audio and Video appearing
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 }, // Start invisible and shifted up
    visible: { opacity: 1, y: 0 }   // End visible and natural position
  };

  return (
    <aside className="flex flex-col relative items-center justify-center text-white gap-4">
      
      {/* Main Call Button */}
      <button 
        onClick={openCall}
        className="z-10 rounded-xl hover:cursor-pointer bg-indigo-600 px-6 py-4 font-bold transition-all hover:bg-indigo-700 hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.5)]"
      >
        Call
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={menuVariants}
            className='flex absolute mt-40'
          >
            {/* Audio Button */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='flex gap-2 z-40 bg-indigo-900 p-4 rounded-lg hover:cursor-pointer border border-indigo-500/30 backdrop-blur-sm'
              onClick={() => createMeeting('audio')}
            >
              <span>🎙️</span> 
              <span>Audio</span>
            </motion.div>

            {/* Video Button */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className='flex gap-2 z-40 bg-indigo-900 p-4 rounded-lg hover:cursor-pointer border border-indigo-500/30 backdrop-blur-sm'
              onClick={() => createMeeting('video')}
            >
              <span>📹</span>
              <span>Video</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </aside>
  );
}