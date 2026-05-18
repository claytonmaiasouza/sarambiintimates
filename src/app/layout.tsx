import type { Metadata } from "next";
import "./globals.css";
import { TryOnProvider } from "@/contexts/TryOnContext";
import TryOnToast from "@/components/TryOnToast";

export const metadata: Metadata = {
  title: "Sarambi Intimates — Pijamas e Lingerie",
  description:
    "Pijamas e lingerie de cetim que celebram cada parte de você. Conforto, elegância e a liberdade de ser quem você é.",
  keywords: ["pijamas", "lingerie", "cetim", "sarambi", "moda íntima", "conforto"],
  openGraph: {
    title: "Sarambi Intimates",
    description: "Pijamas e lingerie que celebram cada parte de você.",
    siteName: "Sarambi Intimates",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-cream text-ink antialiased">
        <TryOnProvider>
          {children}
          <TryOnToast />
        </TryOnProvider>
      </body>
    </html>
  );
}
