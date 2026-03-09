"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Load data asal post berdasarkan ID
  useEffect(() => {
    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || "");
        setCategory(data.category || "");
        setTagsInput(data.tags ? data.tags.join(", ") : "");
        setContent(data.content);
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  const handleUpdate = async () => {
    setSaving(true);
    
    const tagsArray = tagsInput
      ? tagsInput.split(",").map((tag) => tag.trim()).filter((tag) => tag !== "")
      : [];

    const { error } = await supabase
      .from("posts")
      .update({
        title,
        slug,
        excerpt,
        category,
        tags: tagsArray,
        content,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      alert("Error: " + error.message);
      setSaving(false);
    } else {
      router.push("/admin/posts");
      router.refresh();
    }
  };

  if (loading) return <div className="p-10 text-white">Loading data...</div>;

  return (
    <main className="px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild size="sm">
              <Link href="/admin/posts">← Back</Link>
            </Button>
            <h1 className="text-xl font-medium text-white">Edit Post</h1>
          </div>
          <Button 
            onClick={handleUpdate} 
            disabled={saving}
            className="bg-[#F57F00] hover:bg-[#D46D00] text-white"
          >
            {saving ? "Updating..." : "Update Post"}
          </Button>
        </header>

        <div className="space-y-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-4xl font-light outline-none text-white placeholder:text-muted-foreground/30"
          />

          <div className="grid gap-4 sm:grid-cols-2 text-white">
             {/* Input lain sebiji macam page /new tapi guna value state */}
             <input
              type="text"
              placeholder="slug-url"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-border/50 bg-card px-3 py-2 text-sm outline-none"
            />
          </div>

          <div className="min-h-[500px] bg-card rounded-xl p-4">
            {/* Kita hantar data content lama ke dalam Editor */}
            <Editor data={content} onChange={setContent} />
          </div>
        </div>
      </div>
    </main>
  );
}