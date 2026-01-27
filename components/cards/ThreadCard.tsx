
import Link from 'next/link';
import React, { useState } from 'react'
import Image from 'next/image';
import { formatDateString, truncateText } from '@/lib/utils';
import { headers } from 'next/headers'
import { OrganizationMembership } from '@clerk/nextjs/server';
import SocialMedia from '../features/SocialMedia';

const fallbackUser = {name : 'No User', image : './nouser.jpg'};


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

    community?: {
        id: string;
        name: string;
        image : string
    };
    
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
    orgMembers?: OrganizationMembership[];
    joinedAt?:number
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
} : Props) => 
    {

    const headersList = await headers()
    const getPathName = headersList.get('x-pathname')
    const isThreadRoute = getPathName?.includes('thread')
    const isProfileRoute = getPathName?.includes('profile')    
    const showFullCommunityLink = !isComment && !isProfileRoute && Boolean(community);


  return (
     <main className='flex w-156 flex-col my-8'>

        <section className={`flex p-4 gap-4 flex-row rounded-xl bg-slate-800 ${isComment ? "ml-4"  : ""}  `}>
             <header className='flex flex-col relative'>
                <Link href={`/profile/${author.id}`} className={` ? relative rounded-2xl h-16 w-16 text-white: "" `} >
                <figure><Image src={author.image || ''} alt={''}width={`${isComment ? 40 : 80}`} height={`${isComment ? 40 : 80}`}
                    className='cursor-pointer aspect-square rounded-[2rem]' priority/>
                </figure>
                    
                </Link>  
                 <div className='flex self-center thread-card_bar absolute h-full w-0.5'>
                 </div>   
            </header>

            {/* CONTENT ! CONTENT ! CONTENT ! CONTENT ! CONTENT ! CONTENT !*/}
            <div className='flex flex-col items-start w-64'>
                <Link href={`/profile/${author.id}`} className='relative text-[18px]'>
                    <div className={` font-semibold cursor-pointer text-base w-full ${isComment ? "text-white" : "text-white"} `} > {author.name}</div>
                </Link>   
                <p className={`text-base text-pretty text-justify tracking-wide leading-relaxed ${isComment ? "text-white" : "text-white"} `}>
                    { isThreadRoute? (
                        <Link href={`/thread/${id}`}> 
                     {content }
                    </Link>
                    ) : (
                        <Link href={`/thread/${id}`}> 
                     {truncateText(content , 100)}
                    </Link>
                    )}                  
                 </p>
        
            <article className='mt-4 flex flex-col gap-3'>
            {/* SOCIAL MEDIA FEATURES  SOCIAL MEDIA FEATURES  SOCIAL MEDIA FEATURES */}
            <SocialMedia id={id.toString()} author={author.name} authorId={author.id.toString()} 
                community={community ? community.name.toString() : null} currentUserId={currentUserId} />

            {/* // ORGANIZATION INFO !  ORGANIZATION INFO !  ORGANIZATION INFO !*/}
        
        {showFullCommunityLink ? (
        <Link
            href={`/community/${community?.id}`}
            className="w-64 flex gap-2 items-center text-slate-300">
            <p className="text-sm">{formatDateString(createdAt)}</p>
            <div className="flex gap-2 items-center">
            <p className="text-[14px]">{community?.name}</p>
            <figure>
                   <img
                className='rounded-md'
                src={community?.image}
                alt={community?.name}
                width={18}
                height={18}
                />
            </figure>
            </div>
            </Link>
                ) : !isComment? (

                <div className="w-64 flex gap-2 items-center text-slate-300">
                    <p className="text-sm">{formatDateString(createdAt)}</p>
                    {/* Optional: show name without link */}
                    {!isProfileRoute && (<p className="text-[14px]">{community?.name}</p>)}
                    </div>
                ) :  ( 
                    <div>
                    </div>
                )}

            {/* TO SHOW THIS IS NOT A COMMENT CAUSE COMMENT HAS NO PARENT-ID ! */}

            {(!isThreadRoute || parentId ) &&
                <Link href={`/thread/${id}`}>
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
            </article>
        </div>
    </section>
    </main>
  )
}

export default ThreadCard