"use server"
import { connectTODB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { revalidatePath } from "next/cache";


interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

export async function createThread({ text, author, communityId, path }: Params
) {
  try {
    connectTODB();
          // Alternative And Co-Pilot Approved waY
          // const communityIdObject = await Community.findById(communityId); 
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const created_Thread = await Thread.create({
      text,
      author,
      community: communityIdObject ? communityIdObject._id : null,
      // path
    });

    await User.findByIdAndUpdate(author , {
      $push : {threads: created_Thread._id}
    })

    if (communityIdObject) {
      await Community.findByIdAndUpdate(communityIdObject , {
        $push : {threads : created_Thread._id}
      })
    }
    
    revalidatePath(path)
  }
  catch (error) {
    console.error("Error Creating THREADs:", error);
    throw error;
  } 
}


export async function fetchPosts(pageNumber = 1 , pageSize = 6){
  connectTODB();

  const skipAmout = (pageNumber - 1 ) * pageSize;
  const postQuery = Thread.find({parentId : {$in : [null , undefined]}})
  .sort({createdAt: 'desc'})
  .skip(skipAmout)
  .limit(pageSize)
  .populate({path: 'author', model: User})
  .populate({
    path: 'children',
    populate: {
      path: 'author',
      model: User,
      select: '_id name parentId image'
    }
  })
  const totalPostsCount = await Thread.countDocuments({parentId:{$in: [null, undefined]}})

  const posts = await postQuery.exec()
  const isNext = totalPostsCount > skipAmout + posts.length;
  return {isNext, posts}
}

export async function fetchThreadById(id: string){
  connectTODB();

  try{
    const thread = await Thread.findById(id)
    .populate({
      path: 'author',
      model: User,
      select: "_id id name image"
    })
    .populate({
      path: 'children',
      populate :
      // [
       { path: 'author',
        model:  User,
        select: "_id id name parentId image"
      },
      // I DONT THINK THIS RECURSION NECCESSARY
      // { 
      //   path: 'children',
      //   model: Thread,
      //   populate: {
      //     path: 'author',
      //     model: User,
      //     select: '_id id name parentId image'
      //   }
      // }
    // ]
    }).exec();
      return thread;
  }

  catch (error){
      throw new Error('ERROR ERROR ERROR fetchThreadById')
  }
}


export async function addComment2Thread(
 { threadId ,
  commentText ,
  userId,
  path,}
  :
  {threadId : string,
    commentText: string,
    userId: string,
    path: string
  } 
)

{
  connectTODB();
    try {
      const originalThread = await Thread.findById(threadId);
    
    if(!originalThread){
      throw new Error('ERROR in Original THread') 
    }

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId
    })

    const savedCommentThread = await commentThread.save();
    originalThread.children.push(savedCommentThread._id)
   
    await originalThread.save()
    revalidatePath(path);

    }
   
    catch (error){
      console.log('AddComment2thred Error ', error)
    }
}