"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";
import { useEffect, useState } from "react";


interface Props {
  userId: string;
}

export function PostThread({userId}: Props) {   
  const router = useRouter();
  const pathname = usePathname();


  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: " ",
      accountId: userId,    
    },
  });
  

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
      await createThread({
      text: values.thread,
      author: userId,
      // communityId: ,
      path: pathname,
    });

    router.push("/");
  };

  return (
     
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>

  <FormField
          control={form.control}
          name='thread'
          render={({ field }) => (
            <FormItem>
              <FormLabel className="my-8 text-xl">Content</FormLabel>
              <FormControl className=" border-gray-400 border-1 text-gray-900 font-mono">
                <Textarea rows={15} cols={73} placeholder='What do you want to talk about?' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='my-8' type='submit'>Create Thread</Button>
      </form>
    </Form>
    );
}


