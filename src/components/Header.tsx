"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/colecao", label: "Coleção" },
  { href: "/provador", label: "Provador Virtual" },
  { href: "/historia", label: "Nossa História" },
  { href: "#contato", label: "Contato" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-cream/97 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-gradient-to-b from-ink/60 to-transparent backdrop-blur-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo — inverte cor conforme o fundo */}
        <Link href="/" className="flex items-center">
          <Image
            src={isScrolled ? "/images/logo-dark.png" : "/images/logo-light.png"}
            alt="Sarambi Intimates"
            width={260}
            height={85}
            className="h-16 md:h-20 w-auto object-contain transition-opacity duration-300"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-body tracking-widest uppercase transition-colors ${
                isScrolled
                  ? "text-ink/70 hover:text-ink"
                  : "text-cream/90 hover:text-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/provador"
            className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 text-sm tracking-widest uppercase transition-all duration-300 ${
              isScrolled
                ? "bg-ink text-cream hover:bg-gold hover:text-ink"
                : "bg-cream/20 text-cream border border-cream/40 hover:bg-cream hover:text-ink"
            }`}
          >
            Experimentar
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? "text-ink" : "text-cream"
            }`}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-border">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm uppercase tracking-widest text-ink/70 hover:text-ink py-2 border-b border-border"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/provador"
              onClick={() => setMenuOpen(false)}
              className="mt-2 bg-ink text-cream text-center py-3 text-sm tracking-widest uppercase"
            >
              Experimentar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
