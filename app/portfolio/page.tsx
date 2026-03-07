"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProjects, type Project } from "@/lib/content";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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
    <main className="min-h-screen px-6 pt-24 pb-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-3xl font-light tracking-tight text-foreground sm:text-4xl">
            Portfolio
          </h1>
          <p className="mt-2 text-muted-foreground">
            Selected projects and case studies.
          </p>
        </motion.div>

        {loading ? (
          // Simple loading state sementara tunggu data dari Supabase
          <div className="flex py-20">
            <p className="text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
              Loading projects...
            </p>
          </div>
        ) : (
          <motion.ul
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {listProjects.map((project) => (
              <motion.li key={project.id} variants={item}>
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="group block rounded-xl border border-border/50 bg-card p-6 transition-colors hover:border-border hover:bg-muted/30"
                >
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {project.category}
                  </span>
                  <h2 className="mt-2 text-lg font-medium text-foreground transition-colors group-hover:text-foreground/90">
                    {project.title}
                  </h2>
                  <span className="mt-2 inline-block text-sm text-muted-foreground transition-transform group-hover:translate-x-1">
                    View project →
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </main>
  );
}