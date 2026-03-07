import Link from "next/link";
import { Button } from "@/components/ui/button";
import { projects, posts } from "@/lib/content";

export default function Home() {
  const featuredProjects = projects.filter((project) => project.featured).slice(0, 2);
  const latestPosts = posts.slice(0, 6);
  const highlightPost = latestPosts[0];
  const otherPosts = latestPosts.slice(1, 6);

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pt-14">
      <section className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-2xl flex-col items-center justify-center text-center">
        <p
          className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          aria-hidden
        >
          Personal brand
        </p>
        <h1 className="text-4xl font-light tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Content Manager
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
          Curated work, writing, and projects. Minimal. Intentional.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="transition-transform hover:scale-[1.02]">
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

      <section className="w-full max-w-5xl pb-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-light tracking-tight text-foreground sm:text-3xl">
              Selected Work
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              A curated collection of web applications, dashboards, and commercial platforms built
              for scalability and performance.
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
          {featuredProjects.map((project) => {
            return (
              <Link
                key={project.id}
                href={`/portfolio/${project.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm transition hover:border-border hover:bg-card"
              >
                <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 sm:h-64">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#ffffff11,_transparent_55%),radial-gradient(circle_at_bottom,_#000000ff,_#000000cc)]" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="relative flex flex-col gap-2 px-6 pb-5 pt-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    {project.category}
                  </p>
                  <h3 className="text-lg font-medium text-foreground sm:text-xl">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="text-sm text-muted-foreground">
                      {project.subtitle}
                    </p>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted/70 px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-4 flex justify-end sm:hidden">
          <Link
            href="/portfolio"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            View all projects ↗
          </Link>
        </div>
      </section>

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
              <h3 className="mt-2 text-xl font-medium text-foreground transition-colors group-hover:text-foreground/90">
                {highlightPost.title}
              </h3>
              {highlightPost.excerpt && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {highlightPost.excerpt}
                </p>
              )}
              <time
                dateTime={highlightPost.date}
                className="mt-4 block text-xs text-muted-foreground"
              >
                {highlightPost.date}
              </time>
            </Link>
          )}

          <div className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Recent posts
            </p>
            <ul className="space-y-2">
              {otherPosts.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="group flex flex-col gap-0.5 rounded-md px-2 py-1.5 transition-colors hover:bg-muted/40"
                  >
                    <span className="text-xs font-medium text-foreground transition-colors group-hover:text-foreground/90">
                      {article.title}
                    </span>
                    <time
                      dateTime={article.date}
                      className="text-[11px] text-muted-foreground"
                    >
                      {article.date}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-4xl flex-col items-center py-24 text-center">
  <h2 className="mb-4 text-4xl font-medium tracking-[-0.05em] md:text-6xl text-foreground">
    Ready to modernize?
  </h2>
  <p className="mb-10 max-w-lg text-muted-foreground">
    Let's discuss your digital transformation needs. 
    Curated work, writing, and projects. Minimal. Intentional.
  </p>
  <div className="flex flex-col gap-4 sm:flex-row">
    <button className="rounded-full bg-foreground px-8 py-3 font-medium text-background hover:opacity-90 transition-all">
      Start a conversation
    </button>
  </div>
</section>

<footer className="border-t border-border/50 bg-background py-12 px-6">
  <div className="mx-auto max-w-6xl">
    <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
      {/* Branding Side */}
      <div className="space-y-4">
        <div className="text-xl font-bold tracking-tighter uppercase">
          SS <span className="text-muted-foreground">//</span> SHAFUAN SAH
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Digital Solutions Agency. Specialized in high-end content management and video editing.
        </p>
      </div>

      {/* Social/Links Side */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
          <span className="text-[10px]">🔗</span> Links
        </a>
        <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-primary transition-colors">Github</a>
        <a href="#" className="hover:text-primary transition-colors">Email</a>
      </div>
    </div>

    <div className="mt-16 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
      © 2026 Shafuan Sah. ALL RIGHTS RESERVED.
    </div>
  </div>
</footer>
    </main>
  );
}

