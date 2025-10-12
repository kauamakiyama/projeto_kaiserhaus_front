import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/GerenciarCategorias.css";
import douradoImg from "../../assets/login/dourado.png";
import { apiGet } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

type Categoria = {
  id: string;
  label: string;
  slug: string;
};

const GerenciarCategorias: React.FC = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const { token } = useAuth();

  // Carregar categorias da API
  useEffect(() => {
    const carregarCategorias = async () => {
      setLoading(true);
      setErro("");
      try {
        const categoriasApi = await apiGet<any[]>('/categorias/', token || undefined);
        const categoriasFormatadas = categoriasApi.map((cat: any) => ({
          id: cat._id,
          label: cat.nome,
          slug: cat.slug || cat.nome.toLowerCase()
        }));
        setCategorias(categoriasFormatadas);
      } catch (e: any) {
        setErro("Não foi possível carregar categorias da API. Usando dados padrão.");
        // Fallback para dados básicos se API falhar
        setCategorias([
          { id: "1", label: "Entradas", slug: "entradas" },
          { id: "2", label: "Pratos", slug: "pratos" },
          { id: "3", label: "Sobremesas", slug: "sobremesas" },
          { id: "4", label: "Bebidas", slug: "bebidas" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    carregarCategorias();
  }, [token]);

  const categoriasFiltradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return categorias;
    return categorias.filter((c) => c.label.toLowerCase().includes(q));
  }, [busca, categorias]);

  const handleAbrirCategoria = (cat: Categoria) => {
    console.log("Abrir categoria:", cat.slug);
    
    // Se for a categoria "Pratos", navegar para a página específica
    if (cat.label.toLowerCase().includes('prato') || cat.slug === 'pratos') {
      navigate('/admin/categorias/pratos');
    } else {
      // Para outras categorias, apenas log por enquanto
      console.log("Categoria não implementada ainda:", cat.label);
    }
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
              {erro && <div className="gc-alert">{erro}</div>}
              
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

              {loading ? (
                <div className="gc-loading">Carregando categorias...</div>
              ) : (
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
              )}
            </div>
        </section>
        </main>
        <Footer />
    </>
  );
};

export default GerenciarCategorias;
