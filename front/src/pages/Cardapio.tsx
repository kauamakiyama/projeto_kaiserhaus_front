import React, { useMemo, useRef, useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import "../styles/Cardapio.css";
import douradoImg from "../assets/login/dourado.png";

const BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) || "http://127.0.0.1:8001";

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

// Usa apenas IDs provenientes do backend para evitar itens que não existem no banco
const coerceId = (p: any): string => {
  const candidate = p?._id?.$oid ?? p?._id ?? p?.produtoId ?? p?.id ?? p?.codigo ?? p?.sku;
  return candidate ? String(candidate) : '';
};

const isLikelyBase64 = (s: any): boolean => {
  if (typeof s !== "string") return false;
  if (s.startsWith("data:")) return true;
  // Heurística simples: string longa com caracteres base64
  return /^[A-Za-z0-9+/=]+$/.test(s) && s.length > 200;
};

const resolveImageUrl = (product: any): string => {
  const raw = product.imagem ?? product.image ?? product.imageUrl ?? "";
  const mime = product.imagemMime || product.mime || product.contentType || "image/avif"; // ajuste se o backend expuser o mime

  if (typeof raw !== "string" || raw.length === 0) return "";
  if (raw.startsWith("http")) return raw;
  if (raw.startsWith("/")) return `${BASE_URL}${raw}`;
  if (raw.startsWith("data:")) return raw;
  if (isLikelyBase64(raw)) return `data:${mime};base64,${raw}`;
  return String(raw);
};

const CardapioPage: React.FC = () => {
  const [selected, setSelected] = useState<CategoryKey | "todos">("todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();

  const sectionRefs = useRef<Record<CategoryKey, HTMLDivElement | null>>({
    entradas: null,
    pratos: null,
    Sobremesas: null,
    bebidas: null,
  });
  const bestScrollRef = useRef<HTMLDivElement>(null);

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
        price: parseFloat(String(product.preco ?? product.price ?? 0)) || 0,
        imageUrl: resolveImageUrl(product),
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

  const bestSellers = useMemo(
    () =>
      (BEST_IDS.length ? products.filter((p) => BEST_IDS.includes(p.id)) : products).slice(0, 6),
    [products]
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto scroll para o carrossel dos mais pedidos
  useEffect(() => {
    if (!bestScrollRef.current || bestSellers.length <= 3) return;

    const scrollContainer = bestScrollRef.current;
    let scrollPosition = 0;
    let isPaused = false;
    let intervalId: NodeJS.Timeout;
    
    // Pausar quando o usuário interagir
    const handleMouseEnter = () => { isPaused = true; };
    const handleMouseLeave = () => { isPaused = false; };
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    const autoScroll = () => {
      if (isPaused) return;
      
      const scrollWidth = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      // Só faz scroll se há conteúdo para rolar
      if (scrollWidth <= 0) return;
      
      scrollPosition += 1;
      
      if (scrollPosition >= scrollWidth) {
        scrollPosition = 0;
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft = scrollPosition;
      }
    };

    // Inicia o scroll após um delay
    const timeout = setTimeout(() => {
      intervalId = setInterval(autoScroll, 100);
    }, 3000);
    
    return () => {
      clearTimeout(timeout);
      if (intervalId) clearInterval(intervalId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [bestSellers]);

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
      <>
        <Header />
        <div className="menu-page">
          <div className="menu-header">
            <h1 className="menu-title">Cardápio</h1>
            <img src={douradoImg} alt="" className="menu-divider" />
          </div>
          <div style={{ textAlign: "center", padding: "2rem", color: "#472304" }}>
            <p>Carregando produtos...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  const formatPrice = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <Header />
      <div className="menu-page">
        <div className="menu-header">
          <h1 className="menu-title">Cardápio</h1>
          <img src={douradoImg} alt="" className="menu-divider" />
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

          <div className="best-scroll" ref={bestScrollRef}>
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
                      onClick={() => {
                        addToCart({
                          id: p.id,
                          name: p.name,
                          price: p.price,
                          image: p.imageUrl,
                          category: p.category,
                        });
                        openDrawer();
                      }}
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
                onAdded={openDrawer}
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
                onAdded={openDrawer}
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
                onAdded={openDrawer}
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
                onAdded={openDrawer}
              />
            ))}
          </div>
        </section>
        {/* Botão flutuante para abrir a sacola */}
        <button
          type="button"
          className="cart-fab"
          aria-label={isDrawerOpen ? "Fechar sacola" : "Abrir sacola"}
          onClick={toggleDrawer}
        >
          🛍️
        </button>

        {/* Drawer: overlay e painel lateral */}
        <div className={`cart-overlay ${isDrawerOpen ? 'is-open' : ''}`} onClick={closeDrawer} aria-hidden={!isDrawerOpen}></div>
        <div className={`cart-drawer ${isDrawerOpen ? 'is-open' : ''}`} aria-hidden={!isDrawerOpen}>
          <div className="cart-drawer-header">
            <h3>Sua sacola</h3>
            <button className="drawer-close" onClick={closeDrawer} aria-label="Fechar">×</button>
          </div>
          <div className="cart-drawer-body">
            <div className="side-cart-items">
              {cartItems.length === 0 && (
                <p className="side-cart-empty" style={{color:'#472304'}}>Sua sacola está vazia</p>
              )}
              {cartItems.map((item) => (
                <div key={item.id} className="side-cart-item">
                  <img src={item.image} alt={item.name} className="side-cart-thumb" />
                  <div className="side-cart-info">
                    <div className="side-cart-row">
                      <span className="side-cart-name">{item.name}</span>
                      <button className="side-cart-remove" onClick={() => removeFromCart(item.id)} aria-label="Remover">×</button>
                    </div>
                    <div className="side-cart-row">
                      <div className="side-cart-qty">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Diminuir">-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Aumentar">+</button>
                      </div>
                      <div className="side-cart-prices">
                        <span className="side-cart-price">{formatPrice(item.price)}</span>
                        <span className="side-cart-subtotal">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="side-cart-footer">
              <div className="side-cart-total-row">
                <span>Total</span>
                <strong>{formatPrice(getTotalPrice())}</strong>
              </div>
              <a href="/sacola" className="side-cart-button">Ir para a sacola</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CardapioPage;