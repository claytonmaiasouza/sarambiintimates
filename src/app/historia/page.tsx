import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Nossa História | Sarambi Intimates",
  description: "Conheça a história por trás da Sarambi — nascida de um sonho antigo e muito amor.",
};

export default function HistoriaPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <div className="relative pt-32 pb-24 px-6 bg-cream-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
          <Image
            src="/images/logo-dark.png"
            alt=""
            fill
            className="object-contain object-right-top"
          />
        </div>
        <div className="max-w-4xl mx-auto relative">
          <p className="text-gold text-xs uppercase tracking-widest mb-4 font-body">
            Nossa História
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-ink leading-none">
            Sarambi
          </h1>
          <p className="font-display text-xl text-muted mt-4 italic">
            A bagunça bonita de ser mulher
          </p>
        </div>
      </div>

      {/* Story sections */}
      <article className="bg-cream">
        {/* Era uma vez */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold text-xs uppercase tracking-widest font-body">O começo</span>
              <h2 className="font-display text-4xl text-ink mt-3 mb-6">
                Um sonho desenhado aos 22 anos
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                A Sarambi nasceu de um sonho muito antigo. Em 2013, aos 22 anos, a nossa fundadora
                já sabia exatamente o que queria criar: uma marca de lingerie e pijamas que falasse
                de verdade com a mulher real.
              </p>
              <p className="text-muted leading-relaxed mb-4">
                Ela havia desenhado a marca, pensado nas modelagens, sonhado com cada detalhe.
                Mas a vida, como costuma fazer, foi guardando esse sonho por um tempo.
              </p>
              <p className="text-muted leading-relaxed">
                Anos depois, durante uma conversa com sua psicóloga, o desejo voltou com força
                total — agora amadurecido, com mais clareza e com uma proposta ainda mais poderosa:
                criar roupas para celebrar todas as versões de uma mulher.
              </p>
            </div>
            <div className="relative aspect-[3/4]">
              <Image
                src="/images/historia-founder.jpg"
                alt="Fundadora da Sarambi"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* O nome */}
        <section className="py-20 px-6 bg-ink">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-rose text-xs uppercase tracking-widest font-body">O nome</span>
            <h2 className="font-display text-5xl text-cream mt-3 mb-8">
              Por que Sarambi?
            </h2>
            <p className="text-cream/70 leading-relaxed mb-6 text-lg">
              <em className="text-cream font-display text-2xl">Sarambi</em> vem do Tupi-Guarani
              e significa <strong className="text-rose">bagunça</strong>, desordem, aquilo que está
              espalhado — o &ldquo;lío&rdquo; que em espanhol a fundadora tanto conhecia.
            </p>
            <p className="text-cream/70 leading-relaxed mb-6">
              Mas não é uma bagunça ruim. É aquela bagunça cheia de vida — um quarto com livros
              empilhados, roupas coloridas espalhadas, sonhos que transbordam do coração.
            </p>
            <p className="text-cream/60 leading-relaxed italic">
              A palavra capturou a fundadora pela sua fonética, pelo som único, pela forma como ela
              representa a diversidade que existe dentro de cada mulher. A marca tinha um nome.
              E com ele, uma alma.
            </p>
          </div>
        </section>

        {/* A missão */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2">
                <span className="text-gold text-xs uppercase tracking-widest font-body">Nossa Missão</span>
                <h2 className="font-display text-4xl text-ink mt-3 mb-6">
                  Pijamas que contam histórias
                </h2>
                <p className="text-muted leading-relaxed mb-4">
                  Cada peça da Sarambi foi criada para acompanhar momentos importantes: uma noite
                  de descanso depois de um dia intenso, um domingo preguiçoso com café e livro, uma
                  manhã de autocuidado que começa antes mesmo de sair da cama.
                </p>
                <p className="text-muted leading-relaxed mb-4">
                  Os tecidos são escolhidos com carinho — o cetim que desliza suave na pele, as
                  cores que combinam com cada humor, os detalhes que fazem cada peça parecer um
                  presente que você dá para si mesma.
                </p>
                <p className="text-muted leading-relaxed">
                  A Sarambi acredita que a moda íntima não precisa ser escondida nem ser
                  complicada. Ela pode ser simples, bonita e completamente sua.
                </p>
              </div>

              <div className="flex flex-col gap-6">
                {[
                  { title: "Conforto Real", desc: "Tecidos que abraçam, não que prendem." },
                  { title: "Beleza Autêntica", desc: "Para todas as formas e fases da vida." },
                  { title: "Exclusividade", desc: "Peças que parecem únicas porque são feitas com alma." },
                ].map((item) => (
                  <div key={item.title} className="border-l-2 border-rose pl-4">
                    <h3 className="font-display text-lg text-ink">{item.title}</h3>
                    <p className="text-muted text-sm mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Galeria */}
        <section className="py-12 px-6 bg-cream-dark">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                "/images/gallery-1.jpg",
                "/images/gallery-2.jpg",
                "/images/gallery-3.jpg",
                "/images/gallery-4.jpg",
              ].map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden">
                  <Image src={src} alt={`Sarambi ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Manifesto final */}
        <section className="py-24 px-6 bg-cream">
          <div className="max-w-2xl mx-auto text-center">
            <Image
              src="/images/logo-dark.png"
              alt="Sarambi"
              width={160}
              height={52}
              className="mx-auto mb-10 opacity-60"
            />
            <blockquote className="font-display text-2xl md:text-3xl text-ink leading-relaxed italic mb-8">
              &ldquo;Que cada pessoa possa ser muitas coisas ao mesmo tempo — e que isso seja
              exatamente o que torna a vida tão especial.&rdquo;
            </blockquote>
            <p className="text-muted text-sm mb-10">— Fundadora da Sarambi</p>

            <Link
              href="/colecao"
              className="inline-flex items-center gap-2 bg-ink text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all duration-300"
            >
              Conhecer a coleção
              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </article>

      <Footer />
    </>
  );
}
