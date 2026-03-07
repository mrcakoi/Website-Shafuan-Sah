import Link from "next/link";
import { posts } from "@/lib/content";

export default function BlogPage() {
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
          {posts.map((article) => (
            <li key={article.id}>
              <Link
                href={`/blog/${article.slug}`}
                className="group flex flex-col gap-1 py-6 transition-colors sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <span className="text-foreground transition-colors group-hover:text-foreground/80">
                    {article.title}
                  </span>
                  {article.excerpt && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {article.excerpt}
                    </p>
                  )}
                </div>
                <time
                  dateTime={article.date}
                  className="mt-1 text-sm text-muted-foreground sm:mt-0"
                >
                  {article.date}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

