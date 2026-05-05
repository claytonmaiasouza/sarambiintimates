import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColecaoGrid from "@/components/ColecaoGrid";
import Link from "next/link";

export const metadata = {
  title: "Coleção | Sarambi Intimates",
  description: "Explore nossa coleção de pijamas e lingerie de cetim.",
};

export default function ColecaoPage() {
  return (
    <>
      <Header />

      {/* Page header */}
      <div className="pt-32 pb-12 px-6 bg-cream-dark border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold text-xs uppercase tracking-widest mb-3 font-body">Sarambi Intimates</p>
          <h1 className="font-display text-5xl text-ink">Nossa Coleção</h1>
          <p className="text-muted text-base mt-3 max-w-lg">
            Cada peça foi pensada para celebrar um momento especial da sua vida — do café da manhã
            ao domingo mais preguiçoso.
          </p>
        </div>
      </div>

      <ColecaoGrid />

      {/* CTA provador */}
      <section className="py-16 px-6 bg-rose/10 border-y border-rose/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl text-ink mb-3">
            Não sabe se vai ficar bem em você?
          </h2>
          <p className="text-muted text-base mb-6">
            Use nosso provador virtual com inteligência artificial para ver as peças em você antes
            de comprar.
          </p>
          <Link
            href="/provador"
            className="inline-flex items-center gap-2 bg-ink text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all duration-300"
          >
            Abrir Provador Virtual
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
