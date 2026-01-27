"use server"
import { connectTODB } from "../mongoose";

import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { revalidatePath } from "next/cache";
import Tag from "@/lib/models/tag.model";


interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

// DELETE EXTRA THREAD IN CLEANUP.ACTIONS
export async function createThread({ text, author, communityId, path }: Params
) {
  try {
   await connectTODB();
          // Alternative And Co-Pilot Approved waY
          // const communityIdObject = await Community.findById(communityId); 
    const Community_ = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const created_Thread = await Thread.create({
      text,
      author,
      community: Community_ ? Community_._id : null,
      // path
    });

    await User.findByIdAndUpdate(author , {
      $push : {threads: created_Thread._id}
    })

    if (Community_) {
      await Community.findByIdAndUpdate(Community_ , {
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

//CHECK THE PAGE IN THE COMPONENT !
export async function fetchPosts(pageNumber= 1 , pageSize : number){
 await connectTODB();

  const skipAmout = (pageNumber - 1 ) * pageSize;
  const postQuery = Thread.find({ 
      parentId : {$in : [null , undefined]},
       author: { $ne: null }
    })
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
  }).populate({
    path:'community',
    model: Community,
    select: '_id id name image'
  })
  const totalPostsCount = await Thread.countDocuments({parentId:{$in: [null, undefined]}})
  
  const posts = await postQuery.exec()  
  const isNext = totalPostsCount > skipAmout + posts.length;
  return {isNext, posts}
}

export async function fetchThreadById(id: string){
 await  connectTODB();

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
    }).populate({
      path: 'community',
      model : Community,
      select : '_id id name createdById image'
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
 await connectTODB();
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

// DELETE THREAD
 export const deleteThread = async ({
  threadId,
   communityId}: { threadId: string; userId?: string; communityId?: string}) => {

    // THREAD GETS DELETED FROM USER
    const User_thread = await User.findOne({threads : threadId});
     User_thread.threads.$pull(threadId);
     User_thread.save();

    const Community_thread = await Community.findOne({threads : threadId});
        Community_thread.threads.$pull(threadId);

    // COMMUNITY ALSO TORE REFERENCE WITH THREAD
    await Community.updateOne(
      { _id: communityId },
      { $pull: { threads: threadId } }
    );
    await Thread.deleteOne({ _id: threadId });
    await Thread.deleteMany({ parentId: threadId });

  };


  export async function tagUsersInThread(
  threadId: string,
  authorId: string,
  usernames: string[]
) {
  if (!usernames.length) return;

  const users = await User.find({
    username: { $in: usernames },
  }).select("_id");

  if (!users.length) return;

  const tags = users.map(user => ({
    thread: threadId,
    mentionedUser: user._id,
    mentionedBy: authorId,
  }));

  await Tag.insertMany(tags);
}