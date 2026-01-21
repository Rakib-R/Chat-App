import { auth,currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import {AccountProfile} from "@/components/forms/AccountProfile"; 

async function Page() {
  const { isAuthenticated , sessionClaims}:any = await auth()

  const user = await currentUser();
  if (!user) return null; 
  
  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect("/");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo.image : user.imageUrl ,
  };

  // console.log('User' , user)
  // console.log('UserInfo ', userInfo)
  return (
    <main className='mx-auto bg-white rounded-md text-black flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text text-green-400'>Onboarding ...</h1>
      <p className='mt-3 font-medium'>
        Complete your profile now, to use <span className="onboarding_gradient">
                    ChatApp
                  </span>.
      </p>

      <section className='mt-8'>
        <AccountProfile user={userData} btnTitle='Continue' />
      </section>
    </main>
  );
}

export default Page;
