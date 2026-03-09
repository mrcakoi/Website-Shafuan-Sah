"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Loader2, Edit2, ExternalLink, Trash2, Upload, Image as ImageIcon } from "lucide-react";
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
  const [isUploading, setIsUploading] = useState(false); // State baru untuk upload
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    description: "", 
    image_url: "",
  });

  const supabase = createClient();

  // --- FUNGSI UPLOAD GAMBAR ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      // 1. Upload ke Storage Bucket
      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Ambil Public URL
      const { data } = supabase.storage.from("project-images").getPublicUrl(filePath);
      
      setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
    } catch (error: any) {
      alert("Gagal upload gambar: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

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
            <DialogContent className="sm:max-w-[425px] bg-card border-border/50 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-light">Add New Project</DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-widest text-muted-foreground">
                  Isi butiran hasil kerja video kau.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4 pt-4">
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

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Description</label>
                  <textarea
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Huraikan skop kerja kau..."
                  />
                </div>

                {/* BAGI INPUT GAMBAR BARU */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Project Thumbnail</label>
                  <div className="flex flex-col gap-3">
                    {formData.image_url ? (
                      <div className="group relative h-32 w-full overflow-hidden rounded-md border border-border/50">
                        <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: "" })}
                          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 text-white text-xs font-medium"
                        >
                          Tukar Gambar
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border/50 bg-muted/20 transition-colors hover:bg-muted/40">
                        <div className="flex flex-col items-center justify-center pb-2 pt-3">
                          {isUploading ? (
                            <Loader2 className="h-6 w-6 animate-spin text-[#F57F00]" />
                          ) : (
                            <>
                              <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Pilih fail gambar</p>
                            </>
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                      </label>
                    )}
                  </div>
                </div>

                <Button type="submit" disabled={isAdding || isUploading} className="w-full bg-[#F57F00] mt-2">
                  {isAdding ? <Loader2 className="animate-spin size-4" /> : "Publish to Database"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* ... (Bahagian Table/List kekal sama macam kod asal kau) */}
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
                  <div className="flex items-center gap-4">
                    {/* Tambah mini thumbnail preview dalam list */}
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded border border-border/50 bg-muted">
                      {project.image_url ? (
                        <img src={project.image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <ImageIcon className="m-auto h-5 w-5 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground">{project.title}</span>
                        <span className="rounded-md border border-border/50 bg-background px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">{project.category}</span>
                      </div>
                      <code className="text-[10px] text-[#F57F00]/70 font-mono">/{project.slug}</code>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0" title="View Project">
                      <Link href={`/portfolio/${project.slug}`}>
                        <ExternalLink className="size-3.5" />
                      </Link>
                    </Button>
                    
                    <Button asChild size="sm" variant="outline" className="h-8 gap-1.5 border-blue-500/30 text-blue-500 hover:bg-blue-500/10 hover:text-blue-600">
                      <Link href={`/admin/projects/edit/${project.id}`}>
                        <Edit2 className="size-3.5" />
                        <span className="text-xs">Edit</span>
                      </Link>
                    </Button>

                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8 w-8 p-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-white" 
                      onClick={() => handleDelete(project.id)}
                      title="Delete Project"
                    >
                      <Trash2 className="size-3.5" />
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