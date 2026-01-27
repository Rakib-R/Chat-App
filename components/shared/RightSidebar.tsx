'use client';

import React, { useEffect, useState } from 'react';
// 1. Import LazyMotion, m, and AnimatePresence
import { LazyMotion, m, AnimatePresence, domAnimation } from 'framer-motion';
import { completeOnboarding } from '@/lib/actions/cleanup.actions';

interface RightSidebarProps {
  isFirstTime: boolean;
  children: React.ReactNode;
}

export default function RightSidebar({ isFirstTime, children }: RightSidebarProps) {
  const [showWelcome, setShowWelcome] = useState(isFirstTime);

  useEffect(() => {
    if (isFirstTime) {
      completeOnboarding();
      const timer = setTimeout(() => setShowWelcome(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime]);

  return (
    // 2. Wrap with LazyMotion and provide domAnimations
    <LazyMotion features={domAnimation}>
      <div className='relative z-1 flex flex-col rounded-2xl w-1/4 h-full justify-center'>
        <AnimatePresence>
          {showWelcome && (
            // 3. Use m.div instead of motion.div
            <m.div 
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
              <m.h1 className="text-xl font-bold text-blue-800 p-4">
                Welcome to the App!
              </m.h1>
            </m.div>
          )}
        </AnimatePresence>
        <section className='flex w-full h-full mt-8 rounded-2xl'>
          {children}
        </section>
      </div>
    </LazyMotion>
  )
}