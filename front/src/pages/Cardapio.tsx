import React, { useMemo, useRef, useState, useEffect } from "react";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import "../styles/Cardapio.css";
import douradoImg from "../assets/login/dourado.png";

/** ===== Tipos e dados de exemplo ===== */
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

// Dados de exemplo (serão substituídos pelos dados do banco)
const EXAMPLE_PRODUCTS: Product[] = [
  {
    id: "sauerkraut",
    name: "Sauerkraut",
    description: "Repolho fermentado, com grãos de mostarda",
    price: 27.99,
    imageUrl:
      "https://images.unsplash.com/photo-1604908553721-569ce10b20aa?q=80&w=600&auto=format&fit=crop",
    category: "entradas",
  },
  {
    id: "kartoffelsalat",
    name: "Kartoffelsalat",
    description: "Salada de batatas alemã, com acompanhamento",
    price: 37.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505576633757-0ac1084af824?q=80&w=600&auto=format&fit=crop",
    category: "entradas",
  },
  {
    id: "queijos",
    name: "Seleção de Queijos",
    description: "Emmental e Münster, com mostarda e pão",
    price: 27.99,
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600&auto=format&fit=crop",
    category: "entradas",
  },
  {
    id: "bratwurst",
    name: "Bratwurst",
    description: "Salsicha alemã grelhada com especiarias",
    price: 34.5,
    imageUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=600&auto=format&fit=crop",
    category: "pratos",
  },
  {
    id: "schnitzel",
    name: "Schnitzel",
    description: "Milanesa alemã com batatas",
    price: 35.99,
    imageUrl:
      "https://images.unsplash.com/photo-1625944526005-498f4ca1a68f?q=80&w=600&auto=format&fit=crop",
    category: "pratos",
  },
  {
    id: "eisbein",
    name: "Eisbein",
    description: "Joelho de porco com chucrute",
    price: 59.99,
    imageUrl:
      "https://images.unsplash.com/photo-1568600891621-50f697b9c4e3?q=80&w=600&auto=format&fit=crop",
    category: "pratos",
  },
  {
    id: "strudel",
    name: "Apfelstrudel",
    description: "Strudel de maçã com canela",
    price: 18.9,
    imageUrl:
      "https://images.unsplash.com/photo-1604908177074-005f3b5b7b66?q=80&w=600&auto=format&fit=crop",
    category: "Sobremesas",
  },
  {
    id: "cafe",
    name: "Café",
    description: "Café filtrado ou espresso",
    price: 7.5,
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=600&auto=format&fit=crop",
    category: "bebidas",
  },
  {
    id: "chope",
    name: "Chope",
    description: "Pilsen gelado",
    price: 12.0,
    imageUrl:
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?q=80&w=600&auto=format&fit=crop",
    category: "bebidas",
  },
];

// IDs dos produtos mais pedidos (ajustar conforme seus produtos reais)
const BEST_IDS = ["68e4296c80c36cc86b34e108", "68e4172649baa35c2c95542b", "68e429c080c36cc86b34e109"];

/** ===== Página ===== */
const CardapioPage: React.FC = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [selected, setSelected] = useState<CategoryKey | "todos">("todos");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // refs das seções pra rolar suave quando clicar no chip
  const sectionRefs = useRef<Record<CategoryKey, HTMLElement | null>>({
    entradas: null,
    pratos: null,
    Sobremesas: null,
    bebidas: null,
  });

  // Função para buscar produtos do banco de dados
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8001/produtos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Dados recebidos do backend:', data);
      
      // Mapear os dados do backend para o formato esperado
      const mappedProducts = data.map((product: any) => ({
        id: product.id,
        name: product.titulo,
        description: product.descricao,
        price: product.preco,
        imageUrl: product.imagem.startsWith('http') 
          ? product.imagem 
          : `http://localhost:8001${product.imagem}`, // Usar imagens do backend
        category: mapCategoryId(product.categoria_id)
      }));
      
      console.log('Produtos mapeados:', mappedProducts);
      setProducts(mappedProducts);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Erro ao carregar produtos. Usando dados de exemplo.');
      setProducts(EXAMPLE_PRODUCTS); // Fallback para dados de exemplo
    } finally {
      setIsLoading(false);
    }
  };

  // Função para mapear categoria_id para categoria
  const mapCategoryId = (categoriaId: string): CategoryKey => {
    // Mapear os IDs das categorias para as chaves esperadas
    const categoryMap: Record<string, CategoryKey> = {
      "68e40bb06dafd5b8a433c1f7": "entradas", // Entradas
      "68e40cdc6dafd5b8a433c1f9": "pratos",   // Pratos
      "68e40cfe6dafd5b8a433c1fa": "Sobremesas", // Sobremesas
      "68e40d366dafd5b8a433c1fbc": "bebidas"  // Bebidas
    };
    
    return categoryMap[categoriaId] || "entradas"; // Fallback para entradas
  };

  // Carrega produtos quando o componente monta
  useEffect(() => {
    fetchProducts();
  }, []);

  const bestSellers = useMemo(
    () => products.filter((p) => BEST_IDS.includes(p.id)),
    [products]
  );

  const byCategory: Record<CategoryKey, Product[]> = useMemo(() => {
    return {
      entradas: PRODUCTS.filter((p) => p.category === "entradas"),
      pratos: PRODUCTS.filter((p) => p.category === "pratos"),
      Sobremesas: PRODUCTS.filter((p) => p.category === "Sobremesas"),
      bebidas: PRODUCTS.filter((p) => p.category === "bebidas"),
    };
  }, [products]);


  const goTo = (key: CategoryKey) => {
    setSelected(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Se estiver carregando, mostra loading
  if (isLoading) {
    return (
      <div className="menu-page">
        <div className="menu-header">
          <h1 className="menu-title">Cardápio</h1>
          <img src={douradoImg} alt="" className="menu-divider" />
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#472304' }}>
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
        <div style={{ 
          textAlign: 'center', 
          padding: '1rem', 
          backgroundColor: '#FEE2E2', 
          color: '#DC2626',
          margin: '1rem',
          borderRadius: '8px'
        }}>
          {error}
        </div>
      )}

      {/* Chips de categorias */}
      <section className="category-strip" aria-label="Categorias">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            data-key={c.key}
            className={`category-chip ${
              selected === c.key ? "is-active" : ""
            }`}
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

      {/* Mais pedidos */}
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
                    onClick={() => addToCart({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      image: p.imageUrl,
                      category: p.category,
                    })}
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

      {/* Seções por categoria */}
      <section
        ref={(el) => { sectionRefs.current.entradas = el; }}
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
        ref={(el) => { sectionRefs.current.pratos = el; }}
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
        ref={(el) => { sectionRefs.current.Sobremesas = el; }}
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
        ref={(el) => { sectionRefs.current.bebidas = el; }}
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
