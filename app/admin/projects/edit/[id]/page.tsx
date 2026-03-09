"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Upload, Image as ImageIcon } from "lucide-react";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // State untuk upload gambar
  const [isLoaded, setIsLoaded] = useState(false); 
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State baru untuk image_url

  useEffect(() => {
    async function loadProject() {
      if (isLoaded) return;

      const projectId = Number(id);
      if (isNaN(projectId)) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (data && !error) {
        setTitle(data.title || "");
        setSlug(data.slug || "");
        setCategory(data.category || "");
        setDescription(data.description || "");
        setImageUrl(data.image_url || ""); // Load URL sedia ada
        setIsLoaded(true);
      }
      setLoading(false);
    }
    loadProject();
  }, [id, supabase, isLoaded]);

  // --- FUNGSI REPLACE GAMBAR ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("project-images").getPublicUrl(filePath);
      setImageUrl(data.publicUrl); // Update preview & state
    } catch (error: any) {
      alert("Gagal upload gambar: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    
    const projectId = Number(id);
    
    const { data, error } = await supabase
      .from("projects")
      .update({ 
        title, 
        slug, 
        category, 
        description,
        image_url: imageUrl // Masukkan image_url yang baru/lama
      })
      .eq("id", projectId)
      .select();

    if (error) {
      alert("Gagal kemaskini: " + error.message);
    } else if (data && data.length > 0) {
      router.refresh(); 
      router.push("/admin/projects");
    } else {
      alert("Tiada perubahan dikesan.");
    }
    setUpdating(false);
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-white bg-black">
      <Loader2 className="animate-spin text-orange-500" />
      <span className="ml-2">Loading data...</span>
    </div>
  );

  return (
    <div className="p-8 max-w-2xl mx-auto text-white">
      <Button onClick={() => router.back()} variant="ghost" className="mb-6 gap-2 text-white hover:bg-white/10">
        <ArrowLeft className="size-4" /> Back
      </Button>

      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        
        {/* INPUT GAMBAR SECTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Thumbnail</label>
          <div className="flex flex-col gap-3">
            {imageUrl ? (
              <div className="group relative h-48 w-full overflow-hidden rounded-md border border-white/10">
                <img src={imageUrl} alt="Preview" className="h-full w-full object-cover" />
                <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 text-xs font-medium">
                  {isUploading ? <Loader2 className="animate-spin" /> : "Ganti Gambar Baru"}
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                </label>
              </div>
            ) : (
              <label className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                <Upload className="mb-2 h-6 w-6 text-white/50" />
                <span className="text-xs text-white/50">Upload Thumbnail</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            )}
            {isUploading && <p className="text-[10px] text-orange-500 animate-pulse uppercase tracking-widest">Uploading to Storage...</p>}
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Project Title</label>
          <input 
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Slug</label>
            <input 
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
              value={slug} 
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, "-"))} 
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Category</label>
            <input 
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium">Description</label>
          <textarea 
            className="w-full h-32 p-3 rounded-md border border-white/10 bg-white/5 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none resize-none"
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={updating || isUploading} className="bg-[#F57F00] hover:bg-[#D46D00] text-black font-bold">
            {updating ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" className="border-white/10 text-white" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}