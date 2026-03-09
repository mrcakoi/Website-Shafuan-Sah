"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Flag untuk elak overwrite
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadProject() {
      if (isLoaded) return; // Kalau dah load, jangan buat apa-apa

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
        setIsLoaded(true); // Tandakan data dah berjaya ditarik
      }
      setLoading(false);
    }
    loadProject();
  }, [id, supabase, isLoaded]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);
    
    const projectId = Number(id); // Pastikan 'id' ditukar ke nombor
    
    console.log("Menghantar kemaskini untuk ID:", projectId);

    const { data, error } = await supabase
      .from("projects")
      .update({ 
        title, 
        slug, 
        category, 
        description 
      })
      .eq("id", projectId)
      .select(); // Paksa Supabase pulangkan baris yang telah dikemaskini

    if (error) {
      console.error("Ralat Supabase:", error.message);
      alert("Gagal kemaskini: " + error.message);
    } else if (data && data.length > 0) {
      console.log("Berjaya! Data baru dalam DB:", data[0]);
      
      // router.refresh() kadang-kadang lambat, kita paksa revalidate
      router.refresh(); 
      router.push("/admin/projects");
    } else {
      // Jika error tiada tapi data kosong, biasanya sebab RLS Policy
      console.warn("Tiada baris dikemaskini. Periksa RLS Policy di Supabase.");
      alert("Tiada perubahan dikesan. Sila periksa kebenaran akses database.");
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
      <Button onClick={() => router.back()} variant="ghost" className="mb-6 gap-2 text-white">
        <ArrowLeft className="size-4" /> Back
      </Button>

      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Project Title</label>
          <input 
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
            value={title} 
            onChange={(e) => setTitle(e.target.value)} // Direct update
            required 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Slug</label>
            <input 
              className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus:ring-1 focus:ring-[#F57F00] outline-none"
              value={slug} 
              // Gunakan onBlur atau biarkan user taip dulu supaya tak kacau kursor masa backspace
              onChange={(e) => setSlug(e.target.value)} 
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
          <Button type="submit" disabled={updating} className="bg-[#F57F00] hover:bg-[#D46D00] text-black font-bold">
            {updating ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}