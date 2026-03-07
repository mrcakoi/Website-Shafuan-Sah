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
  title: "Content Manager — Personal Brand",
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
    </html>
  );
}