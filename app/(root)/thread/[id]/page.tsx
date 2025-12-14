import ThreadCard from '@/components/cards/ThreadCard'
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { fetchThreadById } from '@/lib/actions/thread.actions'
import { Comment } from '@/components/forms/Comments'

const  Page = async ({params} :Readonly< { params : Promise<{ id : string }>;
  }>) => {

  const user = await currentUser();
  const {id}  = await params;
  if (!user) return null

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding')

  const post = await fetchThreadById(id)

  return (
    <section className='relative'> 
      <ThreadCard key={post._id}
          id={post._id}
          currentUserId={user?.id}
          parentId={post.parentId}
          content={post.text}
          author={post.author}
          community={post.community}
          createdAt={post.createdAt}
          comments={post.children}
          isComment ={false}
              />
              
      <div className='flex flex-col gap-4'>
          <Comment threadId={post.id} currentUserImg={userInfo.image} currentUserId={JSON.stringify(userInfo._id)}/>
      </div> 

      <div className='mt-10'>
        {post.children.map((childItem: any) => (

        <ThreadCard key={childItem._id}
              id={childItem._id}
              currentUserId={childItem?.id}
              parentId={childItem.parentId}
              content={childItem.text}
              author={childItem.author}
              community={childItem.community}
              createdAt={childItem.createdAt}
              comments={childItem.children}
              isComment ={true}

                  />
        ))}
      </div>
    </section>
  )
}

export default Page