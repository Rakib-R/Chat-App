
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { formatDateString } from '@/lib/utils';
import { headers } from 'next/headers'
import { OrganizationMembership } from '@clerk/nextjs/server';


interface Props {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    author: {
        id: string;
        name: string;
        image : string,

    };
    community: {
        id: string;
        name: string;
        image : string
    }  ;
    
    createdAt: string;
    comments: {
        author: {
            image: string;
        };
    }[];
    isComment?: boolean;

    orgId?: string;
    orgName?: string;
    orgImg?: string;
    role?: string | boolean;
    orgMembers: OrganizationMembership[];
   
}

const ThreadCard = async ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment,

    role,
    orgName,
    orgImg,
    orgId,
    orgMembers
} : Props) => 
    {

        const headersList = await headers()
        const getPathName = headersList.get('x-pathname')
        const isThread = getPathName?.includes('thread')

  return (
     <article className='flex w-156 flex-col my-8'>

        <div className={`flex p-4 gap-4 flex-row rounded-xl bg-gray-800 ${isComment ? "ml-4"  : ""}  `}>
             <div className='flex flex-col relative'>
                <Link href={`/profile/${author.id}`} className={` ? relative h-14 w-14 text-white: "" `} >
                    <Image src={author.image || ''} alt={''} width={`${isComment ? 40 : 70}`} height={`${isComment ? 40 : 70}`}  className='cursor-pointer rounded-full' />
                </Link>  
                 <div className='flex self-center thread-card_bar bg-white absolute h-16 w-0.5'>
                 </div>   
            </div>
            
            <div className='flex flex-col items-start gap-3 w-64'>
                <Link href={`/profile/${author.id}`} className='relative text-[18px]'>
                    <div className={` font-semibold cursor-pointer text-base w-full ${isComment ? "text-red-500" : "text-white"} `} > {author.name}</div>
                </Link>   
                <p className={`text-base  ${isComment ? "text-red-500" : "text-white"} `}>
                    <Link href={`/thread/${id}`}> 
                     {content}
                    </Link>

                 </p>
            
            <div className='mt-4 flex flex-col gap-3'>
                <div className='flex gap-3.5'>
                    {/* WILL IMPLEMENT THIS SOCIAL MEDIA FUNCTIONALITIES  */}
                    <Image src='/assets/heart-gray.svg' alt='social-media' width={24} height={24} className='object-contain cursor-pointer'></Image>
                    <Link href={`/thread/${id}?q=${orgName}`}> 
                        <Image src='/assets/reply.svg' alt='social-media' width={24} height={24} className='object-contain cursor-pointer'></Image>
                    </Link>
                    <Image src='/assets/repost.svg' alt='social-media' width={24} height={24} className='object-contain cursor-pointer'></Image>
                    <Image src='/assets/share.svg' alt='social-media' width={24} height={24} className='object-contain cursor-pointer'></Image>
                </div>

                {(!isThread || parentId ) &&
                    <Link href={`/thread/${id}?q=${orgName}`}>
                    <div className='mt-1 text-white text-sm'>
                    {comments.length === 0 ? '' 
                        : 
                        <div className='flex gap-4'>
                        <Image src='/down.png' alt={'Down'} width={20} height={20}/>
                        <p> {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}</p>
                        </div>
                    }
                    </div>
                </Link>
                }
                </div>
             </div>

             {!isComment && (
                <Link href={`community/${orgId}`} className='mt-5 flex items-center text-white'>
                <p className='text-sm'>{formatDateString(createdAt)}<br /> {orgName} </p>
            
                </Link>
             )}
         </div>
    </article>
  )
}

export default ThreadCard