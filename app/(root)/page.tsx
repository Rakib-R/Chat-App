
import { fetchPosts } from '@/lib/actions/thread.actions';
import ThreadCard from '@/components/cards/ThreadCard';

// CLERK ORGANIZATION
import {auth, currentUser, clerkClient, Organization, } from '@clerk/nextjs/server'
import { createCommunity } from "@/lib/actions/community.actions";
import { fetchUser } from '@/lib/actions/user.actions';

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
  const { orgId, orgRole } = await auth();

  const result = await fetchPosts(1, 20) ;
  const userInfo = await fetchUser(user.id)

  // **** ORGANIZATION FETCHING  ****

  const isAdmin = orgRole === "org:admin"; 
  const isMember = orgRole === "org:member";

    if(!orgId || !orgRole){
    return <p> No organization Attributes found</p>
  }

  const client = await clerkClient();
  // TypeScript now knows orgId is a string inside this block
  const org: Organization = await client.organizations.getOrganization({ 
    organizationId: orgId 
    });

    // ORGANIZATION MEMBERSSS
     const memberships = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
    limit: 10, 
      });

    const members = memberships.data;

    // ORGANIZATION USER DETAILS
    let orgDetails = org;

    if (orgId && orgDetails) {
    await createCommunity(
      {
      id : orgId,
      name: orgDetails.name,
      username: orgDetails.slug || orgDetails.name.toLowerCase().replace(/\s+/g, ""),
      description: userInfo.bio,
      image: orgDetails.imageUrl,
      createdById :user.id }
    );
}
    console.log('%cMembers', 'font-size:14px; color:green', members , orgDetails?.id) 
  
    return (
    <div className=' text-2xl text-black text-center'>
       <section>
        {result.posts.length == 0 ?  (
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

              orgId={orgId}
              role={isAdmin || isMember}
              orgName={orgDetails.name}
              orgImg={orgDetails.imageUrl as string}
              orgMembers={members}
              
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