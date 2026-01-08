import React from 'react'
import Image from 'next/image';

interface Props {
  accountId: string;
  authUserId: string;
  name: string;
  username: string;
  imgUrl: string;
  bio:string;
  type?: 'User' | 'Community'; 

}
const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    bio,
    imgUrl,
    type}
    : Props ) => 
      {
  return (
    <div className='flex p-4 h-fit flex-col items-start'>
      <div className="flex flex-col justify-between">
        <div className='flex items-center gap-3'>
          <div>
                <Image src={imgUrl} alt='Image' width={70} height={70} className='object-left rounded-full'/>
          </div>

        <div className='flex-1'>
          <h2 className='text-left'>{name}</h2>
          <p className='text-base'>@{username}</p>
        </div>
      </div>
        <p className='mt-6'>{bio}</p>

    </div>
   </div>
  )
}

export default ProfileHeader