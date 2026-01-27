export const dynamic = 'force-static';
export const revalidate = 3600;

import React from 'react';
import Image from 'next/image';
import { realisticPhrases } from '@/constants';


async function getCachedUsers() {
  // Fetching 7 users at once (RandomUser API supports the ?results= parameter)
  const res = await fetch('https://randomuser.me/api/?results=10&seed=my-seed', {
    next: { revalidate: 3600 },
    cache: 'force-cache',
  });
  const data = await res.json();
  return data.results;
}

export default async function Chats() {
  const users = await getCachedUsers();

  return (
    <main className='flex z-1 flex-col w-full bg-red-100 min-h-screen overflow-auto'>
      <input type="text" placeholder="Search chats..." className='bg-red-600 p-2 text-white placeholder:text-red-200 outline-none'/>
      
      <div className="flex flex-col divide-y divide-red-200">
        {users.map((user: any, index: number) => (
          <section key={user.login.uuid} className='flex p-4 gap-3 items-center hover:bg-red-200 transition-colors'>
            {/* Wrapper to prevent image stretch */}
            <div className="flex-none">
              <Image 
                src={user.picture.large} 
                alt={user.name.first} 
                width={60} 
                height={60} 
                className='rounded-full object-cover border-2 border-white'
              />
            </div>

            <figure className="flex-1 min-w-0">
              <h1 className='font-bold text-gray-900 truncate'>
                {user.name.first} {user.name.last}
              </h1>
              <p className='text-sm text-gray-600 truncate'>
                {realisticPhrases[index % realisticPhrases.length]}
              </p>
            </figure>

            <time className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(user.registered.date).toLocaleDateString()}
            </time>
          </section>
        ))}
      </div>
    </main>
  );
}