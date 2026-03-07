import { createClient } from "@/lib/supabase";

export type Project = {
  id: string;
  title: string;
  category: string;
  slug: string;
  description?: string;
  image_url?: string;
  subtitle?: string;
  tags?: string[];
  content?: string; // Tambah ini kalau kau simpan content panjang
};

// lib/content.ts

export type Post = {
  id: string;
  title: string;
  created_at: string; // TUKAR: daripada 'date' kepada 'created_at'
  slug: string;
  excerpt?: string;
  content?: string; 
};

// --- Fungsi Sedia Ada ---

export async function getProjects() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal tarik projects:", error.message);
    return [];
  }
  return data as Project[];
}

export async function getPosts() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal tarik posts:", error.message);
    return [];
  }
  return data as Post[];
}

// --- FUNGSI BARU (WAJIB TAMBAH UNTUK SETELKAN ERROR) ---

// 1. Cari satu projek guna slug (untuk /portfolio/[slug])
export async function getProjectBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Gagal cari projek:", error.message);
    return null;
  }
  return data as Project;
}

// 2. Cari satu blog guna slug (untuk /blog/[slug])
export async function getPostBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Gagal cari post:", error.message);
    return null;
  }
  return data as Post;
}