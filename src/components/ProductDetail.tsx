"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ChevronLeft, ChevronRight, ArrowLeft, ZoomIn, X } from "lucide-react";
import type { Product } from "@/lib/products";
import TryOnModal from "@/components/TryOnModal";

const categoryLabel: Record<string, string> = {
  conjunto: "Conjunto",
  camisa: "Camisa",
  kimono: "Kimono",
  camisola: "Camisola",
  regata: "Regata",
  short: "Short",
  sambacanzione: "Sambacanzione",
  top: "Top",
};

export default function ProductDetail({ product }: { product: Product }) {
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [imgStyle, setImgStyle] = useState<React.CSSProperties>({});
  const galleryRef = useRef<HTMLDivElement>(null);

  const prev = () => setActiveImg((i) => (i === 0 ? product.images.length - 1 : i - 1));
  const next = () => setActiveImg((i) => (i === product.images.length - 1 ? 0 : i + 1));

  // Zoom + pan on hover
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = galleryRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const scale = 2.5;
    const tx = (0.5 - x) * (scale - 1) * 50;
    const ty = (0.5 - y) * (scale - 1) * 50;
    setImgStyle({ transform: `scale(${scale}) translate(${tx}%, ${ty}%)`, cursor: "crosshair" });
  }, [zoomed]);

  const handleMouseLeave = useCallback(() => {
    setImgStyle({ transform: "scale(1)", transition: "transform 0.3s ease" });
    setTimeout(() => setImgStyle({}), 300);
  }, []);

  // Close lightbox on ESC
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, activeImg]);

  return (
    <>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        <Link
          href="/colecao"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted hover:text-ink transition-colors"
        >
          <ArrowLeft size={13} />
          Voltar para coleção
        </Link>
      </div>

      {/* Main product section */}
      <section className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          {/* Main image */}
          <div
            ref={galleryRef}
            className="relative aspect-[3/4] bg-cream-dark overflow-hidden group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
              style={{ ...imgStyle, transition: zoomed ? "none" : undefined }}
              sizes="(max-width: 1024px) 100vw, 50vw"
              unoptimized
              priority
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-rose text-ink text-xs uppercase tracking-widest px-2.5 py-1 z-10">
                {product.badge}
              </span>
            )}

            {/* Zoom toggle */}
            <button
              onClick={() => setZoomed((z) => !z)}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all ${
                zoomed
                  ? "bg-ink text-cream"
                  : "bg-cream/80 text-ink opacity-0 group-hover:opacity-100"
              }`}
              title={zoomed ? "Desativar zoom" : "Ativar zoom"}
            >
              <ZoomIn size={16} />
            </button>

            {/* Expand to lightbox */}
            <button
              onClick={() => setLightbox(true)}
              className="absolute bottom-4 right-4 z-10 bg-cream/80 text-ink p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cream"
              title="Ver em tela cheia"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
              </svg>
            </button>

            {/* Zoom hint */}
            {zoomed && (
              <div className="absolute bottom-4 left-4 z-10 bg-ink/70 text-cream text-xs px-2.5 py-1 rounded-full">
                Mova o mouse para explorar
              </div>
            )}

            {product.images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-cream/80 hover:bg-cream text-ink p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-cream/80 hover:bg-cream text-ink p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative flex-shrink-0 w-20 aspect-[3/4] overflow-hidden transition-all ${
                    i === activeImg
                      ? "ring-2 ring-ink ring-offset-1"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-28">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.collection && (
              <span className="text-xs uppercase tracking-widest text-gold border border-gold/40 px-2.5 py-1">
                {product.collection}
              </span>
            )}
            <span className="text-xs uppercase tracking-widest text-muted border border-border px-2.5 py-1">
              {categoryLabel[product.category] ?? product.category}
            </span>
          </div>

          <div>
            <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">
              {product.name}
            </h1>
            <p className="text-2xl font-display text-ink mt-3">
              R${" "}
              {product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-muted mt-1">em até 3× sem juros</p>
          </div>

          <p className="text-muted text-base leading-relaxed border-t border-border pt-6">
            {product.description}
          </p>

          {/* Colors */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-2">
              Cor — <span className="text-ink">{product.colors.join(", ")}</span>
            </p>
          </div>

          {/* Sizes */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-3">
              Tamanho{selectedSize ? ` — ${selectedSize}` : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-sm border transition-all ${
                    selectedSize === size
                      ? "bg-ink text-cream border-ink"
                      : "border-border text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-ink text-cream py-4 text-sm uppercase tracking-widest hover:bg-gold hover:text-ink transition-all duration-300"
            >
              <Sparkles size={15} />
              Experimentar virtualmente
            </button>
            <a
              href={`https://wa.me/5500000000000?text=Olá! Tenho interesse no ${product.name} (R$ ${product.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })})`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 border border-border text-ink py-4 text-sm uppercase tracking-widest hover:border-ink transition-colors"
            >
              Comprar pelo WhatsApp
            </a>
          </div>

          {/* Care */}
          <div className="bg-cream-dark p-4 text-xs text-muted leading-relaxed">
            <p className="font-medium text-ink mb-1 uppercase tracking-widest text-xs">Cuidados</p>
            Lavar à mão ou máquina até 40 °C · Não usar alvejante · Secar à sombra · Passar a ferro em temperatura adequada · Não lavar a seco
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 text-cream/70 hover:text-cream p-2"
            onClick={() => setLightbox(false)}
            aria-label="Fechar"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <span className="absolute top-6 left-1/2 -translate-x-1/2 text-cream/40 text-xs tracking-widest">
            {activeImg + 1} / {product.images.length}
          </span>

          {/* Image */}
          <div
            className="relative w-full max-w-2xl max-h-[90vh] aspect-[3/4] mx-6"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={product.images[activeImg]}
              alt={product.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Nav */}
          {product.images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-cream/10 hover:bg-cream/20 text-cream p-3 rounded-full transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-cream/10 hover:bg-cream/20 text-cream p-3 rounded-full transition-colors"
                aria-label="Próxima"
              >
                <ChevronRight size={24} />
              </button>

              {/* Thumbnail strip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {product.images.map((src, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setActiveImg(i); }}
                    className={`relative w-12 aspect-[3/4] overflow-hidden transition-all ${
                      i === activeImg ? "ring-2 ring-cream" : "opacity-40 hover:opacity-80"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Try-on modal */}
      {modalOpen && <TryOnModal product={product} onClose={() => setModalOpen(false)} />}
    </>
  );
}
