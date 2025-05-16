import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { GraphProvider } from "@/lib/graph";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open Canvas",
  description: "Open Canvas Chat UX by LangChain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <body className={cn("min-h-full", inter.className)}>
        <NuqsAdapter>
          <GraphProvider>{children}</GraphProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
