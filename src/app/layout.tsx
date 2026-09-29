import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "Origami Lens Test Dashboard",
  description: "A realistic small SaaS dashboard used to validate the Origami Lens scan → fix → PR workflow end to end.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
