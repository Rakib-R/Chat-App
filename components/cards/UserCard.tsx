'use client'

import React from 'react'
import Image from 'next/image';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface Props {
 id : string;
 name : string;
 username: string;
 imgUrl : string;
 personType : string
}

const UserCard = ({id , name, username, imgUrl, personType} : Props) => {
  const router = useRouter()

    return (
    <div className='flex justify-between w-full'>
        <div className='user-card_avatar'>
            <Image 
                  src={imgUrl}
                  width={60}
                  height={60}
                  className='rounded-full' alt={''}   
                    />

        <div className='flex-1 text-ellipsis'>
            <h4 className='text-base'> {name} </h4>
           <p className='text-medium text-green-500'>@{username}</p>
        </div>
        </div>
        <Button className='' onClick={() => router.push(`/profile/${id}`)}>
             View                        
        </Button>
    </div>
  )
}

export default UserCard