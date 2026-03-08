import Link from "next/link";
import { getPosts } from "@/lib/content"; // TUKAR: Ambil fungsi, bukan variable statik

export default async function BlogPage() { // TAMBAH: async untuk benarkan 'await'
  // Tarik data secara live dari Supabase
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
                  className="group flex flex-col gap-1 py-6 transition-colors sm:flex-row sm:items-baseline sm:justify-between"
                >
                  <div className="flex-1">
                    <span className="text-foreground transition-colors group-hover:text-[#F57F00]">
                      {article.title}
                    </span>
                    {article.excerpt && (
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  <time
                    // TUKAR: Guna created_at sebab ini yang ada dalam type Post kau
                    dateTime={article.created_at}
                    className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground sm:mt-0 sm:ml-4"
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