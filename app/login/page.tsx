"use client";

import { useState, Suspense } from "react"; // Tambah Suspense kat sini
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

// 1. Kita buat komponen asing untuk Form supaya Suspense boleh berfungsi
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      document.cookie = `portfolio-auth=1; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax`;

      const redirectTo = searchParams.get("redirectTo") ?? "/admin";
      router.push(redirectTo);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Sign in
        </p>
        <h1 className="text-2xl font-light tracking-tight text-foreground">
          Access admin
        </h1>
        <p className="mt-2 text-xs text-muted-foreground">
          Use your Supabase email and password to manage content.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-border/50 bg-card/80 p-6 shadow-sm backdrop-blur"
      >
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-foreground">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full transition-transform hover:scale-[1.01]"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="pt-1 text-center text-[11px] text-muted-foreground">
          Your credentials are verified securely with Supabase.
        </p>
      </form>
    </div>
  );
}

// 2. Page utama yang akan di-render oleh Next.js
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 pt-14">
      {/* Bungkus LoginForm dalam Suspense untuk selesaikan error build Vercel */}
      <Suspense fallback={<div className="text-xs uppercase tracking-widest text-muted-foreground">Loading Portal...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}