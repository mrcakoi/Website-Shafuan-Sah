"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProjects, type Project } from "@/lib/content";
import { Image as ImageIcon } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PortfolioPage() {
  const [listProjects, setListProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const data = await getProjects();
      setListProjects(data);
      setLoading(false);
    }
    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen px-6 pt-24 pb-20 bg-black">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-center sm:text-left"
        >
          <h1 className="text-4xl font-light tracking-tight text-white sm:text-5xl">
            Portfolio
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            Selected projects and visual works across different digital mediums.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
            ))}
          </div>
        ) : (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {listProjects.map((project, index) => (
              <motion.li 
                key={project.id} 
                variants={item}
                // Trick Bento: Kad pertama atau kad ke-4 boleh jadi lebih lebar
                className={`${index === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`}
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition-all hover:border-[#F57F00]/30 hover:shadow-[0_0_30px_-10px_rgba(245,127,0,0.2)]"
                >
                  {/* Thumbnail Section */}
                  <div className="aspect-video w-full overflow-hidden bg-muted/20 sm:aspect-auto sm:h-48">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-white/5">
                        <ImageIcon className="size-8 text-white/10" />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#F57F00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#F57F00]">
                        {project.category}
                      </span>
                    </div>
                    
                    <h2 className="mt-4 text-xl font-light text-white group-hover:text-white/90">
                      {project.title}
                    </h2>
                    
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-6">
                      <span className="text-xs font-medium text-white/40 transition-colors group-hover:text-white">
                        Explore Project →
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </main>
  );
}