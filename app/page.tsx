import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProjects, getPosts } from "@/lib/content";
import FadeIn from "@/components/FadeIn"; // Pastikan path ni betul ikut folder kau

export default async function Home() {
  // 1. Tarik data secara live
  const allProjects = await getProjects();
  const allPosts = await getPosts(); 
  
  const featuredProjects = allProjects.slice(0, 2);
  const latestPosts = allPosts.slice(0, 5);
  const highlightPost = latestPosts[0];
  const otherPosts = latestPosts.slice(1, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const PostThumbnail = ({ post, className }: { post: any, className?: string }) => {
    if (post.image_url) {
      return (
        <img 
          src={post.image_url} 
          alt={post.title} 
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${className}`}
        />
      );
    }
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-4 text-center ${className}`}>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F57F00] mb-1">Blog</span>
        <span className="text-[8px] text-white/40 uppercase tracking-widest">Auto Thumbnail</span>
      </div>
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pt-14 text-foreground">
      
      {/* 1. Hero Section - Muncul terus */}
      <FadeIn>
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
            <Button asChild variant="outline" size="lg" className="transition-transform hover:scale-[1.02]">
              <Link href="/blog">Read blog</Link>
            </Button>
          </div>
        </section>
      </FadeIn>

      {/* 2. Selected Work Section - Muncul bila scroll (Delay 0.2s) */}
      <FadeIn delay={0.2}>
        <section className="w-full max-w-6xl pb-10">
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
      </FadeIn>

      <div className="h-[1px] w-full max-w-5xl bg-gradient-to-r from-transparent via-border/60 to-transparent my-16" />

      {/* 3. Latest Writing Section - Muncul bila scroll (Delay 0.3s) */}
      <FadeIn delay={0.3}>
        <section className="mt-10 w-full max-w-6xl pb-20">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-light tracking-tight sm:text-3xl">
                Latest Writing
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Thoughts on design, code, and digital experiences.
              </p>
            </div>
            <Link
              href="/blog"
              className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-[#F57F00] hover:underline sm:inline-flex transition-colors"
            >
              View all posts ↗
            </Link>
          </div>

          <div className="grid gap-16 lg:grid-cols-10">
            <div className="lg:col-span-6">
              {highlightPost && (
                <div className="group relative flex flex-col sm:flex-row overflow-hidden rounded-[2.5rem] border border-border/60 bg-card/40 shadow-sm transition-all hover:border-[#F57F00]/30 h-full">
                  <div className="relative w-full sm:w-1/2 overflow-hidden h-72 sm:h-auto">
                    <PostThumbnail post={highlightPost} />
                    <div className="absolute top-6 left-6">
                       <span className="rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-4 py-1.5 text-[10px] font-bold text-white uppercase tracking-[0.15em]">
                         Latest Update
                       </span>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-1/2 flex-col justify-center p-10 lg:p-12">
                    <time className="text-[10px] text-[#F57F00] uppercase tracking-[0.2em] font-semibold mb-4">
                      {formatDate(highlightPost.created_at)}
                    </time>
                    <h3 className="text-3xl font-medium leading-[1.2] group-hover:text-[#F57F00] transition-colors">
                      {highlightPost.title}
                    </h3>
                    <p className="mt-6 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                      {highlightPost.excerpt || "Dive into the full article to explore more about this topic."}
                    </p>
                    <div className="mt-10">
                      <Button asChild variant="outline" size="sm" className="rounded-full px-8 py-5 border-border/80 hover:bg-[#F57F00] hover:text-white transition-all duration-300">
                        <Link href={`/blog/${highlightPost.slug}`}>Read Post</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-3 flex flex-col pt-2">
              <div className="flex items-center gap-2 mb-8 px-2">
                <div className="h-[1px] w-4 bg-[#F57F00]"></div>
                <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">Recent Posts</h3>
              </div>
              <div className="space-y-3">
                {otherPosts.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="group flex items-center gap-5 p-3 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/40"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border/50 bg-muted">
                      <PostThumbnail post={article} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm font-medium group-hover:text-[#F57F00] transition-colors line-clamp-1 leading-none">
                        {article.title}
                      </h4>
                      <time className="text-[9px] text-muted-foreground uppercase tracking-widest font-medium">
                        {formatDate(article.created_at)}
                      </time>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* 4. CTA Section */}
      <FadeIn delay={0.4}>
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
      </FadeIn>

    </main>
  );
}