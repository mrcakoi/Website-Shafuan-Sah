import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProjects, getPosts } from "@/lib/content";

export default async function Home() {
  // 1. Tarik kedua-dua data secara live dari Supabase
  const allProjects = await getProjects();
  const allPosts = await getPosts(); 
  
  // 2. Ambil 2 projek teratas untuk dipaparkan di Home
  const featuredProjects = allProjects.slice(0, 2);

  // 3. Gunakan data allPosts yang baru ditarik
  const latestPosts = allPosts.slice(0, 6);
  const highlightPost = latestPosts[0];
  const otherPosts = latestPosts.slice(1, 6);

  // --- TAMBAH: Fungsi helper untuk format tarikh (8 MAR 2026) ---
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  // -------------------------------------------------------------

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pt-14 text-foreground">
      {/* Hero Section */}
      <section className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-2xl flex-col items-center justify-center text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          SALAM
        </p>
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl md:text-6xl text-foreground">
          Shafuan Sah
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          Curated work, writing, and projects. Minimal. Intentional.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="transition-transform hover:scale-[1.02] bg-[#F57F00] hover:bg-[#D46D00] text-white border-none">
            <Link href="/portfolio">View portfolio</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="transition-transform hover:scale-[1.02]"
          >
            <Link href="/blog">Read blog</Link>
          </Button>
        </div>
      </section>

      {/* Selected Work Section (Dynamic Data) */}
      <section className="w-full max-w-5xl pb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-light tracking-tight sm:text-3xl">
              Selected Work
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              A curated collection of digital experiences and content managed by me.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline-flex"
          >
            View all projects ↗
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featuredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/portfolio/${project.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm transition hover:border-[#F57F00]/30 hover:bg-card"
            >
              <div className="relative h-56 w-full overflow-hidden bg-zinc-900 sm:h-64">
                {project.image_url ? (
                  <img 
                    src={project.image_url} 
                    alt={project.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="relative flex flex-col gap-2 px-6 pb-5 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#F57F00]">
                  {project.category}
                </p>
                <h3 className="text-lg font-medium sm:text-xl">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Writing Section (Dynamic Data) */}
      <section className="w-full max-w-5xl pb-20">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Latest writing
          </h2>
          <Link
            href="/blog"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View all posts
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {highlightPost && (
            <Link
              href={`/blog/${highlightPost.slug}`}
              className="group rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm transition hover:border-border hover:bg-card md:col-span-2"
            >
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Highlighted
              </p>
              <h3 className="mt-2 text-xl font-medium transition-colors group-hover:text-foreground/90">
                {highlightPost.title}
              </h3>
              {highlightPost.excerpt && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {highlightPost.excerpt}
                </p>
              )}
              {/* TUKAR: Guna fungsi helper formatDate */}
              <time className="mt-4 block text-xs text-muted-foreground">
                {formatDate(highlightPost.created_at)}
              </time>
            </Link>
          )}

          <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm overflow-hidden">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground px-2">
              Recent posts
            </p>
            <ul className="space-y-1.5">
              {otherPosts.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col gap-0.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40"
                  >
                    <span className="text-xs font-medium group-hover:text-foreground/90 line-clamp-1">
                      {article.title}
                    </span>
                    {/* TUKAR: Guna fungsi helper formatDate dan kemaskan styling */}
                    <time className="text-[10px] text-muted-foreground uppercase tracking-widest">
                      {formatDate(article.created_at)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto flex max-w-4xl flex-col items-center py-24 text-center">
        <h2 className="mb-4 text-4xl font-medium tracking-[-0.05em] md:text-6xl text-foreground">
          Ready to modernize?
        </h2>
        <p className="mb-10 max-w-lg text-muted-foreground">
          Let's discuss your digital transformation needs. Minimal. Intentional.
        </p>
        <button className="rounded-full bg-[#F57F00] px-8 py-3 font-medium text-white hover:opacity-90 transition-all border-none">
          Start a conversation
        </button>
      </section>
    </main>
  );
}