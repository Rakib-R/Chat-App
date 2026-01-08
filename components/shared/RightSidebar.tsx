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
    <div className='flex w-1/5 h-min justify-center'>
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
            className="flex w-full items-center justify-center border-2 rounded-lg mt-8 bg-amber-400/70 z-[9999] "
          >
            <motion.h1 className="text-xl font-bold text-blue-800 p-4">
              Welcome to the App!
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}