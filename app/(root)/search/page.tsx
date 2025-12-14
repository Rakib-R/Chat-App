"use server"

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
import React from 'react'
import UserCard from "@/components/cards/UserCard";


const page = async() => {
  
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchUsers({
    userId : user.id,
    searchString: "",
    pageNumber: 1,
    pageSize : 25
  });

  return (
    <div className="w-1/3">

      <div className="mt-14 flex flex-col gap-8 ">
         {result.users.length === 0 ? (
          <p className="">No Users</p>
         ) :
          (<>
          {result.users.map((person) => (
            <UserCard 
             key={person.id}
             id={person.id}
             name={person.name}
             username={person.username}
             imgUrl={person.image}
             personType= 'User'
            />
            
          ))}
          </>)
         }
      </div>
    </div>
  )
}

export default page