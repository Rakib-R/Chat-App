
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'

type props =  {
  params: Promise<{ 
      author: string,
      userId: string,
      id: string 
  }>
}  

const Liked = async ({ params } : props) => {

  const user = await currentUser();
  const { author, userId, id } = await params;

  return (
    <div>
      <h1>Liked by {author}</h1>
    </div>
  )
}

export default Liked