
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';
import { formatDateString, truncateText } from '@/lib/utils';
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

    role,
    orgName,
    orgImg,
    orgId,
   
} : Props) => 
    {

    const headersList = await headers()
    const getPathName = headersList.get('x-pathname')
    const isThreadRoute = getPathName?.includes('thread')
    const isProfileRoute = getPathName?.includes('profile')    

   const showFullCommunityLink = !isComment && !isProfileRoute && Boolean(community);
    console.log('showFullCommunityLink' , showFullCommunityLink , '(community?)' ,Boolean(community?.name))
  return (
     <article className='flex w-156 flex-col my-8'>

        <div className={`flex p-4 gap-4 flex-row rounded-xl bg-slate-800 ${isComment ? "ml-4"  : ""}  `}>
             <div className='flex flex-col relative'>
                <Link href={`/profile/${author.id}`} className={` ? relative h-14 w-14 text-white: "" `} >
                    <Image src={author.image || ''} alt={''} 
                    width={`${isComment ? 40 : 70}`} height={`${isComment ? 40 : 70}`}
                    className='cursor-pointer rounded-full' priority/>
                </Link>  
                 <div className='flex self-center thread-card_bar absolute h-full w-0.5'>
                 </div>   
            </div>
            
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
        
        <div className='mt-4 flex flex-col gap-3'>
            <div className='flex gap-3.5'>
                {/* WILL IMPLEMENT THIS SOCIAL MEDIA FUNCTIONALITIES  */}

                <Link href={`/api/Liked/${author}${currentUserId}${id}`}> 
                    <Image src='/assets/heart-gray.svg' alt='social-media' 
                    width={24} height={24} 
                    className='object-contain cursor-pointer hover:padding-8 hover:drop-shadow-[0_0_30px_rgb(200,100,255)] transition-all duration-300 '></Image>
                </Link>    
                <Link href={`/thread/${id}?q=${community?.name}`}> 
                    <Image src='/assets/reply.svg' alt='social-media' width={24} height={24} className='object-contain cursor-pointer hover:drop-shadow-[0_0_18px_rgb(8,8,255)] transition-all duration-300'></Image>
                </Link>

                <Link href={`/api/Share/${author}${currentUserId}${id}`}>
                    <Image src='/assets/repost.svg' alt='social-media' 
                    width={24} height={24} className='object-contain cursor-pointer hover:drop-shadow-[0_0_18px_rgba(8,8,255)] transition-all duration-300'></Image>
                </Link>
                <Link href={''}>
                    <Image src='/assets/tag.svg' alt='social-media' width={24} height={24} className='object-contain cursor-pointer hover:drop-shadow-[0_0_18px_rgb(68,68,239)] transition-all duration-300'></Image>
                </Link>
            </div>
            
             {/* // ORGANIZATION INFO! */}
          
                {showFullCommunityLink ? (
                    <Link
                        href={`/community/${community?.id}`}
                        className="w-64 flex gap-2 items-center text-slate-300">
                        <p className="text-sm">{formatDateString(createdAt)}</p>
                        <div className="flex gap-2 items-center">
                        <p className="text-[14px]">{community?.name}</p>
                        <img
                            className='rounded-md'
                            src={community?.image}
                            alt={community?.name}
                            width={18}
                            height={18}
                        />
                        </div>
                    </Link>
                    ) : !isComment? (
                    <div className="w-64 flex gap-2 items-center text-slate-300">
                        <p className="text-sm">{formatDateString(createdAt)}</p>
                        {/* Optional: show name without link */}
                        {!isProfileRoute && (
                        <p className="text-[14px]">{community?.name}</p>
                        )}
                    </div>

                    ) :  ( 
                    <div>
                    </div>
                    )}

            {/* TO SHOW THIS IS NOT A COMMENT CAUSE COMMENT HAS NO PARENTID ! */}
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
            </div>
        </div>
    </div>
    </article>
  )
}

export default ThreadCard