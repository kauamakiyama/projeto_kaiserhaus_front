import React, { useMemo, useRef, useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import "../styles/Cardapio.css";
import douradoImg from "../assets/login/dourado.png";

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8000";

type CategoryKey = "entradas" | "pratos" | "Sobremesas" | "bebidas";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: CategoryKey;
};

const CATEGORIES: { key: CategoryKey; label: string; image: string }[] = [
  {
    key: "entradas",
    label: "Entradas",
    image:
      "https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=400&auto=format&fit=crop",
  },
  {
    key: "pratos",
    label: "Pratos",
    image:
      "https://images.unsplash.com/photo-1460306855393-0410f61241c7?q=80&w=400&auto=format&fit=crop",
  },
  {
    key: "Sobremesas",
    label: "Sobremesas",
    image:
      "https://images.unsplash.com/photo-1505250469679-203ad9ced0cb?q=80&w=400&auto=format&fit=crop",
  },
  {
    key: "bebidas",
    label: "Bebidas",
    image:
      "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=400&auto=format&fit=crop",
  },
];


const BEST_IDS: string[] = []; // ajuste quando tiver os IDs reais

const mapCategoryId = (categoriaId: string): CategoryKey => {
  const categoryMap: Record<string, CategoryKey> = {
    "68e40bb06dafd5b8a433c1f7": "entradas",
    "68e40cdc6dafd5b8a433c1f9": "pratos",
    "68e40cfe6dafd5b8a433c1fa": "Sobremesas",
    "68e40d366dafd5b8a433c1fb": "bebidas",
  };
  return categoryMap[categoriaId] || "entradas";
};

const coerceId = (p: any): string =>
  p?.id ?? p?._id?.$oid ?? p?._id ?? (typeof crypto !== "undefined" ? crypto.randomUUID() : String(Math.random()));

const CardapioPage: React.FC = () => {
  const [cartTotal] = useState<number>(0);
  const [selected, setSelected] = useState<CategoryKey | "todos">("todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  const sectionRefs = useRef<Record<CategoryKey, HTMLDivElement | null>>({
    entradas: null,
    pratos: null,
    Sobremesas: null,
    bebidas: null,
  });

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(`${BASE_URL}/produtos`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: any[] = await res.json();

      const mapped: Product[] = data.map((product: any) => ({
        id: coerceId(product),
        name: product.titulo ?? product.nome ?? product.name ?? "Produto",
        description: product.descricao ?? product.description ?? "",
        price: Number(product.preco ?? product.price ?? 0),
        imageUrl:
          typeof product.imagem === "string" && product.imagem.startsWith("http")
            ? product.imagem
            : `${BASE_URL}${product.imagem ?? ""}`,
        category: mapCategoryId(product.categoria_id),
      }));

      setProducts(mapped);
    } catch (e) {
      console.error("Erro ao buscar produtos:", e);
      setError("Erro ao carregar produtos. Usando dados de exemplo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const bestSellers = useMemo(
    () =>
      (BEST_IDS.length ? products.filter((p) => BEST_IDS.includes(p.id)) : products).slice(0, 6),
    [products]
  );

  const byCategory: Record<CategoryKey, Product[]> = useMemo(() => {
    return {
      entradas: products.filter((p) => p.category === "entradas"),
      pratos: products.filter((p) => p.category === "pratos"),
      Sobremesas: products.filter((p) => p.category === "Sobremesas"),
      bebidas: products.filter((p) => p.category === "bebidas"),
    };
  }, [products]);

  const goTo = (key: CategoryKey) => {
    setSelected(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (isLoading) {
    return (
      <div className="menu-page">
        <div className="menu-header">
          <h1 className="menu-title">Cardápio</h1>
          <img src={douradoImg} alt="" className="menu-divider" />
        </div>
        <div style={{ textAlign: "center", padding: "2rem", color: "#472304" }}>
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h1 className="menu-title">Cardápio</h1>
        <img src={douradoImg} alt="" className="menu-divider" />
        <button className="bag-pill" type="button" aria-label="Ver sacola">
          <span className="bag-amount">
            {cartTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          <span className="bag-text">Ver sacola</span>
        </button>
      </div>

      {error && (
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            backgroundColor: "#FEE2E2",
            color: "#DC2626",
            margin: "1rem",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <section className="category-strip" aria-label="Categorias">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            data-key={c.key}
            className={`category-chip ${selected === c.key ? "is-active" : ""}`}
            onClick={() => goTo(c.key)}
            type="button"
          >
            <span className="chip-thumb">
              <img src={c.image} alt="" />
            </span>
            <span className="chip-label">{c.label}</span>
          </button>
        ))}
      </section>

      <section className="best-section" aria-labelledby="best-title">
        <h2 id="best-title" className="section-title with-accent">
          Mais pedidos
        </h2>

        <div className="best-scroll">
          {bestSellers.map((p) => (
            <article key={p.id} className="best-card">
              <img src={p.imageUrl} alt={p.name} className="best-thumb" />
              <div className="best-info">
                <h3 className="best-name">{p.name}</h3>
                <div className="best-bottom">
                  <span className="best-price">
                    {p.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                  <button
                    className="best-add"
                    onClick={() =>
                      addToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image: p.imageUrl,
                        category: p.category,
                      })
                    }
                    aria-label={`Adicionar ${p.name}`}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        ref={(el: HTMLDivElement | null) => {
          sectionRefs.current.entradas = el;
        }}
        id="entradas"
        className="menu-section"
        aria-labelledby="entradas-title"
      >
        <h2 id="entradas-title" className="section-title">
          Entradas
        </h2>
        <div className="product-list product-list--grid">
          {byCategory.entradas.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              category={p.category}
              variant="card"
            />
          ))}
        </div>
      </section>

      <section
        ref={(el: HTMLDivElement | null) => {
          sectionRefs.current.pratos = el;
        }}
        id="pratos"
        className="menu-section"
        aria-labelledby="pratos-title"
      >
        <h2 id="pratos-title" className="section-title">
          Pratos
        </h2>
        <div className="product-list product-list--grid">
          {byCategory.pratos.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              category={p.category}
              variant="card"
            />
          ))}
        </div>
      </section>

      <section
        ref={(el: HTMLDivElement | null) => {
          sectionRefs.current.Sobremesas = el;
        }}
        id="Sobremesas"
        className="menu-section"
        aria-labelledby="Sobremesas-title"
      >
        <h2 id="Sobremesas-title" className="section-title">
          Sobremesas
        </h2>
        <div className="product-list product-list--grid">
          {byCategory.Sobremesas.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              category={p.category}
              variant="card"
            />
          ))}
        </div>
      </section>

      <section
        ref={(el: HTMLDivElement | null) => {
          sectionRefs.current.bebidas = el;
        }}
        id="bebidas"
        className="menu-section"
        aria-labelledby="bebidas-title"
      >
        <h2 id="bebidas-title" className="section-title">
          Bebidas
        </h2>
        <div className="product-list product-list--grid">
          {byCategory.bebidas.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              category={p.category}
              variant="card"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CardapioPage;
