
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Searchbar from "@/components/shared/Searchbar";
import Pagination from "@/components/shared/Pagination";

import CommunityCard from "@/components/cards/CommunityCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCommunities } from "@/lib/actions/community.actions";

async function Page({
  searchParams 
  }: { 
    searchParams: Promise<{ [key: string]: string | undefined }> 
  })
   {
  const user = await currentUser();
  const { q } = await searchParams;
  const {page } = await searchParams
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchCommunities({
    searchString:  q,
    pageNumber: page ? Number(page) : 1,
    pageSize: 25,
  });

  return (
    <>
    <section className='flex flex-col p-8 mt-9 w-[36rem] gap-8 rounded-2xl '>
      
      <div className="flex flex-row gap-8 w-full">
          <h1 className='head-text text-center text-xl self-center'>Communities</h1>
          <div className=''>
            <Searchbar routeType='communities' />
         </div>
      </div>
    
      {result.communities.length === 0 ? (
        <p className='no-result'>No Result</p>
      ) : (
        <>
          {result.communities.map((community) => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              username={community.username}
              imgUrl={community.image}
              bio={community.bio}
              members={community.members}
            />
          ))}
        </>
        )}
      </section>

      <Pagination
        path='community'
        pageNumber={page ? Number(page) : 1}
        isNext={result.isNext}
      />
    </>
  );
}

export default Page;
