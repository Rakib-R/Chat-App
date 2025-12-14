"use server"

import React from 'react'
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/user.actions";
import Link from 'next/link';
import Image from 'next/image';

interface ActivityItem {
  _id: string;
  parentId: string,
  author: {
    _id : string;
    name : string;
    image: string;

  }; // Assuming getActivity returns objects with a parentId
  // You can add more properties here if your 'activity' object has them
}

const Page = async() => {
  
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id) as ActivityItem[];
  
  return (
    <section className='w-1/3'>
      <h1 className=''>Activity</h1>

    <section className='mt-10 flex flex-col gap-5 bg-gray-400'>
        {activity.length > 0 ? (
            <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>

                <article className='flex items-center gap-4 text-white'>
                       <Image className="rounded-full" src={activity.author.image} alt='Profile Pic' width={40} height={40} />
                      <p className=''> <span className='mr-1 text-violet-800'>{activity.author.name}</span> Replied to your post.</p>
                </article>
              </Link>
            ))} 
            </>
        ) : (
          <p className='text-white'> No activity yet !</p>
        )

        }
    </section>
    </section>
  )
}

export default Page