"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getProjects, getPosts, type Project, type Post } from "@/lib/content";
import { createClient } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const [adminProjects, setAdminProjects] = useState<Project[]>([]);
  const [adminPosts, setAdminPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  // 1. Tarik data live dari Supabase sebaik sahaja page dibuka
  useEffect(() => {
    async function loadAdminData() {
      const [projectsData, postsData] = await Promise.all([
        getProjects(),
        getPosts()
      ]);
      setAdminProjects(projectsData);
      setAdminPosts(postsData);
    }
    loadAdminData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTitle("");
    setSlug("");
    setExcerpt("");
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.cookie = "portfolio-auth=; path=/; max-age=0; samesite=lax";
    router.push("/login");
  };

  return (
    <main className="px-8 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {/* Header Dashboard */}
        <header className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage portfolio projects and blog posts. Changes here are live from Supabase.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="mt-1"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </header>

        {/* Statistik Blog & Portfolio */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Blog
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {adminPosts.length} published posts.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-[#F57F00] hover:bg-[#D46D00] text-white border-none">
                <Link href="/admin/posts">Manage posts</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/blog">View blog</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Portfolio
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {adminProjects.length} projects in portfolio.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" className="bg-[#F57F00] hover:bg-[#D46D00] text-white border-none">
                <Link href="/admin/projects">Manage projects</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/portfolio">View portfolio</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Form Quick Create */}
        <section className="max-w-2xl">
          <h2 className="text-lg font-medium text-foreground">
            Quick create post
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            This form is connected to Supabase. Fill in to persist content.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-6"
          >
            <div>
              <label htmlFor="post-title" className="mb-1.5 block text-sm font-medium text-foreground">
                Title
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#F57F00]"
              />
            </div>
            <div>
              <label htmlFor="post-slug" className="mb-1.5 block text-sm font-medium text-foreground">
                Slug
              </label>
              <input
                id="post-slug"
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-slug"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#F57F00]"
              />
            </div>
            <div>
              <label htmlFor="post-excerpt" className="mb-1.5 block text-sm font-medium text-foreground">
                Excerpt
              </label>
              <textarea
                id="post-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description..."
                rows={3}
                className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#F57F00]"
              />
            </div>
            {submitted && (
              <p className="text-sm text-[#F57F00]">
                Success! Your changes are reflected live.
              </p>
            )}
            <Button type="submit" className="w-fit bg-[#F57F00] hover:bg-[#D46D00] text-white border-none">
              Create post
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}