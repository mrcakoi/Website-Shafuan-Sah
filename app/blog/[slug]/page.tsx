import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/content";

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPostBySlug(slug);

  if (!article) notFound();

  const getParsedContent = (content: any) => {
    if (!content) return null;
    if (typeof content === 'string') {
      try {
        return JSON.parse(content);
      } catch (e) {
        return null;
      }
    }
    return content;
  };

  const renderContent = (content: any) => {
    const data = getParsedContent(content);
    if (!data || !data.blocks) return <p className="text-muted-foreground/90">{article.excerpt}</p>;

    return data.blocks.map((block: any, index: number) => {
      switch (block.type) {
        case "header":
          // Guna text-foreground supaya dia jadi hitam dalam Light Mode, putih dalam Dark Mode
          if (block.data.level === 1) return <h1 key={index} className="text-3xl font-bold mt-10 mb-4 text-foreground">{block.data.text}</h1>;
          if (block.data.level === 2) return <h2 key={index} className="text-2xl font-bold mt-8 mb-3 text-foreground">{block.data.text}</h2>;
          return <h3 key={index} className="text-xl font-bold mt-6 mb-2 text-foreground">{block.data.text}</h3>;

        case "paragraph":
          return (
            <p 
              key={index} 
              className="mb-6 leading-relaxed text-muted-foreground/90 text-lg" 
              dangerouslySetInnerHTML={{ __html: block.data.text }} 
            />
          );

        case "list":
          const Tag = block.data.style === "ordered" ? "ol" : "ul";
          return (
            <Tag key={index} className={`${block.data.style === "ordered" ? "list-decimal" : "list-disc"} pl-6 space-y-3 my-6 text-muted-foreground/90`}>
              {block.data.items.map((item: string, i: number) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </Tag>
          );

        case "checklist":
          return (
            <div key={index} className="my-6 space-y-3">
              {block.data.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={item.checked} 
                    readOnly 
                    className="h-4 w-4 rounded border-input bg-background accent-[#F57F00]" 
                  />
                  <span className="text-muted-foreground/90">{item.text}</span>
                </div>
              ))}
            </div>
          );

        case "image":
          return (
            <figure key={index} className="my-10">
              <img 
                src={block.data.file.url} 
                alt={block.data.caption || ""} 
                className="rounded-2xl border border-border w-full"
              />
              {block.data.caption && (
                <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
                  {block.data.caption}
                </figcaption>
              )}
            </figure>
          );

        case "quote":
          return (
            <blockquote key={index} className="border-l-4 border-[#F57F00] pl-6 my-10 italic">
              <p className="text-xl text-foreground/90 mb-2 leading-relaxed">{block.data.text}</p>
              {block.data.caption && <cite className="text-sm text-muted-foreground">— {block.data.caption}</cite>}
            </blockquote>
          );

        case "code":
          return (
            <div key={index} className="my-8 relative group">
              {/* Background code maintain gelap sikit pun okay untuk kontras, atau guna bg-muted */}
              <pre className="bg-muted p-6 rounded-xl overflow-x-auto border border-border font-mono text-sm leading-relaxed text-foreground/80">
                <code>{block.data.code}</code>
              </pre>
            </div>
          );

        default:
          return null;
      }
    });
  };

  return (
    <main className="min-h-screen px-6 pt-32 pb-20 bg-background transition-colors duration-300">
      <article className="mx-auto max-w-2xl">
        <Link
          href="/blog"
          className="text-sm font-medium text-[#F57F00] transition-opacity hover:opacity-80"
        >
          ← Back to Blog
        </Link>
        
        <header className="mt-10 mb-12">
          <div className="flex items-center gap-3 mb-6">
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F57F00]">
               {article.category || "Insight"}
             </span>
             <span className="h-[1px] w-8 bg-border"></span>
             <time dateTime={article.created_at} className="text-[10px] uppercase tracking-widest text-muted-foreground">
               {new Date(article.created_at).toLocaleDateString("en-GB", {
                 day: "numeric",
                 month: "short",
                 year: "numeric"
               })}
             </time>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl leading-[1.1]">
            {article.title}
          </h1>
        </header>

        <div className="mt-12">
          {renderContent(article.content)}
        </div>
      </article>
    </main>
  );
}