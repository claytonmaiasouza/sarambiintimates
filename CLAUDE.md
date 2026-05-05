@AGENTS.md

# Sarambi Intimates — Guia do Projeto

## O Projeto

Site de e-commerce com provador virtual por IA para a **Sarambi Intimates**, marca brasileira de pijamas e lingerie de cetim. A marca foi criada em 2013 e o nome "Sarambi" vem do Tupi-Guarani, significando "bagunça" — celebrando a diversidade das mulheres.

**URL local:** http://localhost:3000  
**Comando dev:** `npm run dev`  
**Comando build:** `npm run build`

---

## Stack Completo

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Framework | Next.js (App Router) | 16.2.4 |
| Runtime | Node.js | LTS |
| Linguagem | TypeScript | 5.x |
| CSS | Tailwind CSS | 4.x |
| Ícones | lucide-react | 1.14.x |
| Animações | framer-motion | 12.x |
| UI primitives | @radix-ui/react-dialog, @radix-ui/react-tabs | 1.x |
| Upload | react-dropzone | 15.x |
| Fontes | Google Fonts via `<link>` (Playfair Display + Inter) | — |

> **Tailwind v4**: Configuração via `globals.css` com bloco `@theme inline {}` — não existe `tailwind.config.ts`. Cores e fontes definidas como CSS custom properties.

> **Next.js 16**: `searchParams` nas pages são uma `Promise<{}>` — sempre `await searchParams`. Ler docs em `node_modules/next/dist/docs/` antes de usar APIs menos comuns.

---

## Estrutura de Arquivos

```
src/
├── app/
│   ├── layout.tsx          # Root layout (HTML, fontes Google via <link>)
│   ├── globals.css         # Tailwind @theme, variáveis de cor/fonte
│   ├── page.tsx            # Home (hero, manifesto, produtos, banner provador)
│   ├── colecao/
│   │   └── page.tsx        # Catálogo de produtos (estático)
│   ├── historia/
│   │   └── page.tsx        # História da marca (estático)
│   ├── provador/
│   │   └── page.tsx        # Provador virtual (dinâmico, await searchParams)
│   └── api/
│       └── tryon/
│           └── route.ts    # Proxy Fashn.ai → esconde API key, faz polling
│
├── components/
│   ├── Header.tsx          # Fixo, scroll-aware, mobile menu — "use client"
│   ├── Footer.tsx          # Links, newsletter, @sarambiintimates
│   ├── ProductCard.tsx     # Card com hover overlay e link p/ provador — "use client"
│   ├── SafeImage.tsx       # Wrapper de Image c/ fallback gracioso — "use client"
│   └── VirtualTryOn.tsx    # Interface do provador (upload, produto, resultado) — "use client"
│
└── lib/
    └── products.ts         # Array de produtos com tipos — fonte de verdade do catálogo
```

**Imagens:** `public/images/`  
Ver guia completo em `public/images/LEIA-ME.txt`

---

## Design System (Tailwind v4)

### Cores
```
bg-cream / text-cream        → #FAF8F4  (fundo principal)
bg-cream-dark                → #F0EBE0  (fundo secundário/seções)
bg-rose / text-rose          → #E8B4B8  (destaque feminino)
bg-rose-dark / text-rose-dark→ #C4848A
bg-gold / text-gold          → #C9A96E  (dourado/labels)
bg-gold-dark                 → #A8834A
bg-sky / text-sky            → #B8D4E3  (azul bebê)
bg-ink / text-ink            → #1A1713  (texto/fundo escuro)
text-muted                   → #8C7E73  (texto secundário)
border-border                → #E8E0D5
```

### Fontes
```css
font-display  → "Playfair Display", Georgia, serif   (títulos)
font-body     → "Inter", system-ui, sans-serif        (corpo)
```

### Padrões de UI
- Botão primário: `bg-ink text-cream px-8 py-4 text-sm uppercase tracking-widest hover:bg-gold`
- Botão borda: `border border-border text-muted hover:border-ink hover:text-ink`
- Badge produto: `bg-rose text-ink text-xs uppercase tracking-widest px-2 py-1`
- Seção clara: `py-20 px-6 bg-cream`
- Seção escura: `py-20 px-6 bg-ink`

---

## API do Provador Virtual — Fashn.ai

**Documentação:** https://fashn.ai/docs  
**Chave:** variável `FASHN_API_KEY` no `.env.local`

### Fluxo
1. `POST /api/tryon` (nossa rota) recebe `FormData` com `model_image` (File) + `garment_slug` + `category`
2. A rota em `src/app/api/tryon/route.ts` converte a imagem para base64
3. Envia para `https://api.fashn.ai/v1/run` → recebe `{ id }`
4. Polling em `https://api.fashn.ai/v1/status/{id}` a cada 3s (máx 20 tentativas = ~60s)
5. Retorna `{ output: "url_da_imagem_gerada" }`

### Categorias aceitas pela Fashn.ai
- `"tops"` — camisas, blusas
- `"bottoms"` — calças, saias
- `"one-pieces"` — vestidos, macacões, camisolas, robes

### Variáveis de ambiente
```env
FASHN_API_KEY=        # chave da Fashn.ai
NEXT_PUBLIC_BASE_URL= # URL base (ex: https://sarambi.com.br) para construir URLs de imagens
```

### Domínios permitidos no next.config.ts
```
*.fashn.ai
*.replicate.delivery   (backup, caso migre para Replicate)
pbxt.replicate.delivery
```

---

## Catálogo de Produtos

Definido em `src/lib/products.ts`. Para adicionar/editar produtos, edite o array `products` — não existe banco de dados ainda.

| ID | Nome | Categoria | Preço | tryonCategory |
|----|------|-----------|-------|---------------|
| 1 | Conjunto Cetim Rosa | conjunto | R$ 289 | tops |
| 2 | Conjunto Cetim Azul Bebê | conjunto | R$ 289 | tops |
| 3 | Camisola Branca com Debrum | camisola | R$ 219 | one-pieces |
| 4 | Robe Cetim Branco & Preto | robe | R$ 259 | one-pieces |

---

## VPS / Deploy

- **Sem GPU** — toda inferência de IA é feita via API externa (Fashn.ai)
- Deploy: `npm run build` → `npm start` (ou PM2)
- Porta padrão: 3000
- Nginx como reverse proxy recomendado

```bash
# Deploy básico com PM2
npm run build
pm2 start npm --name "sarambi" -- start
```

---

## Regras de Comportamento do Agente

**Pedir confirmação APENAS para:**
- Deletar arquivos ou pastas
- `git reset --hard`, `git push --force`, descartar branches
- Alterações em variáveis de ambiente de produção
- Mudar provedor de API (ex: trocar Fashn.ai por outro)
- Deploys em produção

**Executar diretamente (sem pedir):**
- Editar qualquer arquivo de código
- Criar novos componentes, páginas, rotas
- Instalar/remover dependências npm
- Corrigir bugs, erros de build, erros de TypeScript
- Adicionar produtos ao catálogo
- Ajustes de layout, cores, tipografia
- Criar arquivos de configuração
- Rodar `npm run dev`, `npm run build`, `npm run lint`
