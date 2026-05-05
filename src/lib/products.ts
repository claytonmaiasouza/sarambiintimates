export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  description: string;
  category: "conjunto" | "camisa" | "kimono" | "camisola" | "regata" | "short" | "sambacanzione" | "top";
  tryonCategory: "tops" | "bottoms" | "one-pieces";
  colors: string[];
  sizes: string[];
  images: string[];
  badge?: string;
  garmentImage: string;
  collection?: string;
}

const WP = "https://sarambi.com.br/wp-content/uploads/2026/02";

export const products: Product[] = [
  {
    id: "1",
    name: "Conjunto Ascensão",
    slug: "conjunto-ascensao",
    price: 489.99,
    description:
      "Elegância que eleva. O Conjunto Ascensão é feito para quem carrega leveza e força ao mesmo tempo — uma peça que traduz o momento de se permitir mais. Em cetim de alta qualidade, combina conforto com sofisticação para qualquer hora do dia.",
    category: "conjunto",
    tryonCategory: "one-pieces",
    colors: ["Bege"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Conjunto-Ascensao-3-scaled.jpg`,
      `${WP}/Conjunto-Ascensao-1-scaled.jpg`,
      `${WP}/Conjunto-Ascensao-2-scaled.jpg`,
      `${WP}/Conjunto-Ascensao-scaled.jpg`,
    ],
    badge: "Destaque",
    garmentImage: `${WP}/Conjunto-Ascensao-3-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "2",
    name: "Conjunto Despertar",
    slug: "conjunto-despertar",
    price: 399.99,
    description:
      "Para os dias em que você acorda sabendo que algo bom está por vir. O Conjunto Despertar abraça o corpo com cetim suave e um corte que valoriza cada silhueta — perfeito para começar o dia com intenção.",
    category: "conjunto",
    tryonCategory: "one-pieces",
    colors: ["Rosa"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Conjunto-Despertar-1-scaled.jpg`,
      `${WP}/Conjunto-Despertar-2-840x1260.jpg`,
      `${WP}/Conjunto-Despertar-3-840x1260.jpg`,
      `${WP}/Conjunto-Despertar-scaled.jpg`,
    ],
    badge: "Mais Vendido",
    garmentImage: `${WP}/Conjunto-Despertar-1-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "3",
    name: "Conjunto Método",
    slug: "conjunto-metodo",
    price: 349.99,
    description:
      "Disciplina com delicadeza. O Conjunto Método une um corte estruturado ao toque irresistível do cetim — para quem encontra beleza na rotina e quer se sentir bem em cada detalhe do dia.",
    category: "conjunto",
    tryonCategory: "one-pieces",
    colors: ["Azul"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Conjunto-Metodo-3-scaled.jpg`,
      `${WP}/Conjunto-Metodo-1-scaled.jpg`,
      `${WP}/Conjunto-Metodo-2-scaled.jpg`,
      `${WP}/Conjunto-Metodo-4-scaled.jpg`,
      `${WP}/Conjunto-Metodo-5-scaled.jpg`,
      `${WP}/Conjunto-Metodo-scaled.jpg`,
    ],
    garmentImage: `${WP}/Conjunto-Metodo-3-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "4",
    name: "Conjunto Bauhaus",
    slug: "conjunto-bauhaus",
    price: 339.99,
    description:
      "Inspirado no movimento que uniu arte e função, o Conjunto Bauhaus traz linhas limpas e tecido cetim em uma combinação que é ao mesmo tempo moderna e atemporal. Para quem enxerga beleza na simplicidade.",
    category: "conjunto",
    tryonCategory: "one-pieces",
    colors: ["Preto"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Conjunto-Bauhaus-1-scaled.jpg`,
      `${WP}/Conjunto-Bauhaus-2-840x1260.jpg`,
      `${WP}/Conjunto-Bauhaus-3-840x1260.jpg`,
      `${WP}/Conjunto-Bauhaus-4-840x1260.jpg`,
      `${WP}/Conjunto-Bauhaus-scaled.jpg`,
    ],
    badge: "Novidade",
    garmentImage: `${WP}/Conjunto-Bauhaus-1-scaled.jpg`,
    collection: "Bauhauss",
  },
  {
    id: "5",
    name: "Kimono Bauhaus",
    slug: "kimono-bauhaus",
    price: 299.99,
    description:
      "O Kimono Bauhaus é a peça que transforma qualquer momento em ritual. Com corte fluido e cetim de toque suave, ele envolve o corpo com leveza e presença — do café da manhã até a noite.",
    category: "kimono",
    tryonCategory: "one-pieces",
    colors: ["Preto"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Kimono-Bauhaus-1-scaled.jpg`,
      `${WP}/Kimono-Bauhaus-2-840x1260.jpg`,
      `${WP}/Kimono-Bauhaus-3-840x1260.jpg`,
      `${WP}/Kimono-Bauhaus-4-840x1260.jpg`,
    ],
    garmentImage: `${WP}/Kimono-Bauhaus-1-scaled.jpg`,
    collection: "Bauhauss",
  },
  {
    id: "6",
    name: "Camisa Oversized Ritmo Azul",
    slug: "camisa-oversized-ritmo-azul",
    price: 329.99,
    description:
      "Uma camisa que tem ritmo próprio. O corte oversized cria movimento, o cetim azul traz frescor, e o resultado é uma peça que combina com qualquer humor — do relaxado ao confiante.",
    category: "camisa",
    tryonCategory: "tops",
    colors: ["Azul"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Camisa-Oversized-Ritmo-Azul-3-scaled.jpg`,
      `${WP}/Camisa-Oversized-Ritmo-Azul-1-scaled.jpg`,
      `${WP}/Camisa-Oversized-Ritmo-Azul-2-scaled.jpg`,
      `${WP}/Camisa-Oversized-Ritmo-Azul-scaled.jpg`,
    ],
    garmentImage: `${WP}/Camisa-Oversized-Ritmo-Azul-3-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "7",
    name: "Camisa Oversized Ritmo Amarela",
    slug: "camisa-oversized-ritmo-amarela",
    price: 329.99,
    description:
      "Alegria que cabe no corpo. A Camisa Oversized Ritmo Amarela é para quem não tem medo de ocupar espaço — com corte generoso, cetim acetinado e uma cor que aquece qualquer ambiente.",
    category: "camisa",
    tryonCategory: "tops",
    colors: ["Amarelo"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Camisa-Oversized-Ritmo-scaled.jpg`,
      `${WP}/Camisa-Oversized-Ritmo-1-scaled.jpg`,
      `${WP}/Camisa-Oversized-Ritmo-2-scaled.jpg`,
      `${WP}/Camisa-Oversized-Ritmo-3-scaled.jpg`,
    ],
    garmentImage: `${WP}/Camisa-Oversized-Ritmo-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "8",
    name: "Camisola Gráfica",
    slug: "camisola-grafica",
    price: 239.99,
    description:
      "Arte para dormir e despertar. A Camisola Gráfica une estampas marcantes ao toque suave do cetim — uma peça que conta história sem precisar de palavras. Para as mulheres que levam a criatividade para todos os momentos.",
    category: "camisola",
    tryonCategory: "one-pieces",
    colors: ["Estampado"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Camisola-Grafica-3-scaled.jpg`,
      `${WP}/Camisola-Grafica-1-scaled.jpg`,
      `${WP}/Camisola-Grafica-2-scaled.jpg`,
      `${WP}/Camisola-Grafica-scaled.jpg`,
    ],
    badge: "Novidade",
    garmentImage: `${WP}/Camisola-Grafica-3-scaled.jpg`,
    collection: "Bauhauss",
  },
  {
    id: "9",
    name: "Top Consciência",
    slug: "top-consciencia",
    price: 209.99,
    description:
      "Minimalismo que fala alto. O Top Consciência é para quem sabe que menos é mais — um top sem alças com caimento impecável que pode ir do quarto ao mundo com a troca de uma peça.",
    category: "top",
    tryonCategory: "tops",
    colors: ["Cru"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Top-Consciencia-scaled.jpg`,
      `${WP}/Top-Consciencia-1-scaled.jpg`,
    ],
    garmentImage: `${WP}/Top-Consciencia-scaled.jpg`,
    collection: "Bauhauss",
  },
  {
    id: "10",
    name: "Short Runner Amarelo",
    slug: "short-runner-amarelo",
    price: 199.99,
    description:
      "Movimento e cor. O Short Runner Amarelo é feito para quem vive em ritmo acelerado sem perder a leveza — cetim que acompanha cada passo com conforto e estilo.",
    category: "short",
    tryonCategory: "bottoms",
    colors: ["Amarelo"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Short-Runner-Amarelo-1-scaled.jpg`,
      `${WP}/Short-Runner-Amarelo-2-scaled.jpg`,
      `${WP}/Short-Runner-Amarelo-3-scaled.jpg`,
      `${WP}/Short-Runner-Amarelo-scaled.jpg`,
    ],
    garmentImage: `${WP}/Short-Runner-Amarelo-1-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "11",
    name: "Short Runner Azul",
    slug: "short-runner-azul",
    price: 199.99,
    description:
      "Calma que se move. O Short Runner Azul traz o frescor do cetim acetinado em um corte confortável e moderno — perfeito para os dias em que você quer se sentir leve do início ao fim.",
    category: "short",
    tryonCategory: "bottoms",
    colors: ["Azul"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Short-Runner-Azul-3-scaled.jpg`,
      `${WP}/Short-Runner-Azul-scaled.jpg`,
      `${WP}/Short-Runner-Azul-2-scaled.jpg`,
      `${WP}/Short-Runner-Azul-1-scaled.jpg`,
    ],
    garmentImage: `${WP}/Short-Runner-Azul-3-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "12",
    name: "Short Runner Vermelho",
    slug: "short-runner-vermelho",
    price: 199.99,
    description:
      "Intensidade com elegância. O Short Runner Vermelho é para quem não passa despercebida — um vermelho que aquece o olhar e um tecido que abraça o corpo com a suavidade do cetim.",
    category: "short",
    tryonCategory: "bottoms",
    colors: ["Vermelho"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Short-Runner-Vermelho-1-scaled.jpg`,
      `${WP}/Short-Runner-Vermelho-2-840x1260.jpg`,
      `${WP}/Short-Runner-Vermelho-3-840x1260.jpg`,
      `${WP}/Short-Runner-Vermelho-scaled.jpg`,
    ],
    garmentImage: `${WP}/Short-Runner-Vermelho-1-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "13",
    name: "Sambacanzione Elementar",
    slug: "sambacanzione-elementar",
    price: 169.99,
    description:
      "De volta ao essencial. O Sambacanzione Elementar celebra a simplicidade com um short de cetim de corte clássico — a peça que nunca sai de moda e que combina com tudo.",
    category: "sambacanzione",
    tryonCategory: "bottoms",
    colors: ["Cru"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Sambacanzione-Elementar-3-scaled.jpg`,
      `${WP}/Sambacanzione-Elementar-840x1260.jpg`,
      `${WP}/Sambacanzione-Elementar-2-840x1260.jpg`,
      `${WP}/Sambacanzione-Elementar-1-840x1260.jpg`,
    ],
    garmentImage: `${WP}/Sambacanzione-Elementar-3-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "14",
    name: "Sambacanzione Gráfico Vermelho",
    slug: "sambacanzione-grafico-vermelho",
    price: 119.99,
    description:
      "Padrão que marca presença. O Sambacanzione Gráfico Vermelho tem estampa quadriculada que mistura atitude com o toque suave do cetim — para quem gosta de imprimir personalidade até nos menores detalhes.",
    category: "sambacanzione",
    tryonCategory: "bottoms",
    colors: ["Vermelho"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/grafico-1-scaled.jpg`,
      `${WP}/grafico-2-scaled.jpg`,
      `${WP}/grafico-3-scaled.jpg`,
      `${WP}/grafico-4-scaled.jpg`,
    ],
    garmentImage: `${WP}/grafico-1-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "15",
    name: "Regatas Clássicas",
    slug: "regatas-classicas",
    price: 95.99,
    description:
      "A base de tudo. As Regatas Clássicas Sarambi são a peça coringa do seu guarda-roupa — disponíveis em cinco cores para combinar com qualquer mood. Cetim leve, corte perfeito, conforto sem abrir mão do estilo.",
    category: "regata",
    tryonCategory: "tops",
    colors: ["Amarelo", "Azul", "Branco", "Preto", "Vermelho"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/preta-4-scaled.jpg`,
      `${WP}/amarela-4-scaled.jpg`,
      `${WP}/azul-4-scaled.jpg`,
      `${WP}/branca-1-1-scaled.jpg`,
      `${WP}/vermelha-1-1-scaled.jpg`,
    ],
    badge: "5 Cores",
    garmentImage: `${WP}/preta-4-scaled.jpg`,
    collection: "Clássicos",
  },
  {
    id: "16",
    name: "Blusa 33",
    slug: "blusa-33",
    price: 19.90,
    description:
      "Leveza e estilo em um número especial. A Blusa 33 é uma peça com toque suave e corte versátil — pensada para quem busca conforto sem abrir mão de um visual cuidado.",
    category: "top",
    tryonCategory: "tops",
    colors: ["Natural"],
    sizes: ["PP", "P", "M", "G", "GG"],
    images: [
      `${WP}/Top-Consciencia-840x1260.jpg`,
      `${WP}/Top-Consciencia-scaled.jpg`,
    ],
    garmentImage: `${WP}/Top-Consciencia-840x1260.jpg`,
    collection: "Bauhauss",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
