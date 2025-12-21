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
import Experimental from "./Experimental_Profile_Pic";


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
        if (imgRes && imgRes[0].ufsUrl ) {
          values.profile_photo = imgRes[0].ufsUrl ;
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
        console.log('Error Occured : ', error.code, error.message)
        setError(error.message)
    }
  };

  // // CURRENTLY UNUSED
  // const handleImage = (
  //   e: ChangeEvent<HTMLInputElement>,
  //   fieldChange: (value: string) => void
  // ) => {
  //   e.preventDefault();
  //   const fileReader = new FileReader();

  //   if (e.target.files && e.target.files.length > 0) {
  //     const file = e.target.files[0];
  //     setFiles(Array.from(e.target.files));

  //     if (!file.type.includes("image")) return;
  //     fileReader.onload = async (event) => {
  //       const imageDataUrl = event.target?.result?.toString() || "";
  //       fieldChange(imageDataUrl);
  //     };
  //     fileReader.readAsDataURL(file);
  //   }
  // };

  return (
    <> 
    <Form {...form}>
      <form
        className='flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className='color-red-500 font-bold text-center w-full h-full'> 
          {error}
        </div>

        EXPERIMENTAL UPLOAD
  
            <Experimental /> 

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
                  className='account-form_input no-focus'
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
                  className='account-form_input no-focus'
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
                  className='account-form_input no-focus'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='bg-primary-500'>
          {btnTitle}
        </Button>
      </form>
    </Form>
</>

  );
};
