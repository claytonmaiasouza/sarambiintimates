"use client";

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";

const categories = [
  { key: "todos", label: "Todos" },
  { key: "conjunto", label: "Conjuntos" },
  { key: "camisa", label: "Camisas" },
  { key: "kimono", label: "Kimonos" },
  { key: "camisola", label: "Camisolas" },
  { key: "top", label: "Tops" },
  { key: "regata", label: "Regatas" },
  { key: "short", label: "Shorts" },
  { key: "sambacanzione", label: "Sambacanziones" },
];

export default function ColecaoGrid() {
  const [active, setActive] = useState("todos");

  const filtered: Product[] =
    active === "todos" ? products : products.filter((p) => p.category === active);

  return (
    <>
      {/* Filter bar */}
      <div className="bg-cream border-b border-border sticky top-0 z-40 px-6">
        <div className="max-w-7xl mx-auto flex gap-6 overflow-x-auto py-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              className={`text-xs uppercase tracking-widest whitespace-nowrap pb-1 border-b-2 transition-colors ${
                active === cat.key
                  ? "text-ink border-ink"
                  : "text-muted border-transparent hover:text-ink hover:border-ink/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="text-muted">Nenhum produto encontrado.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
