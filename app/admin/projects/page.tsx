"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase";
import { Project } from "@/lib/content";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [open, setOpen] = useState(false);
  
  // 1. Tambah 'description' dalam state supaya tak error
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "", 
    image_url: "",
  });

  const supabase = createClient();

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    // Pastikan kau dah tambah kolum 'slug' dan 'category' kat Supabase!
    const { error } = await supabase
      .from("projects")
      .insert([formData]);

    if (error) {
      alert("Gagal simpan: " + error.message);
    } else {
      setOpen(false); 
      setFormData({ title: "", slug: "", category: "", description: "", image_url: "" }); 
      fetchProjects(); 
    }
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Betul ke nak padam projek ni?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      alert("Gagal padam: " + error.message);
    } else {
      setProjects((current) => current.filter((p) => p.id !== id));
    }
  };

  return (
    <main className="px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-foreground">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage portfolio directly from Supabase.</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg bg-[#F57F00] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#D46D00]">
                <Plus className="size-4" /> Add Project
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card border-border/50">
              <DialogHeader>
                <DialogTitle className="text-xl font-light">Add New Project</DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground">
                  Isi butiran hasil kerja video kau.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Title</label>
                  <input
                    required
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Category</label>
                    <input
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Video Editing"
                    />
                  </div>
                  {/* Slug */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Slug</label>
                    <input
                      required
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
                      value={formData.slug}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        slug: e.target.value.toLowerCase().replace(/ /g, "-") 
                      })}
                    />
                  </div>
                </div>

                {/* Description - Textarea baru */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Description</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Huraikan skop kerja kau..."
                  />
                </div>

                {/* Thumbnail */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Thumbnail URL</label>
                  <input
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <Button type="submit" disabled={isAdding} className="w-full bg-[#F57F00] mt-2">
                  {isAdding ? <Loader2 className="animate-spin size-4" /> : "Publish to Database"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Section List (Sama macam asal) */}
        <section className="mt-8 rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
          <header className="flex items-center justify-between border-b border-border/50 px-6 py-4 bg-muted/30">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Live Database Content</h2>
            <Button asChild size="sm" variant="outline"><Link href="/admin">Back to dashboard</Link></Button>
          </header>

          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>
          ) : projects.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground italic">No projects found in Supabase.</div>
          ) : (
            <ul className="divide-y divide-border/50">
              {projects.map((project) => (
                <li key={project.id} className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/10 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-foreground">{project.title}</span>
                      <span className="rounded-md border border-border/50 bg-background px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">{project.category}</span>
                    </div>
                    <code className="text-[10px] text-[#F57F00]/70 font-mono">/{project.slug}</code>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 text-xs"><Link href={`/portfolio/${project.slug}`}>View</Link></Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs border-destructive/30 text-destructive hover:bg-destructive hover:text-white" onClick={() => handleDelete(project.id)}>Delete</Button>
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