import Link from "next/link";
import { getPosts } from "@/lib/content";

export default async function BlogPage() {
  const articles = await getPosts();

  return (
    <main className="min-h-screen px-6 pt-24 pb-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Blog
          </h1>
          <p className="mt-2 text-muted-foreground">
            Essays and updates.
          </p>
        </div>

        {articles.length === 0 ? (
          <p className="py-6 text-sm text-muted-foreground">No posts yet. Stay tuned!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group flex flex-col rounded-3xl border border-border/50 bg-card p-8 transition-all hover:border-border hover:bg-muted/30"
              >
                {/* 1. Category Tag */}
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F57F00]">
                  {article.category || "Tutorial"}
                </span>

                {/* 2. Title */}
                <h2 className="mt-4 text-xl font-medium text-foreground transition-colors group-hover:text-foreground/90">
                  {article.title}
                </h2>

                {/* 3. Excerpt */}
                {article.excerpt && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                
                {/* Footer Section: Date & Tags */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {/* 4. Date */}
                  <time
                    dateTime={article.created_at}
                    className="text-[11px] uppercase tracking-wider text-muted-foreground/60"
                  >
                    {new Date(article.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>

                  {/* 5. Tech Stack Tags */}
                  <div className="flex gap-2">
                    {article.tags?.map((tag: string) => (
                      <span 
                        key={tag}
                        className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-0.5 text-[9px] font-medium text-muted-foreground uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Read More Arrow */}
                <div className="mt-6 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[#F57F00] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                  Read More 
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14m-7-7 7 7-7 7"/>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}