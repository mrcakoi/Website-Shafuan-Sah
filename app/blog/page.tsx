import Link from "next/link";
import { getPosts } from "@/lib/content";

export default async function BlogPage() {
  const articles = await getPosts();

  return (
    <main className="min-h-screen px-6 pt-24 pb-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Blog
          </h1>
          <p className="mt-2 text-muted-foreground">
            Essays and updates.
          </p>
        </div>

        <ul className="divide-y divide-border/50">
          {articles.length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">No posts yet. Stay tuned!</p>
          ) : (
            articles.map((article) => (
              <li key={article.id}>
                <Link
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col gap-1 py-10 transition-colors sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex-1">
                    <span className="text-lg font-medium text-foreground transition-colors group-hover:text-[#F57F00]">
                      {article.title}
                    </span>
                    {article.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 max-w-prose">
                        {article.excerpt}
                      </p>
                    )}
                    
                    {/* TAMBAH: Butang Read More */}
                    <div className="mt-4 flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[#F57F00] opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1">
                      Read More 
                      <svg 
                        width="12" 
                        height="12" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14m-7-7 7 7-7 7"/>
                      </svg>
                    </div>
                  </div>

                  <time
                    dateTime={article.created_at}
                    className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground sm:mt-1 sm:ml-4"
                  >
                    {new Date(article.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}