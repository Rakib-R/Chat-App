'use client'; // This file is now entirely Client-side

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { completeOnboarding } from '@/lib/actions/cleanup.actions';

export default function RightSidebar({ isFirstTime }: { isFirstTime: boolean }) {
  const [showWelcome, setShowWelcome] = useState(isFirstTime);

  useEffect(() => {
    if (isFirstTime) {
      // 1. Trigger the background update
      completeOnboarding();
      
      // 2. Hide the animation after 3 seconds
      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);

  return (
    <div className='relative flex flex-col rounded-2xl w-1/5 h-full justify-center'>
      <AnimatePresence>
        { showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.5, 
              ease: "easeInOut" 
            }}
            className="absolute top-0 mt-8 flex flex-col w-full items-center justify-center border-3
                rounded-lg bg-gray-300 px-3 py-2 shadow-[0_0_20px_rgba(79,70,229,0.5)] ring-1 ring-black/10"
          >
            <motion.h1 className="text-xl font-bold text-blue-800 p-4">
              Welcome to the App!
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      <section className='flex w-full h-full mt-8 bg-red-500 rounded-2xl'>ChatBox</section>
    </div>
  )
}