
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import {AccountProfile} from "@/components/forms/AccountProfile"; 

async function Page() {

  const user = await currentUser();
  if (!user)  redirect("/sign-in");
  
  const userInfo = await fetchUser(user.id );
  
  // CHECK DATA BASE FOR ONBOARDING
  if (userInfo?.onboarded) redirect("/");

const userData = {
    id: user.id, // Clerk ID
    _id: userInfo?._id?.toString() || "",      // Required by your Interface
    username: userInfo ? userInfo?.username : user.username || "",
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo.image : user.imageUrl,
    onboarded: userInfo ? userInfo.onboarded : false, // Added missing field
  };
  
  // console.log('User' , user)
  // console.log('UserInfo ', userInfo)
  return (
    <main className='relative flex rounded-md text-black 
                  flex-col gap-14 justify-start px-10 py-20 bg-white/90'>
      <section className="flex-[1_1_10dvh]">
        <h1 className='head-text text-green-400'>Onboarding ...</h1>
        <p className='mt-3 font-medium'>
          Complete your profile now, to use <span className="onboarding_gradient">
                      ChatApp
                    </span>.
        </p>
      </section>

        <AccountProfile user={userData} btnTitle='Continue' />

    </main>
  );
}

export default Page;
