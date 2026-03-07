import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";

export default function PortfolioProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const project = getProjectBySlug(slug);
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
        <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {project.category}
        </p>
        <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground">
          {project.title}
        </h1>
        <p className="mt-6 text-muted-foreground">
          Project detail content. Connect Supabase to load from database.
        </p>
      </div>
    </main>
  );
}

