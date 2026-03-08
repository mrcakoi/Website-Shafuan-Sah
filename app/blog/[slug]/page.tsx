import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";

export default async function BlogArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  // Tarik data dari Supabase
  const article = await getPostBySlug(slug);

  // Jika post tak wujud, hantar ke 404
  if (!article) notFound();

  // Helper function untuk render block Editor.js tanpa guna dynamic JSX namespace
  const renderContent = (content: any) => {
    if (!content || !content.blocks) return <p>{article.excerpt}</p>;

    return content.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case "header":
          // Kita pecahkan ikut level secara manual supaya TypeScript tak keliru
          if (block.data.level === 1) return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-foreground">{block.data.text}</h1>;
          if (block.data.level === 2) return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-foreground">{block.data.text}</h2>;
          return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-foreground">{block.data.text}</h3>;

        case "list":
          return (
            <ul key={index} className="list-disc pl-5 space-y-2 my-4 text-muted-foreground/90">
              {block.data.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );

        case "paragraph":
          return (
            <p 
              key={index} 
              className="mb-4 leading-relaxed text-muted-foreground/90" 
              dangerouslySetInnerHTML={{ __html: block.data.text }} 
            />
          );

        default:
          // Jika ada block type lain atau fallback ke paragraph biasa
          if (block.data?.text) {
            return (
              <p 
                key={index} 
                className="mb-4 leading-relaxed text-muted-foreground/90" 
                dangerouslySetInnerHTML={{ __html: block.data.text }} 
              />
            );
          }
          return null;
      }
    });
  };

  return (
    <main className="min-h-screen px-6 pt-24 pb-20">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Blog
        </Link>
        
        {/* Tarikh guna created_at yang baru */}
        <time dateTime={article.created_at} className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">
          {new Date(article.created_at).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </time>

        <h1 className="mt-2 text-3xl font-light tracking-tight text-foreground sm:text-4xl">
          {article.title}
        </h1>

        {/* Bahagian Content Render */}
        <div className="mt-10 prose prose-invert max-w-none">
          {typeof article.content === 'string' 
            ? <p className="text-muted-foreground/90">{article.content}</p> 
            : renderContent(article.content)}
        </div>
      </article>
    </main>
  );
}