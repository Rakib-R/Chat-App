"use client";

import * as z from "zod";
import { useState } from "react"; // 1. Import useState
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
import {Tabs, TabsContent, TabsTrigger, TabsList} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.actions";

// TYPES EMOJI
 type EmojiList = {
  [key: string]: string | undefined;
};

 interface EmojiCategory {
  label: string;
  list: EmojiList;
}

interface Props {
  userId: string;
  emojis : EmojiCategory[]
}

const MAX_CHAR_COUNT = 500;

export function PostThread({ userId , emojis }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPosted, setIsPosted] = useState(false); 

  
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });
  const { isSubmitting } = form.formState;

  // 2. Watch the input in real-time
  const threadContent = form.watch("thread");
  const currentCount = threadContent ? threadContent.length : 0;

  // 3. Helper to determine counter color
  const getCounterColor = () => {
    if (currentCount >= MAX_CHAR_COUNT) return "text-red-600 font-bold animate-pulse";
    if (currentCount >= MAX_CHAR_COUNT * 0.9) return "text-orange-500 font-semibold"; // 90% full
    return "text-gray-400";
  };


  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    try {
      await createThread({
        text: values.thread,
        author: userId,
        communityId: "",
        path: pathname,
      });

      setIsPosted(true);

      // Brief delay so they can actually see the "Posted!" message before redirect
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      console.error("Failed to post thread:", error);
    }
  };

  return (
    <div className="relative mt-4">
   
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
           {/* Hidden dummy field to "eat" the browser's autofill */}
            <input type="text" name="hidden" style={{ display: 'none' }} autoComplete="off" />
          <FormField
            control={form.control}
            name="thread"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="my-6 text-xl">Content</FormLabel>
                {/* The Character Counter UI */}
                  <span className={`text-sm ${getCounterColor()}`}>
                    {currentCount} / {MAX_CHAR_COUNT}
                  </span>
               <FormControl className="border-1 border-gray-400 text-gray-900">
                  <Textarea
                    disabled={isSubmitting} 
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck={false}
                      inputMode="text"
                    className="font-roboto leading-relaxed text-xl w-[36dvw] h-[40dvh] 
                    placeholder:text-xl placeholder:font-geist resize-none" 
                    placeholder="What do you want to talk about?"
                    {...field}
                    // 5. Prevent typing past limit (optional, but good UX)
                    maxLength={MAX_CHAR_COUNT} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            {isPosted && (<div className="absolute flex gap-2 z-50 animate-bounce rounded-md
          bg-green-500/60 px-4 py-3 text-white shadow-lg">
              <span>✅</span> <p>Posted Successfully</p>
            </div>)
              }
              
              <main className="relative flex gap-4 w-[36dvw] h-[20dvh] bg-slate-400">
                <Tabs>
                  <TabsList>
                    <TabsTrigger value={""}>

                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              {emojis.map((category: EmojiCategory) => (
                <div className=" w-full p-4" key={category.label}>
                  <h3 className="font-bold text-white mb-2">{category.label}</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(category.list).map(([emoji, name]) => (
                      <button
                        key={emoji}
                        type="button"
                        title={name}
                        className="text-2xl  hover:scale-125 transition-transform"
                        onClick={() => {
                          const current = form.getValues("thread");
                          form.setValue("thread", current + emoji);
                        }}
                      >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
          </main>
          <Button
            className="my-8"
            type="submit"
            disabled={isSubmitting || currentCount > MAX_CHAR_COUNT}
          >
            {isSubmitting ? "Posting..." : "Create Thread"}
          </Button>
          
        </form>
      </Form>
    </div>
  );
}