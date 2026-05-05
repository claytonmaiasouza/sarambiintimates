"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import type { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-cream-dark overflow-hidden">
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-700 ${
            hovered ? "scale-105" : "scale-100"
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fallbackClassName="absolute inset-0"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-rose text-ink text-xs uppercase tracking-widest px-2 py-1">
            {product.badge}
          </span>
        )}

        {/* Hover overlay */}
        <Link
          href={`/colecao/${product.slug}`}
          className={`absolute inset-0 flex flex-col items-center justify-end pb-6 gap-2 transition-all duration-300 ${
            hovered ? "opacity-100 bg-ink/20" : "opacity-0"
          }`}
        >
          <span className="bg-cream text-ink text-xs uppercase tracking-widest px-6 py-3 hover:bg-rose transition-colors w-4/5 text-center">
            Ver produto
          </span>
        </Link>
      </div>

      {/* Info */}
      <Link href={`/colecao/${product.slug}`} className="pt-4 flex flex-col gap-1 group/info">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-display text-base text-ink group-hover/info:text-gold transition-colors">{product.name}</h3>
            <p className="text-muted text-xs mt-0.5">
              {product.colors.join(" · ")}
            </p>
          </div>
          <span className="font-display text-base text-ink">
            R${" "}
            {product.price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Sizes */}
        <div className="flex gap-1 mt-2">
          {product.sizes.map((size) => (
            <span
              key={size}
              className="text-xs border border-border text-muted px-2 py-0.5"
            >
              {size}
            </span>
          ))}
        </div>

        <span className="mt-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted group-hover/info:text-ink transition-colors">
          <ShoppingBag size={13} />
          Ver detalhes
        </span>
      </Link>
    </div>
  );
}
