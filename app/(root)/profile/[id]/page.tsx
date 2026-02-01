"use server"

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "@/components/shared/ProfileHeader";
import {Tabs, TabsContent, TabsTrigger, TabsList} from "@/components/ui/tabs"
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";

async function Page({params} :Readonly <{params:Promise <{id : string}>}>

) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <section className="flex flex-col gap-8 w-156 mt-6">
      <ProfileHeader 
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image!}
        bio={userInfo.bio!}
  />
      <div className="mt-8">
        <Tabs defaultValue="threads" className='w-full'>
            <TabsList className="tab w-full">
              {profileTabs.map((tab) =>( 
                <TabsTrigger key={tab.label} value={tab.value} className="tab">
                    <Image src={tab.icon} alt= {tab.label}width={24} height={24} className="object-contain"
                    />
                  {tab.label === 'Threads' && (<p className=" rounded-sm bg-red-200 px-6 py-1">
                    {userInfo?.threads?.length} </p> )}
                  </TabsTrigger> 
                    ))}
              </TabsList>

           {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full"> 
                 <ThreadsTab currentUserId={user.id} accountId={userInfo.id} accountType='User'
                 />
            </TabsContent>
           ))}
          </Tabs>
      </div> 
    </section>
  );
}

export default Page;
