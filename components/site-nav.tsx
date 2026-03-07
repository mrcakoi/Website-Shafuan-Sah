"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const baseNavItems = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth
      .getUser()
      .then(({ data }) => {
        setIsLoggedIn(!!data.user);
      })
      .catch(() => {
        setIsLoggedIn(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const navItems = isLoggedIn
    ? [...baseNavItems, { href: "/admin", label: "Admin" }]
    : baseNavItems;

  return (
    <nav
      className="fixed left-0 right-0 top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md"
      role="navigation"
    >
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-sm font-medium text-foreground transition-opacity hover:opacity-80"
        >
        SHAFUAN SAH
        </Link>
        <div className="flex items-center gap-3">
          <ul className="flex items-center gap-1">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
          </ul>
          <ThemeToggle />
          {isLoggedIn && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 text-xs"
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                document.cookie = "portfolio-auth=; path=/; max-age=0; samesite=lax";
                window.location.href = "/login";
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
