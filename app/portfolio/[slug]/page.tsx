import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";

// 1. Tambah keyword 'async' di depan function
export default async function PortfolioProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  
  // 2. Tambah 'await' di sini sebab kita tarik data dari database
  const project = await getProjectBySlug(slug);

  // 3. Kalau projek tak jumpa, barulah panggil notFound()
  if (!project) notFound();

  return (
    <main className="min-h-screen px-6 pt-24 pb-20">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/portfolio"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Portfolio
        </Link>
        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-[#F57F00]">
          {project.category}
        </p>
        <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground">
          {project.title}
        </h1>
        
        {/* Render gambar jika ada */}
        {project.image_url && (
          <img 
            src={project.image_url} 
            alt={project.title} 
            className="mt-8 rounded-2xl border border-border/50"
          />
        )}

        <div className="mt-8 prose prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {project.description || "No description provided for this project."}
          </p>
        </div>
      </div>
    </main>
  );
}