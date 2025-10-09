import React, { useMemo, useState } from "react";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/GerenciarCategorias.css";
import douradoImg from "../../assets/login/dourado.png";

type Categoria = {
  id: string;
  label: string;
  slug: string;
};

const CATEGORIAS_BASE: Categoria[] = [
  { id: "1", label: "Entradas",        slug: "entradas" },
  { id: "2", label: "Pratos",   slug: "pratos" },
  { id: "3", label: "Sobremesas",           slug: "sobremesas" },
  { id: "4", label: "Bebidas",  slug: "bebidas" },
];

const GerenciarCategorias: React.FC = () => {
  const [busca, setBusca] = useState("");

  const categoriasFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return CATEGORIAS_BASE;
    return CATEGORIAS_BASE.filter((c) => c.label.toLowerCase().includes(q));
  }, [busca]);

  const handleAbrirCategoria = (cat: Categoria) => {
    console.log("Abrir categoria:", cat.slug);
  };

  const handleAdicionarCategoria = () => {
    console.log("Adicionar nova categoria");
  };

  return (
    <>
        <Header />
        <main className="gc-page">
        <section className="gc-container">
            <h1 className="gc-title">Editar cardápio</h1>
            <img
              src={douradoImg}
              alt=""
              aria-hidden
              className="adm-divider-img"
            />

            <div className="gc-panel">
            <div className="gc-search">
                <span className="gc-search-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                    <path d="M20 20L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                </span>
                <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por título ou nome"
                aria-label="Buscar categorias por título ou nome"
                className="gc-search-input"
                />
            </div>

            <div className="gc-grid">
                {categoriasFiltradas.map((cat) => (
                <button
                    key={cat.id}
                    className="gc-card"
                    onClick={() => handleAbrirCategoria(cat)}
                >
                    {cat.label}
                </button>
                ))}

                <button
                className="gc-card add"
                onClick={handleAdicionarCategoria}
                aria-label="Adicionar nova categoria"
                title="Adicionar nova categoria"
                >
                <span className="gc-plus">+</span>
                </button>
            </div>
            </div>
        </section>
        </main>
        <Footer />
    </>
  );
};

export default GerenciarCategorias;
