"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { isBase64Image } from "@/lib/utils";
import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";

// UPLOADTHING
import { useUploadThing } from "@/lib/uploadthing";
import Experimental_Profile_Pic from "./Experimental_Profile_Pic";
import "@uploadthing/react/styles.css";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}


export const AccountProfile = ({ user, btnTitle }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [files, setFiles] = useState<File[]>([]);
  const [error , setError] = useState('')
  
  const { startUpload } = useUploadThing("media");
  const form = useForm<z.infer<typeof UserValidation>>({
    
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username : user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof UserValidation> ) => {
    try {
      const blob = values.profile_photo;
      
      const hasImageChanged = isBase64Image(blob);
      if (hasImageChanged) {
      // Make SURE Image files is not empty before calling startUpload
        if (files.length === 0) return;
        
        const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].ufsUrl) {
        values.profile_photo = imgRes[0].ufsUrl;
        }
      }
      // UPDATE OR CREATE USER IF-NOT EXISTS AFTER ON SUBMIT

    await updateUser({
      userId: user.id,
      name: values.name,
      path: pathname,
      username: values.username,
      bio: values.bio,
      image: values.profile_photo,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  }
    catch(error: any) {
        console.log('Error Occured at AccProfile: ', error.code, error.message)
        setError(error.message)
    }
  };

  // // CURRENTLY UNUSED
  return (
    <> 
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-10 text-blue-800 font-semibold'
        onSubmit={form.handleSubmit(onSubmit)}
        >
    {error && (
      <main className="absolute bg-amber-300 -ml-16 w-[512px]">
          <div className="absolute bg-slate-600 w-full -mt-36 h-20"></div>
           <div className="absolute -mt-36 flex items-center bg-red-500/10 border break-words border-red-500/50 p-3 rounded-lg animate-in fade-in zoom-in duration-300">
          <span className="text-red-500 text-sm font-medium">⚠️ {error}</span>
          <Button 
            type="button"
            onClick={() => setError('')} // This clears the error so they can try again
            className="border-red-500/50 hover:bg-red-500/10 text-red-500 h-8"
      >
        Retry
      </Button>
        </div>
      </main>
     
          )}
    <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className=''>  
            <FormControl>
            <Experimental_Profile_Pic 
              onChange={field.onChange} 
              setFiles={setFiles} 
              initialImage={field.value}
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
              <FormLabel className='text-base-semibold text-light-2'>
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus text-white'
                  {...field}
                />
              </FormControl>
              {/* ADD THE ERROR MESSAGE HERE */}
                <FormMessage className='text-red-500' />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type='text'
                  className='account-form_input no-focus text-white'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='bio'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className='account-form_input no-focus text-white'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-black '>
          {btnTitle}
        </Button>
      </form>
    </Form>
</>

  );
};
