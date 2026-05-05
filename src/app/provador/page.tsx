import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VirtualTryOn from "@/components/VirtualTryOn";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "Provador Virtual | Sarambi Intimates",
  description: "Experimente nossas peças virtualmente com inteligência artificial.",
};

function TryOnLoader({ searchParams }: { searchParams: { produto?: string } }) {
  return <VirtualTryOn defaultProductSlug={searchParams.produto} />;
}

export default async function ProvadorPage({
  searchParams,
}: {
  searchParams: Promise<{ produto?: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      <Header />

      {/* Page header */}
      <div className="pt-32 pb-12 px-6 bg-ink">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-rose" />
            <p className="text-rose text-xs uppercase tracking-widest font-body">IA + Moda</p>
          </div>
          <h1 className="font-display text-5xl text-cream">Provador Virtual</h1>
          <p className="text-cream/60 text-base mt-3 max-w-xl">
            Veja como as peças da Sarambi ficam em você, sem sair de casa. Tecnologia de
            inteligência artificial que respeita sua privacidade.
          </p>

          {/* Trust signals */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { icon: ShieldCheck, label: "Privacidade garantida" },
              { icon: Zap, label: "Resultado em segundos" },
              { icon: Sparkles, label: "IA de última geração" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-cream/40">
                <Icon size={14} />
                <span className="text-xs uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Try-on interface */}
      <section className="py-16 px-6 bg-cream flex-1">
        <div className="max-w-7xl mx-auto">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-24">
                <div className="text-muted text-sm">Carregando provador...</div>
              </div>
            }
          >
            <TryOnLoader searchParams={params} />
          </Suspense>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-cream-dark border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display text-3xl text-ink text-center mb-10">
            Dúvidas frequentes
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {[
              {
                q: "Minha foto fica salva?",
                a: "Não. Suas imagens são processadas em tempo real e não são armazenadas em nossos servidores após o resultado ser gerado.",
              },
              {
                q: "Que tipo de foto devo usar?",
                a: "Uma foto de corpo inteiro, de frente, com fundo claro e boa iluminação traz os melhores resultados. Evite fotos com outros objetos ou pessoas na frente.",
              },
              {
                q: "O resultado é muito diferente da realidade?",
                a: "A IA simula com bastante precisão como a peça ficaria no seu corpo. Para resultados ainda melhores, use fotos com postura ereta e boa iluminação.",
              },
              {
                q: "Posso experimentar qualquer tamanho?",
                a: "O provador virtual mostra como a peça fica no corpo. Para verificar o tamanho ideal, consulte nossa tabela de medidas na página do produto.",
              },
            ].map(({ q, a }) => (
              <details key={q} className="group py-4 cursor-pointer">
                <summary className="flex items-center justify-between font-display text-base text-ink list-none">
                  {q}
                  <span className="text-muted group-open:rotate-45 transition-transform duration-200 text-xl leading-none">+</span>
                </summary>
                <p className="mt-3 text-muted text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
