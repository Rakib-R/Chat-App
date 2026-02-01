'use client'

export default function ThreadSkeleton({ isComment = false }: { isComment?: boolean }) {
  return (
    <main className="flex w-156 flex-col my-4">
      {/* Container matches the ThreadCard padding and background */}
      <section className={`shimmer relative overflow-hidden flex p-4 gap-6 flex-row rounded-xl bg-slate-800 ${isComment ? "ml-4" : ""} animate-pulse`}>
        
        {/* AVATAR COLUMN */}
        <header className="flex flex-col relative items-center">
          {/* Matches the Link/Image dimensions in ThreadCard */}
          <div className={`rounded-[2rem] bg-slate-700 aspect-square ${isComment ? "h-10 w-10" : "h-16 w-16"}`} />
          
          {/* Thread Card Bar */}
          <div className="absolute top-16 h-full w-0.5 bg-slate-700/50" />
        </header>

        {/* CONTENT COLUMN */}
        <div className="flex flex-col items-start w-64">
          {/* AUTHOR NAME (Matches the relative text-[18px] link) */}
          <div className="h-5 w-32 rounded bg-slate-700 mb-2" />

          {/* CONTENT TEXT (Matches the text-base text-pretty) */}
          <div className="space-y-2 w-full">
            <div className="h-4 w-full rounded bg-slate-700" />
            {/* <div className="h-4 w-full rounded bg-slate-700" />
            <div className="h-4 w-[60%] rounded bg-slate-700" /> */}
          </div>

          {/* ARTICLE SECTION (Social Media + Community) */}
          <article className="mt-2 flex flex-col gap-3 w-full">
            
            {/* SOCIAL MEDIA FEATURES (Matches your SocialMedia component) */}
            <div className="flex gap-4">
              <div className="h-6 w-6 rounded-full bg-slate-700" />
              <div className="h-6 w-6 rounded-full bg-slate-700" />
              <div className="h-6 w-6 rounded-full bg-slate-700" />
              <div className="h-6 w-6 rounded-full bg-slate-700" />
            </div>

            {/* COMMUNITY / DATE INFO */}
            <div className="flex gap-2 items-center mt-1">
              <div className="h-3 w-24 rounded bg-slate-700/50" /> {/* Date */}
              {!isComment && <div className="h-3 w-20 rounded bg-slate-700/50" />} {/* Community Name */}
              {!isComment && <div className="h-4 w-4 rounded-md bg-slate-700/50" />} {/* Community Image */}
            </div>

            {/* REPLIES (Bottom section) */}
            {!isComment && (
              <div className="mt-2 flex gap-4 items-center">
                 <div className="h-5 w-5 rounded bg-slate-700/50" /> {/* Down Icon */}
                 <div className="h-4 w-16 rounded bg-slate-700/50" /> {/* Reply Text */}
              </div>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
