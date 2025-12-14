"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField, FormItem,  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { CommentValidation } from "@/lib/validations/thread";
import { Input } from "../ui/input";
import Image from "next/image";
import  {addComment2Thread}  from "@/lib/actions/thread.actions";


interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

export function Comment({threadId, currentUserImg, currentUserId}: Props) {

  const router = useRouter();
  const pathname = usePathname();

  //  SAME AS OTHER ONES !!
  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: " ",
         
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addComment2Thread({
      threadId,
      commentText: values.thread,
      userId:JSON.parse(currentUserId),
      path: pathname,
    });

    form.reset();
    router.push("/");
  };

  
  return (
     
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
        name='thread'
        render={({ field }) => (
          <FormItem className="w-156 flex gap-4 p-4">
            <FormLabel className='flex text-base-semibold items-center'> 
                <Image 
                src={currentUserImg}
                alt='Profile_image'
                width={40}
                height={40}
                className='rounded-full object-fit'
                    />
              
        </FormLabel>
        <FormControl className="">
          <Input className='border-2 p-4 border-gray-300 text-light-1 outline-none' type='text' placeholder="  ..Comment" {...field} />
        </FormControl>
        <FormMessage />
        <Button type='submit'>Reply</Button>

      </FormItem>
    )}
  />

      </form>
    </Form>
    );
}




