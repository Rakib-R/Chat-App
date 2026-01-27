"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from 'next/dynamic';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

// UTILS
import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";


interface Props {
  user:{
  _id: string;
  id: string; // clerk id
  objectId?: string;
  username: string ;
  name: string;
  bio?: string;
  image?: string;
  onboarded: boolean;
}
  btnTitle: string;
}

//DYNAMIC IMPORT
const Experimental_Profile_Pic = dynamic(
  () => import('./Experimental_Profile_Pic'),
  { 
    ssr: false,
  }
);

export const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [error , setError] = useState('')

  const form = useForm<z.infer<typeof UserValidation>>({
    
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username : user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
    mode: "onChange"
  });
    // ERROR RETRY LOGIC ERROR RETRY LOGIC ERROR RETRY LOGIC
    const handleRetry = () => {
    const values = form.getValues();
      console.log('B4 sessionStorage Retrying')

    sessionStorage.setItem(
      "account-profile-form",
      JSON.stringify(values)
    );
    window.location.reload();
  };
      console.log('After sessionStorage Retrying')

    useEffect(() => {
    const stored = sessionStorage.getItem("account-profile-form");

    if (stored) {
      const values = JSON.parse(stored);
      form.reset(values);
    }
}, [form]);

  const onSubmit = async (values: z.infer<typeof UserValidation> ) => {
    try {
      
    await updateUser({
      userId: user.id,
      name: values.name,
      path: pathname,
      username: values.username,
      bio: values.bio,
      image: values.profile_photo,
    });

      sessionStorage.removeItem("account-profile-form");
    
    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  }
    catch(error: any) {
        console.log('Error Occured at Acc Profile: ', error.code, error.message)
        setError(error.message)
    }
  };

  return (
    <main className="h-[100dvh]">
      {error && (
      <aside className='absolute top-0 left-0 px-0 py-20 w-full flex-[1_1_10dvh] bg-slate-600'>
          <div className=" flex gap-4 items-center bg-red-500/10 border break-words border-red-500/50 p-3 
          rounded-lg animate-in fade-in zoom-in duration-300">
          <span className="text-red-500 text-sm font-medium">⚠️ {error}</span>
            <Button
            type="button"
            onClick={handleRetry}
            className="border-red-500/50 hover:bg-red-500/10 text-red-500 h-8"
          >
            Retry
          </Button>
        </div>
      </aside>
     
          )} 
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-8 font-roboto'
        onSubmit={form.handleSubmit(onSubmit)}
        >
    <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className=''>  
            <FormControl>
              {/* UPLOADTHING TO UPLOAD YOUR PHOTOS ! */}
            <Experimental_Profile_Pic 
             initialImage={field.value}
              onChange={field.onChange}
              setParentError={setError}
            />
              </FormControl>
            </FormItem>
          )}
        /> 
        
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='font-semibold'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input'
                  {...field}
                />
              </FormControl>
              {/* ADD THE ERROR MESSAGE HERE */}
                <FormMessage className="animate-fadeIn duration-200 text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='font-semibold '>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input '
                  {...field}
                />
              </FormControl>
              <FormMessage className="animate-fadeIn duration-200 text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='font-roboto font-semibold'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  className='account-form_input '
                  {...field}
                />
              </FormControl>
              <FormMessage className="animate-fadeIn duration-500 text-red-500" />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-black '>
          {btnTitle}
        </Button>
      </form>
    </Form>
</main>

  );
};
