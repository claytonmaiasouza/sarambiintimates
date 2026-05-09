import type { Metadata } from "next";
import "./globals.css";
import { TryOnProvider } from "@/contexts/TryOnContext";

export const metadata: Metadata = {
  title: "Sarambi Intimates",
  description: "Sarambi Intimates",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-cream text-ink antialiased">
        <TryOnProvider>{children}</TryOnProvider>
      </body>
    </html>
  );
}
