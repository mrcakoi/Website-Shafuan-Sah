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
    <main className="min-h-screen px-6 pt-24 pb-20 text-foreground">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-16 text-center sm:text-left"
        >
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
            Portfolio
          </h1>
          <p className="mt-4 text-muted-foreground max-w-md">
            Selected projects and visual works across different digital mediums.
          </p>
        </motion.div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-muted/20 animate-pulse border border-border/50" />
            ))}
          </div>
        ) : (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2"
          >
            {listProjects.map((project) => (
              <motion.li 
                key={project.id} 
                variants={item}
                className="flex" // Supaya card dalam satu row sama tinggi
              >
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-[#F57F00]/30 hover:shadow-[0_0_30px_-10px_rgba(245,127,0,0.1)]"
                >
                  {/* Thumbnail Section */}
                  <div className="aspect-video w-full overflow-hidden bg-muted/20">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted/10">
                        <ImageIcon className="size-8 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center">
                      <span className="rounded-full bg-[#F57F00]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#F57F00]">
                        {project.category}
                      </span>
                    </div>
                    
                    <h2 className="mt-4 text-xl font-medium text-foreground transition-colors group-hover:text-[#F57F00]">
                      {project.title}
                    </h2>
                    
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-6">
                      <span className="text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
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