"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(""); // State baru
  const [tagsInput, setTagsInput] = useState(""); // State untuk input teks tags
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setLoading(true);
    const supabase = createClient();

    // Tukar string "Rails, Postgres" kepada array ["Rails", "Postgres"]
    const tagsArray = tagsInput
      ? tagsInput.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
      : [];

    const { error } = await supabase.from("posts").insert([
      {
        title,
        slug,
        excerpt,
        category, // Masukkan ke DB
        tags: tagsArray, // Masukkan array ke DB
        content,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      alert("Error: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/posts");
      router.refresh();
    }
  };

  return (
    <main className="px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild size="sm">
              <Link href="/admin/posts">← Back</Link>
            </Button>
            <h1 className="text-xl font-medium">Create New Post</h1>
          </div>
          <Button 
            onClick={handlePublish} 
            disabled={loading}
            className="bg-[#F57F00] hover:bg-[#D46D00] text-white"
          >
            {loading ? "Publishing..." : "Publish Post"}
          </Button>
        </header>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-light outline-none placeholder:text-muted-foreground/30"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="slug-url-ini"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#F57F00]"
            />
            <input
              type="text"
              placeholder="Category (e.g. Tutorial)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#F57F00]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Tags (separated by comma: Rails, Postgres)"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#F57F00]"
            />
            <input
              type="text"
              placeholder="Short excerpt..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#F57F00]"
            />
          </div>

          <hr className="border-border/50" />

          <div className="min-h-[500px]">
            <Editor onChange={setContent} />
          </div>
        </div>
      </div>
    </main>
  );
}