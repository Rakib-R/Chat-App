export const dynamic = "force-dynamic";

import { fetchPosts } from '@/lib/actions/thread.actions';
import ThreadCard from '@/components/cards/ThreadCard';

// CLERK ORGANIZATION
import { currentUser, User } from '@clerk/nextjs/server'
import { getUserOrganizations } from "@/app/organization";
import Pagination from '@/components/shared/Pagination';
import { cleanupDatabase } from '@/lib/actions/cleanup.actions';

type PageProps = {
  params:Promise< { 
    [key: string]: string | string[] | undefined 
  }>;
  searchParams:Promise< { 
    [key: string]: string | string[] | undefined 
  }>;
};


async function Home ({ searchParams}:  PageProps) {

  const user = await currentUser();
  if (!user) return null;

  // VERY IMPORTANT CLEAN UP DATABASE FUNC
  // await cleanupDatabase();
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? +resolvedSearchParams.page : 1;
  const result = await fetchPosts(page, 4) ;

    return (
    <div >
       <section className='text-2xl h-inherit text-black text-center'>
        
        {result.posts.length == 0 ?  (
            <div className='flex gap-4 my-8'>
              <p>No posts found. Please Create some  </p>
              <img src="/post.png" alt="Post" width={80} height={80}/>
            </div>
        ) :
        (
          <>
          {result.posts.map((post) => (
            <ThreadCard key={post._id}
              id={post._id}
              currentUserId={user?.id}
              parentId={post.parentId}
              content={post.text}
              author={post.author}
              community={post.community}
              createdAt={post.createdAt}
              comments={post.children}

            />
          ))}
          <Pagination 
            pageNumber={page} 
            isNext={result.isNext}
            path= {''}
         />
          </>
        ) 
      }
      </section>
    </div>
  )
}

export default Home