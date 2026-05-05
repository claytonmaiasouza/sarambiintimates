import Link from "next/link";
import Image from "next/image";
import { AtSign, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contato" className="bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Image
              src="/images/logo-light.png"
              alt="Sarambi Intimates"
              width={140}
              height={45}
              className="h-10 w-auto object-contain opacity-90"
            />
            <p className="text-cream/60 text-sm leading-relaxed max-w-xs">
              Nascida de um sonho antigo, a Sarambi celebra a bagunça bonita
              que existe dentro de cada mulher.
            </p>
            <a
              href="https://instagram.com/sarambiintimates"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cream/60 hover:text-rose transition-colors text-sm"
            >
              <AtSign size={16} />
              @sarambiintimates
            </a>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-cream/40 mb-4">
              Navegação
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { href: "/colecao", label: "Coleção" },
                { href: "/provador", label: "Provador Virtual" },
                { href: "/historia", label: "Nossa História" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/60 hover:text-cream text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-cream/40 mb-4">
              Contato
            </h4>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href="mailto:contato@sarambiintimates.com.br"
                  className="text-cream/60 hover:text-cream text-sm transition-colors"
                >
                  contato@sarambiintimates.com.br
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream/60 hover:text-cream text-sm transition-colors"
                >
                  WhatsApp
                </a>
              </li>
            </ul>

            <div className="mt-8">
              <h4 className="text-xs uppercase tracking-widest text-cream/40 mb-3">
                Newsletter
              </h4>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/30 px-3 py-2 text-sm focus:outline-none focus:border-rose"
                />
                <button
                  type="submit"
                  className="bg-rose text-ink px-4 py-2 text-sm hover:bg-rose-dark transition-colors"
                >
                  Ok
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-cream/30 text-xs">
            © {new Date().getFullYear()} Sarambi Intimates. Todos os direitos reservados.
          </p>
          <p className="text-cream/30 text-xs flex items-center gap-1">
            Feito com <Heart size={12} className="text-rose" /> para celebrar cada mulher
          </p>
        </div>
      </div>
    </footer>
  );
}
