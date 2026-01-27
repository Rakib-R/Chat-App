"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectTODB } from "../mongoose";
import { Types } from "mongoose";

export interface IUser {
  _id: string;
  id: string;
  username: string;
  name: string;
  bio?: string;
  image?: string;
  onboarded: boolean;
  threads: Types.ObjectId[]; // single or array
}


export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
  await connectTODB();
    
  const updateUser =  await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true,
       }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }

  console.log('User Created BEFORE new Promise ')
   return updateUser;

  } catch (error: any) {
    // 🔥 DUPLICATE KEY (username, email, etc.)
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue)[0];

      //// these funcking erroes doesnt show up 🐦🦈 🐦🦈 !!!
      throw new Error(
        field === "username"
          ? "Username already taken"
          : "Duplicate value detected"
      );
    }

    // fallback
    throw new Error("Failed to update user");
  }
}


export async function fetchUser(userId: string, ): Promise<IUser | null>  {
  try {
    await connectTODB();

    const user = await User.findOne({ id: userId })
      .populate({
          path: "communities",
          model: Community, // Ensure you import Community model
        }); // You don't even need .lean() if you use the trick below

    if (!user) return null;

    // 🔨 THE FIX: This converts all ObjectId classes to Strings automatically
    return JSON.parse(JSON.stringify(user));

  } catch (error: any) {
    throw new Error(`Failed to fetch User: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function fetchUserPosts(userId: string) {
  try {
   await connectTODB();
    const threads = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "name image id", 
          },
        },
      ],
    });
    return threads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

// SIMILAR TO Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
   await connectTODB();
    const skipAmount = (pageNumber - 1) * pageSize;

    // CASE INSENSITIVE REG
    const regex = new RegExp(searchString, "i");
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };
    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;
    return { users, isNext };

  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getActivity(userId: string) {
  try {
   await connectTODB();

    const userThreads = await Thread.find({ author: userId });
    const childThreadIds_original = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Consider using Array.from(new Set(childThreadIds)) to deduplicate.
    const childThreadIds = Array.from(new Set(childThreadIds_original))

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, 
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }

}

  export async function deleteUser(userId : string ) {

    try{
      await connectTODB();

    // 1️⃣ Fetch the user first
    const user = await User.findOne({ id: userId });
    if (!user) return;

    const fallback = {
      name: "Deleted User",
      image: "/nouser.jpg",
      username: "deleted_user",
      bio: user.bio ?? "",
    };

    // 2️⃣ Update threads: keep original threads but store fallback
    await Thread.updateMany(
      { author: userId },
      {
        $set: {
          author: null,
          authorFallback: fallback,
        },
      }
    );

    // 3️⃣ Update communities: update member fallback
    await Community.updateMany(
      { "members.user": userId },
      {
        $set: {
          "members.$[m].fallback": fallback,
          "members.$[m].user": null,
        },
      },
      {
        arrayFilters: [{ "m.user": userId }],
      }
    );

    // 4️⃣ Delete the user
    await User.deleteOne({ id: userId });


    console.log(`User ${userId} deleted, threads and communities updated with fallback.`);
    }
    catch(error){
    console.log('Failed To Delete User', error)
    }
  } 