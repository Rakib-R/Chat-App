"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";
import { unstable_cache } from 'next/cache';
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";

import { connectTODB } from "../mongoose";

interface params {
  id: string,
  name: string,
  image: string,
  description: string,
  createdById: string,
  members : [string]
  
}

export const createCommunity = unstable_cache(
  async ({ id, name, image, description, createdById, members }: params) => {
    try {
      await connectTODB();

      // Use .lean() here because we only need the ID and a POJO for the cache
      const community = await Community.findOneAndUpdate(
        { id: id },
        { id, name, image, description, createdById: createdById , 
          $addToSet: { members: createdById }
        },
        { upsert: true, new: true }
      );

      const communityId = community._id.toString();

      // Use .lean() for the user lookup to save memory/time
      const user = await User.findOne({ id: createdById });

      if (user) {
        await User.findByIdAndUpdate(
          user._id, // Pass the ID, not the whole object
          { $addToSet: { communities: communityId } },
          { new: true }
        );
      }

      // Return the plain object result, which is cache-friendly
      return community; 
    } catch (error) {
      console.error("Error creating community:", error);
      throw error;
    }
  },
  ['community-details'],
  { revalidate: 60 }
);

export async function fetchCommunityDetails(id: string) {
  try {
  await connectTODB();
    const communityDetails = await Community.findOne({ id }).populate([
      "createdById",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);

    return communityDetails;
  } catch (error) {
    console.error("Error fetching community details:", error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    connectTODB();

    const communityPosts = await Community.findById(id).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "author",
          model: User,
          select: "name image id", // Select the "name" and "_id" fields from the "User" model
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "image _id",
          },
        },
      ],
    });

    return communityPosts;
  } catch (error) {
    // Handle any errors
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
   await connectTODB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectTODB();

    const Commu_ = await Community.findOne({id : communityId})
    const User_ = await User.findOne ({id : memberId})


    // Find the community by its unique id
   const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { $addToSet: { members: User_._id } }, // Only adds if userId is NOT present
      { new: true }
    );

   if (!updatedCommunity) throw new Error("Community not found");
   
    User_.communities.push(Commu_._id);
    await User_.save();

    return updatedCommunity;
    
  } catch (error) {
    // Handle any errors
    console.error("Error adding member to community:", error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectTODB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error("User not found");
    }

    if (!communityIdObject) {
      throw new Error("Community not found");
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await User.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error("Error removing user from community:", error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectTODB();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error("Community not found");
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error("Error updating community information:", error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectTODB();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error("Community not found");
    }

    // Find all users who are part of the community
    const communityUsers = await User.find({ communities: communityId });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });
    await Promise.all(updateUserPromises);

    // Remove Thread's ASSOCIATION with COMMUNITY
     await Thread.updateOne(
      { communities: communityId }, 
      { $unset: { communities: "" } } // This removes the field entirely
      // { communities: null }        // This keeps the field but sets it to null
);

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}

// SPECIAL COMMUNITY CROSS CHECK WITH THREAD
// In your community.actions.ts

export async function _findCommunityByThreadAuthor(threadId: string) {
  try {
    connectTODB();
    
    // 1. Find the thread and get its author
    const thread = await Thread.findById(threadId).populate({
      path: "author",
      model: User,
      select: "id _id"
    })
    ;
    
    if (!thread) {
      throw new Error("Thread not found");
    }
    console.log('📝 Thread author:', thread.author);
    
    // 2. Find the community where this user is the admin (createdBy)
    const community = await Community.findOne({ 
      createdBy: thread.author._id  // Match the createdBy field with author's _id
    });
    
    if (!community) {
      console.log('❌ No community found where this user is admin');
      return null;
    }
    console.log('🏘️ Found community:', community.name, community.id);
    
    return community;
    
  } catch (error) {
    console.error("Error finding community by thread author:", error);
    throw error;
  }
}