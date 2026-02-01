export const dynamic = "force-dynamic";

import { fetchPosts } from '@/lib/actions/thread.actions';
import ThreadCard from '@/components/cards/ThreadCard';

// CLERK ORGANIZATION
import { currentUser } from '@clerk/nextjs/server'
import Pagination from '@/components/shared/Pagination';
import { cleanupDatabase } from '@/lib/actions/cleanup.actions';
import { redirect } from 'next/navigation';

type PageProps = {
  params:Promise< { 
    [key: string]: string | string[] | undefined 
  }>;
  searchParams:Promise< { 
    [key: string]: string | string[] | undefined 
  }>;
};

//! Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));


async function Home ({ searchParams}:  PageProps) {
  const user = await currentUser();

   await delay(5000); 
 // FIX: If not logged in, send to sign-in (instead of returning null)
  if (!user) redirect("/sign-in");

  // VERY IMPORTANT CLEAN UP DATABASE FUNC
  //  DO NOT NEED IT 
  // await cleanupDatabase();
  
  const resolvedSearchParams = await searchParams;
  const page = resolvedSearchParams.page ? +resolvedSearchParams.page : 1;
  const result = await fetchPosts(page, 4) ;

    return (
    <main className='overflow-auto'>
       <section className='text-2xl h-inherit text-black text-center '>
        
        {result.posts.length == 0 ?  (
            <div className='flex gap-4 my-15'>
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
    </main>
  )
}

export default Home