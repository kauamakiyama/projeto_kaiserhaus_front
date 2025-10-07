import React, { useMemo, useRef, useState } from "react";
import { ProductCard } from "../components/ProductCard";
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

const PRODUCTS: Product[] = [
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

const BEST_IDS = ["schnitzel", "brezel", "eisbein"];

/** ===== Página ===== */
const CardapioPage: React.FC = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [selected, setSelected] = useState<CategoryKey | "todos">("todos");

  // refs das seções pra rolar suave quando clicar no chip
  const sectionRefs = useRef<Record<CategoryKey, HTMLElement | null>>({
    entradas: null,
    pratos: null,
    Sobremesas: null,
    bebidas: null,
  });

  const bestSellers = useMemo(
    () => PRODUCTS.filter((p) => BEST_IDS.includes(p.id)),
    []
  );

  const byCategory: Record<CategoryKey, Product[]> = useMemo(() => {
    return {
      entradas: PRODUCTS.filter((p) => p.category === "entradas"),
      pratos: PRODUCTS.filter((p) => p.category === "pratos"),
      Sobremesas: PRODUCTS.filter((p) => p.category === "Sobremesas"),
      bebidas: PRODUCTS.filter((p) => p.category === "bebidas"),
    };
  }, []);

  const handleAdd = (price: number, name?: string) => {
    setCartTotal((t) => t + price);
    if (name) console.log(`Adicionado: ${name}`);
  };

  const goTo = (key: CategoryKey) => {
    setSelected(key);
    const el = sectionRefs.current[key];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                    onClick={() => handleAdd(p.price, p.name)}
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
        <div className="product-list product-list--rows">
          {byCategory.entradas.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              onAddToBag={() => handleAdd(p.price, p.name)}
              variant="row"
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
        <div className="product-list product-list--rows">
          {byCategory.pratos.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              onAddToBag={() => handleAdd(p.price, p.name)}
              variant="row"
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
        <div className="product-list product-list--rows">
          {byCategory.Sobremesas.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              onAddToBag={() => handleAdd(p.price, p.name)}
              variant="row"
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
        <div className="product-list product-list--rows">
          {byCategory.bebidas.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              description={p.description}
              price={p.price}
              imageUrl={p.imageUrl}
              onAddToBag={() => handleAdd(p.price, p.name)}
              variant="row"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CardapioPage;
