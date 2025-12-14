
import { currentUser} from '@clerk/nextjs/server'
import { fetchPosts } from '@/lib/actions/thread.actions';
import ThreadCard from '@/components/cards/ThreadCard';


type PageProps = {
  params:Promise< { 
    [key: string]: string | string[] | undefined 
  }>;
  searchParams:Promise< { 
    [key: string]: string | string[] | undefined 
  }>;
};
 async function Home ({params , searchParams}:  PageProps) {
  
  const user = await currentUser();
  if (!user) return null;

  console.log('%cuser at Root' , "color:green; font-size:15px; font-weight:bold", user.id)
  const result = await fetchPosts(1, 20) ;
  console.log('ROOT PROFILE ID ', params)

  // UNDERSTAND WHY  PARAMS.PAGE IS ERRORED OUT
  //   const result = await fetchPosts(
  //   params.page ? +params.page : 1,
  //   30
  // );
  return (
    <div className=' text-2xl text-black text-center'>
       <section>
        {result.posts.length == 0 ? (
          <p>No posts found.</p>
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
          </>
        ) 
      }
      </section>
    </div>
  )
}

export default Home