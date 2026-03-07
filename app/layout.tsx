import type { Metadata } from "next";
// Gantikan Geist dengan Inter untuk rupa yang lebih sleek
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shafuan Sah — Digital Nomad",
  description: "A high-end personal brand with blog, portfolio, and content management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen antialiased font-sans bg-background text-foreground relative`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {/* Tambahan: Elemen background gradient yang kita buat dalam globals.css */}
          <div className="bg-glow-container">
            <div className="glow-blob glow-blob-1"></div>
            <div className="glow-blob glow-blob-2"></div>
            <div className="noise-overlay"></div>
          </div>

          <SiteNav />
          {/* Main content akan berada di atas background tadi */}
          
          <main className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
      <footer className="border-t border-border/50 bg-background py-12 px-6">
  <div className="mx-auto max-w-6xl">
    <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
      {/* Branding Side */}
      <div className="space-y-4">
        <div className="text-xl font-bold tracking-tighter uppercase">
          SS <span className="text-muted-foreground">//</span> SHAFUAN SAH
        </div>
        <p className="text-sm text-muted-foreground max-w-xs">
          Digital Solutions Agency. Specialized in high-end content management and video editing.
        </p>
      </div>

      {/* Social/Links Side */}
      <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">
        <a href="#" className="flex items-center gap-1 hover:text-primary transition-colors">
          <span className="text-[10px]">🔗</span> Links
        </a>
        <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
        <a href="#" className="hover:text-primary transition-colors">Github</a>
        <a href="#" className="hover:text-primary transition-colors">Email</a>
      </div>
    </div>

    <div className="mt-16 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">
      © 2026 Shafuan Sah. ALL RIGHTS RESERVED.
    </div>
  </div>
</footer>
    </html>
  );
}