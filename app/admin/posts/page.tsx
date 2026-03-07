"use client";

import { useState, useEffect } from "react"; // Tambah useEffect
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPosts, type Post } from "@/lib/content"; // TUKAR: posts -> getPosts

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]); // Mula dengan array kosong
  const [loading, setLoading] = useState(true);

  // Tarik data live dari Supabase sebaik sahaja page dibuka
  useEffect(() => {
    async function loadPosts() {
      const data = await getPosts();
      setPosts(data);
      setLoading(false);
    }
    loadPosts();
  }, []);

  const handleDelete = (id: string) => {
    // Buat masa ni kita buat filter di UI sahaja. 
    // Nanti kita tambah logic 'delete' ke database.
    setPosts((current) => current.filter((post) => post.id !== id));
  };

  return (
    <main className="px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-light tracking-tight text-foreground">
          Posts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage blog posts live from Supabase.
        </p>

        <section className="mt-8 rounded-xl border border-border/50 bg-card">
          <header className="flex items-center justify-between border-b border-border/50 px-6 py-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              All posts
            </h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </header>

          {loading ? (
            <p className="px-6 py-6 text-sm text-muted-foreground">Loading posts...</p>
          ) : posts.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground">
              No posts found. Create one from the dashboard!
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {posts.map((post) => (
                <li key={post.id} className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {post.title}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {post.slug}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {post.excerpt ?? "No excerpt provided yet."}
                    </p>
                    <time
                      dateTime={post.date}
                      className="mt-1 block text-xs text-muted-foreground"
                    >
                      {post.date}
                    </time>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/blog/${post.slug}`}>View</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/60 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      type="button"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}