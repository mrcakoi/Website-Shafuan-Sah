export type Project = {
  id: string;
  title: string;
  category: string;
  slug: string;
  featured?: boolean;
  subtitle?: string;
  tags?: string[];
  thumbnail?: string;
};

export type Post = {
  id: string;
  title: string;
  date: string;
  slug: string;
  excerpt?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "1",
    title: "Brand Identity",
    category: "Design",
    slug: "brand-identity",
    featured: true,
    subtitle: "Healthy Hair Oil • All Natural",
    tags: ["Landing Page", "Video Interviews", "Video Editing", "Product Image"],
  },
  {
    id: "2",
    title: "E‑commerce Platform",
    category: "Development",
    slug: "ecommerce-platform",
    featured: true,
    subtitle: "Commerce platform built for scale",
    tags: ["Dashboard", "E‑commerce", "Performance"],
  },
  {
    id: "3",
    title: "Editorial System",
    category: "Content",
    slug: "editorial-system",
    featured: true,
    subtitle: "Publishing system for long-form content",
    tags: ["Design System", "Content Strategy"],
  },
  { id: "4", title: "Motion & UI", category: "Design", slug: "motion-ui" },
  { id: "5", title: "API Dashboard", category: "Development", slug: "api-dashboard" },
  { id: "6", title: "Documentation Site", category: "Content", slug: "docs-site" },
];

export const posts: Post[] = [
  {
    id: "1",
    title: "On minimal design systems",
    date: "Mar 5, 2025",
    slug: "minimal-design-systems",
    excerpt: "Thoughts on building lean, maintainable systems that stay out of the way.",
    featured: true,
  },
  {
    id: "2",
    title: "Content-first workflows",
    date: "Mar 1, 2025",
    slug: "content-first-workflows",
    excerpt: "Why starting from words leads to clearer, more intentional products.",
    featured: true,
  },
  {
    id: "3",
    title: "Building in public",
    date: "Feb 24, 2025",
    slug: "building-in-public",
    excerpt: "Sharing your process as you go to attract the right people.",
  },
];

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((project) => project.slug === slug) ?? null;
}

export function getPostBySlug(slug: string): Post | null {
  return posts.find((post) => post.slug === slug) ?? null;
}

