import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";

// 1. Next.js 15: Params adalah Promise, jadi kena 'await' params tu sendiri
export default async function PortfolioProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // 2. Tarik data dari Supabase via lib function kau
  const project = await getProjectBySlug(slug);

  // 3. Jika projek tak wujud dalam DB, hantar ke page 404
  if (!project) notFound();

  return (
    <main className="min-h-screen px-6 pt-32 pb-20 bg-black text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/portfolio"
          className="text-sm text-muted-foreground transition-colors hover:text-[#F57F00] flex items-center gap-2"
        >
          ← Back to Portfolio
        </Link>
        
        <div className="mt-8 space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F57F00]">
              {project.category}
            </span>
            <h1 className="mt-2 text-4xl font-light tracking-tight sm:text-5xl">
              {project.title}
            </h1>
          </div>
          
          {/* Render gambar thumbnail dari Supabase Storage */}
          {project.image_url && (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <img 
                src={project.image_url} 
                alt={project.title} 
                className="w-full object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {project.description || "Project details coming soon."}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}