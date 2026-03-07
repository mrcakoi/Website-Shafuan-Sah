"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { projects as initialProjects, Project } from "@/lib/content";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleDelete = (id: string) => {
    setProjects((current) => current.filter((project) => project.id !== id));
  };

  return (
    <main className="px-8 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-light tracking-tight text-foreground">
          Projects
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage portfolio projects. These changes are local to this session until you connect a
          real backend.
        </p>

        <section className="mt-8 rounded-xl border border-border/50 bg-card">
          <header className="flex items-center justify-between border-b border-border/50 px-6 py-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">
              All projects
            </h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/admin">Back to dashboard</Link>
            </Button>
          </header>

          {projects.length === 0 ? (
            <p className="px-6 py-6 text-sm text-muted-foreground">
              No projects in this view. Seed your portfolio data or connect Supabase to manage
              projects.
            </p>
          ) : (
            <ul className="divide-y divide-border/50">
              {projects.map((project) => (
                <li
                  key={project.id}
                  className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {project.title}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {project.category}
                      </span>
                    </div>
                    <span className="mt-1 inline-block text-xs text-muted-foreground">
                      {project.slug}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/portfolio/${project.slug}`}>View</Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/60 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      type="button"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete (demo)
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

