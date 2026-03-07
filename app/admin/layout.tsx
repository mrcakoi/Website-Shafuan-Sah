import { AdminNav } from "@/components/admin-nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen pt-14">
      <aside className="fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-56 border-r border-border/50 bg-background">
        <AdminNav />
      </aside>
      <div className="flex-1 pl-56">
        {children}
      </div>
    </div>
  );
}
