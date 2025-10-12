import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/HeaderLogadoLoja";
import Footer from "../../../components/Footer";
import "../../../styles/admin/categorias/Pratos.css";
import douradoImg from "../../../assets/login/dourado.png";
import { apiGet } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

type Produto = {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  categoria_id?: string;
  categoria_nome?: string;
  ativo: boolean;
  quantidade: number;
  imagem?: string;
};

// === helper robusto para normalizar qualquer forma de ObjectId para string-hex (24 chars, lowercase)
const toIdStr = (v: any): string | undefined => {
  if (!v) return undefined;

  if (typeof v === "string") {
    const hex = v.match(/[0-9a-fA-F]{24}/)?.[0];
    return (hex ?? v).trim().toLowerCase();
  }

  if (typeof v === "object") {
    if (v.$oid) return String(v.$oid).toLowerCase();          // { $oid: "..." }
    if (v._id)  return toIdStr(v._id);                         // documento completo
    if (v.id)   return toIdStr(v.id);                          // variações "id"
    if (typeof (v as any).toHexString === "function") {
      return (v as any).toHexString().toLowerCase();           // ObjectId real
    }
    const s = String(v);
    const hex = s.match(/[0-9a-fA-F]{24}/)?.[0];
    return (hex ?? s).toLowerCase();
  }

  return String(v).toLowerCase();
};

const Pratos: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<"todos" | "ativos" | "inativos">("todos");

  useEffect(() => {
    const carregarProdutos = async () => {
      setLoading(true);
      setErro("");

      try {
        // Buscar produtos e categorias em paralelo
        const [produtosApi, categoriasApi] = await Promise.all([
          apiGet<any[]>("/produtos/", token || undefined),
          apiGet<any[]>("/categorias/", token || undefined),
        ]);

        // Montar mapa de categorias: chave SEMPRE string normalizada
        const categoriasMap = new Map<string, string>();
        for (const cat of categoriasApi) {
          const key = toIdStr(cat._id) ?? toIdStr(cat.id);
          if (!key) continue;
          const nome = cat.nome || cat.label || cat.titulo || "Sem nome";
          categoriasMap.set(key, nome);
        }

        console.log("🔑 IDs de categorias no mapa:", Array.from(categoriasMap.keys()));

        // Mapear produtos
        const produtosFormatados: Produto[] = produtosApi.map((prod: any) => {
          const catIdStr =
            toIdStr(prod.categoria_id) ??
            toIdStr(prod.categoria?._id) ??
            toIdStr(prod.categoria) ??
            toIdStr(prod.categoriaId) ??
            toIdStr(prod.categoriaID);

          const categoriaNome =
            (catIdStr && categoriasMap.get(catIdStr)) ||
            prod.categoria?.nome ||
            prod.categoria_nome ||
            "Sem categoria";

          console.log("Produto:", prod.titulo || prod.nome);
          console.log("Categoria ID (str):", catIdStr);
          console.log("Existe no mapa:", !!(catIdStr && categoriasMap.has(catIdStr)));
          console.log("Nome final:", categoriaNome);

          return {
            id: prod._id || prod.id,
            titulo: prod.titulo || prod.nome || "Produto sem nome",
            descricao: prod.descricao || "Sem descrição",
            preco: Number(prod.preco) || 0,
            categoria_id: catIdStr,
            categoria_nome: categoriaNome,
            ativo: prod.ativo !== false,
            quantidade: Number(prod.quantidade) || 0,
            imagem: prod.imagem || prod.imagemProduto,
          };
        });

        setProdutos(produtosFormatados);
      } catch (e: any) {
        console.error("Erro ao carregar produtos/categorias:", e);
        setErro("Não foi possível carregar produtos/categorias da API.");
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, [token]);

  // Filtrar produtos
  const produtosFiltrados = produtos.filter((produto) => {
    const q = busca.toLowerCase();
    const matchBusca =
      produto.titulo.toLowerCase().includes(q) ||
      produto.descricao.toLowerCase().includes(q) ||
      (produto.categoria_nome ?? "").toLowerCase().includes(q);

    const matchFiltro =
      filtroAtivo === "todos" ||
      (filtroAtivo === "ativos" && produto.ativo) ||
      (filtroAtivo === "inativos" && !produto.ativo);

    return matchBusca && matchFiltro;
  });

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleVoltar = () => {
    navigate("/admin/categorias");
  };

  const handleEditarProduto = (produtoId: string) => {
    console.log("Editar produto:", produtoId);
    // TODO: Implementar edição de produto (navegar para tela de edição, etc.)
  };

  const handleToggleStatus = async (produtoId: string) => {
    try {
      setProdutos((prev) =>
        prev.map((p) => (p.id === produtoId ? { ...p, ativo: !p.ativo } : p))
      );
      // TODO: Chamar API para persistir alteração
      console.log("Toggle status do produto:", produtoId);
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  return (
    <>
      <Header />
      <main className="pratos-page">
        <header className="pratos-header">
          <div className="pratos-title-section">
            <button
              className="pratos-voltar-btn"
              onClick={handleVoltar}
              title="Voltar para categorias"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="pratos-title">Pratos</h1>
          </div>
          <img src={douradoImg} alt="" aria-hidden className="pratos-divider-img" />
        </header>

        <section className="pratos-panel">
          {erro && <div className="pratos-alert">{erro}</div>}

          <div className="pratos-filters">
            <div className="pratos-search">
              <span className="pratos-search-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M20 20L16.65 16.65"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar pratos..."
                aria-label="Buscar pratos por nome, descrição ou categoria"
                className="pratos-search-input"
              />
            </div>

            <select
              value={filtroAtivo}
              onChange={(e) => setFiltroAtivo(e.target.value as any)}
              className="pratos-filter-select"
            >
              <option value="todos">Todos os pratos</option>
              <option value="ativos">Apenas ativos</option>
              <option value="inativos">Apenas inativos</option>
            </select>
          </div>

          {loading ? (
            <div className="pratos-loading">Carregando pratos...</div>
          ) : (
            <div className="pratos-grid">
              {produtosFiltrados.length === 0 ? (
                <div className="pratos-empty">
                  {busca || filtroAtivo !== "todos"
                    ? "Nenhum prato encontrado com os filtros atuais."
                    : "Nenhum prato cadastrado."}
                </div>
              ) : (
                produtosFiltrados.map((produto) => (
                  <div key={produto.id} className="prato-card">
                    <div className="prato-image">
                      {produto.imagem ? (
                        <img src={produto.imagem} alt={produto.titulo} />
                      ) : (
                        <div className="prato-image-placeholder">
                          <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          >
                            <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                            <path d="M8 21v-4a2 2 0 012-2h4a2 2 0 012 2v4" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="prato-content">
                      <div className="prato-header">
                        <h3 className="prato-title">{produto.titulo}</h3>
                        <span className={`prato-status ${produto.ativo ? "ativo" : "inativo"}`}>
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </div>

                      <p className="prato-desc">{produto.descricao}</p>

                      <div className="prato-info">
                        <span className="prato-price">{formatPrice(produto.preco)}</span>
                        <span className="prato-category">{produto.categoria_nome}</span>
                        <span className="prato-stock">Estoque: {produto.quantidade}</span>
                      </div>

                      <div className="prato-actions">
                        <button
                          className={`prato-btn ${produto.ativo ? "desativar" : "ativar"}`}
                          onClick={() => handleToggleStatus(produto.id)}
                        >
                          {produto.ativo ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          className="prato-btn editar"
                          onClick={() => handleEditarProduto(produto.id)}
                        >
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Pratos;
