import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  const featured = products.slice(0, 3);

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Foto — posicionada para rostos ficarem no centro vertical */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-duo.jpg"
            alt="Sarambi — Mulheres livres"
            fill
            className="object-cover"
            style={{ objectPosition: "60% 18%" }}
            priority
          />
          {/* Gradiente lateral da esquerda para legibilidade do texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-transparent" />
          {/* Gradiente sutil no topo e fundo */}
          <div className="absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink/20" />
        </div>

        {/* Texto — centralizado verticalmente, alinha com os rostos */}
        <div className="relative max-w-7xl mx-auto px-6 w-full pt-24">
          <div className="max-w-lg">
            <p className="text-rose text-xs uppercase tracking-widest mb-5 font-body">
              Sarambi Intimates
            </p>
            <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight mb-6">
              A bagunça
              <br />
              <em>bonita</em> de ser
              <br />
              mulher.
            </h1>
            <p className="text-cream/70 text-base font-body leading-relaxed mb-10 max-w-sm">
              Pijamas de cetim que abraçam cada fase, cada humor, cada versão
              de você — com conforto e elegância.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/colecao"
                className="bg-cream text-ink px-8 py-4 text-sm uppercase tracking-widest hover:bg-rose transition-all duration-300 flex items-center gap-2"
              >
                Ver coleção
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/provador"
                className="border border-cream text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-cream/10 transition-all duration-300 flex items-center gap-2"
              >
                <Sparkles size={14} />
                Provador Virtual
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gold text-xs uppercase tracking-widest mb-6 font-body">Nossa Essência</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight mb-8">
            &ldquo;As mulheres são como o céu — às vezes calmas como uma manhã de sol, outras vezes intensas como uma tempestade.&rdquo;
          </h2>
          <p className="text-muted text-base font-body leading-relaxed max-w-2xl mx-auto mb-10">
            A Sarambi nasceu do sonho de uma mulher que acredita que toda a complexidade feminina
            merece ser abraçada. <em>Sarambi</em> significa bagunça em Tupi-Guarani — mas é a
            bagunça bonita das ideias, das emoções e das histórias que fazem cada pessoa ser única.
          </p>
          <Link
            href="/historia"
            className="text-sm uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-gold hover:border-gold transition-colors"
          >
            Conheça nossa história
          </Link>
        </div>
      </section>

      {/* Produtos em destaque */}
      <section className="py-20 px-6 bg-cream-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-gold text-xs uppercase tracking-widest mb-2 font-body">Coleção</p>
              <h2 className="font-display text-4xl text-ink">Peças em destaque</h2>
            </div>
            <Link
              href="/colecao"
              className="text-sm uppercase tracking-widest text-muted hover:text-ink transition-colors flex items-center gap-2"
            >
              Ver todas
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner Provador Virtual */}
      <section className="py-24 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-rose text-xs uppercase tracking-widest mb-4 font-body">
                Tecnologia + Moda
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-cream leading-tight mb-6">
                Experimente antes de comprar
              </h2>
              <p className="text-cream/60 text-base leading-relaxed mb-8">
                Com nosso provador virtual por inteligência artificial, você pode ver como cada
                peça fica em você antes de finalizar o pedido. É rápido, seguro e gratuito.
              </p>
              <ul className="flex flex-col gap-3 mb-10">
                {[
                  "Envie uma foto sua",
                  "Escolha a peça desejada",
                  "Veja o resultado em segundos",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-cream/70 text-sm">
                    <span className="w-6 h-6 rounded-full border border-rose text-rose text-xs flex items-center justify-center flex-shrink-0 font-display">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
              <Link
                href="/provador"
                className="inline-flex items-center gap-2 bg-rose text-ink px-8 py-4 text-sm uppercase tracking-widest hover:bg-cream transition-all duration-300"
              >
                <Sparkles size={16} />
                Abrir provador virtual
              </Link>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden hidden lg:block">
              <Image
                src="/images/tryon-preview.jpg"
                alt="Provador Virtual Sarambi"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle strip */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs uppercase tracking-widest mb-12 text-center font-body">
            Momentos que merecem uma Sarambi
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { src: "/images/lifestyle-hands.jpg", caption: "Cuidado" },
              { src: "/images/lifestyle-duo.jpg", caption: "Cumplicidade" },
              { src: "/images/lifestyle-pink.jpg", caption: "Elegância" },
              { src: "/images/lifestyle-blue.jpg", caption: "Leveza" },
            ].map((item) => (
              <div key={item.src} className="relative aspect-[3/4] overflow-hidden group">
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-all duration-300 flex items-end p-4">
                  <span className="text-cream text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.caption}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
