import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";

export default function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const article = getPostBySlug(slug);
  if (!article) notFound();

  return (
    <main className="min-h-screen px-6 pt-24 pb-20">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Blog
        </Link>
        <time dateTime={article.date} className="mt-4 block text-sm text-muted-foreground">
          {article.date}
        </time>
        <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground">
          {article.title}
        </h1>
        <div className="mt-8 prose prose-invert max-w-none text-muted-foreground">
          <p>Article body. Connect Supabase to load from database.</p>
        </div>
      </article>
    </main>
  );
}

