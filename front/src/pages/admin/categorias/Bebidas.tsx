import React, { useEffect, useMemo, useState } from "react";
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

  __candidates?: string[];
};

const BASE_URL: string =
  (import.meta.env.VITE_API_URL as string) || "http://localhost:8001";

const toIdStr = (v: any): string | undefined => {
  if (!v) return undefined;

  if (typeof v === "string") {
    const hex = v.match(/[0-9a-fA-F]{24}/)?.[0];
    return (hex ?? v).trim().toLowerCase();
  }

  if (typeof v === "object") {
    if ((v as any).$oid) return String((v as any).$oid).toLowerCase();
    if ((v as any)._id)  return toIdStr((v as any)._id);
    if ((v as any).id)   return toIdStr((v as any).id);
    if (typeof (v as any).toHexString === "function") {
      return (v as any).toHexString().toLowerCase();
    }
    const s = String(v);
    const hex = s.match(/[0-9a-fA-F]{24}/)?.[0];
    return (hex ?? s).toLowerCase();
  }

  return String(v).toLowerCase();
};

const buildIdCandidates = (raw: any): string[] => {
  const cands = new Set<string>();
  const brut: any[] = [
    raw?._id?.$oid,
    raw?._id,
    raw?.id,
    raw,
    String(raw?._id || ""),
    String(raw?.id || ""),
  ].filter(Boolean);

  for (const b of brut) {
    const norm = toIdStr(b);
    if (norm) cands.add(norm);
    const s = typeof b === "string" ? b : "";
    if (s && s !== "[object Object]") cands.add(s);
  }

  const list = Array.from(cands);
  list.sort((a, b) => {
    const a24 = a.length === 24 ? 0 : 1;
    const b24 = b.length === 24 ? 0 : 1;
    return a24 - b24;
  });
  return list;
};

const Bebidas: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  const [resolvedIds, setResolvedIds] = useState<Map<string, string>>(new Map());

  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    preco: 0,
    quantidade: 0,
    imagem: "",
    ativo: true,
  });

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [novoProdutoData, setNovoProdutoData] = useState({
    titulo: "",
    descricao: "",
    preco: 0,
    quantidade: 0,
    imagem: "",
    ativo: true,
  });

  useEffect(() => {
    carregar();
  }, [token]);

  const carregar = async () => {
    setLoading(true);
    setErro("");

    try {
      const [produtosApi, categoriasApi] = await Promise.all([
        apiGet<any[]>("/produtos/", token || undefined),
        apiGet<any[]>("/categorias/", token || undefined),
      ]);

      const isBebida = (c: any) => {
        const nome = (c.nome || c.label || "").toString().trim().toLowerCase();
        const slug = (c.slug || "").toString().trim().toLowerCase();
        return nome === "bebidas" || slug === "bebidas";
      };

      const bebidaIds = new Set<string>();
      for (const cat of categoriasApi) {
        if (isBebida(cat)) {
          const id = toIdStr(cat._id) ?? toIdStr(cat.id);
          if (id) bebidaIds.add(id);
        }
      }

      const categoriasMap = new Map<string, string>();
      for (const cat of categoriasApi) {
        const key = toIdStr(cat._id) ?? toIdStr(cat.id);
        if (!key) continue;
        categoriasMap.set(key, cat.nome || cat.label || cat.titulo || "Sem nome");
      }

      const ehBebidaProduto = (p: any) => {
        const catIdStr =
          toIdStr(p.categoria_id) ??
          toIdStr(p.categoria?._id) ??
          toIdStr(p.categoria) ??
          toIdStr(p.categoriaId) ??
          toIdStr(p.categoriaID);

        const nomeEmb = (p.categoria?.nome || p.categoria_nome || "")
          .toString()
          .trim()
          .toLowerCase();

        return (catIdStr && bebidaIds.has(catIdStr)) || nomeEmb === "bebidas";
      };

      const somenteBebidas = produtosApi.filter(ehBebidaProduto);

      const produtosFormatados: Produto[] = somenteBebidas
        .map((prod: any) => {
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
            "Bebidas";

          const candidates = buildIdCandidates(prod?._id ?? prod?.id ?? prod);
          const displayId = candidates[0] || "";

          return {
            id: displayId,
            titulo: prod.titulo || prod.nome || "Produto sem nome",
            descricao: prod.descricao || "Sem descrição",
            preco: Number(prod.preco) || 0,
            categoria_id: catIdStr,
            categoria_nome: categoriaNome,
            ativo: prod.ativo !== false,
            quantidade: Number(prod.quantidade) || 0,
            imagem: prod.imagem || prod.imagemProduto,
            __candidates: candidates,
          } as Produto;
        })
        .filter((p: Produto) => !!p.id);

      setProdutos(produtosFormatados);
    } catch (e: any) {
      console.error("Erro ao carregar bebidas:", e);
      setErro("Não foi possível carregar as bebidas da API.");
    } finally {
      setLoading(false);
    }
  };

  const produtosFiltrados = useMemo(() => {
    const q = busca.toLowerCase();

    return produtos.filter((produto) => {
      const matchBusca =
        produto.titulo.toLowerCase().includes(q) ||
        produto.descricao.toLowerCase().includes(q) ||
        (produto.categoria_nome ?? "").toLowerCase().includes(q);


      return matchBusca;
    });
  }, [busca, produtos]);

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleVoltar = () => navigate("/admin/categorias");

  const checkIdExists = async (id: string) => {
    try {
      const res = await fetch(`${BASE_URL}/produtos/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (res.ok) return true;
      if (res.status === 404) return false;
      return true;
    } catch {
      return false;
    }
  };

  const resolveApiId = async (p: Produto): Promise<string> => {
    const cached = resolvedIds.get(p.id);
    if (cached) return cached;

    const candidates = (p.__candidates && p.__candidates.length > 0)
      ? p.__candidates
      : buildIdCandidates(p.id);

    for (const cand of candidates) {
      const ok = await checkIdExists(cand);
      if (ok) {
        setResolvedIds((prev) => {
          const m = new Map(prev);
          m.set(p.id, cand);
          return m;
        });
        return cand;
      }
    }

    const fallback = candidates[0] || p.id;
    setResolvedIds((prev) => {
      const m = new Map(prev);
      m.set(p.id, fallback);
      return m;
    });
    return fallback;
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setFormData({
      titulo: produto.titulo,
      descricao: produto.descricao,
      preco: produto.preco,
      quantidade: produto.quantidade,
      imagem: produto.imagem || "",
      ativo: produto.ativo,
    });
    setModalAberto(true);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setProdutoEditando(null);
    setFormData({
      titulo: "",
      descricao: "",
      preco: 0,
      quantidade: 0,
      imagem: "",
      ativo: true,
    });
  };

  const handleSalvarEdicao = async () => {
    if (!produtoEditando) return;

    try {
      const apiId = await resolveApiId(produtoEditando);

      const response = await fetch(`${BASE_URL}/produtos/${apiId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: formData.titulo,
          descricao: formData.descricao,
          preco: formData.preco,
          quantidade: formData.quantidade,
          imagem: formData.imagem || null,
          ativo: formData.ativo,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao atualizar produto");
      }

      setProdutos((prev) =>
        prev.map((p) => (p.id === produtoEditando.id ? { ...p, ...formData } : p))
      );

      alert("Produto atualizado com sucesso!");
      handleFecharModal();
    } catch (error) {
      console.error("Erro ao salvar edição:", error);
      alert("Erro ao salvar as alterações. Tente novamente.");
    }
  };

  const handleAbrirModalAdicionar = () => {
    setNovoProdutoData({
      titulo: "",
      descricao: "",
      preco: 0,
      quantidade: 0,
      imagem: "",
      ativo: true,
    });
    setModalAdicionarAberto(true);
  };

  const handleFecharModalAdicionar = () => {
    setModalAdicionarAberto(false);
    setNovoProdutoData({
      titulo: "",
      descricao: "",
      preco: 0,
      quantidade: 0,
      imagem: "",
      ativo: true,
    });
  };

  const handleSalvarNovoProduto = async () => {
    try {
      const categoriasApi = await apiGet<any[]>("/categorias/", token || undefined);
      const catBebidas = categoriasApi.find((cat: any) => {
        const nome = (cat.nome || cat.label || "").toString().trim().toLowerCase();
        const slug = (cat.slug || "").toString().trim().toLowerCase();
        return nome === "bebidas" || slug === "bebidas";
      });

      if (!catBebidas) {
        alert("Categoria 'Bebidas' não encontrada.");
        return;
      }

      const categoria_id =
        toIdStr(catBebidas._id) ??
        toIdStr(catBebidas.id) ??
        catBebidas._id ??
        catBebidas.id;

      const response = await fetch(`${BASE_URL}/produtos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo: novoProdutoData.titulo,
          descricao: novoProdutoData.descricao,
          preco: novoProdutoData.preco,
          quantidade: novoProdutoData.quantidade,
          imagem: novoProdutoData.imagem || null,
          ativo: novoProdutoData.ativo,
          categoria_id,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao criar produto");
      }

      await response.json();
      await carregar();

      alert("Bebida adicionada com sucesso!");
      handleFecharModalAdicionar();
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar o produto. Tente novamente.");
    }
  };

  const handleExcluirProduto = async (produto: Produto) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir "${produto.titulo}"?\n\nEsta ação não pode ser desfeita.`
    );
    if (!confirmacao) return;

    try {
      const apiId = await resolveApiId(produto);

      const response = await fetch(`${BASE_URL}/produtos/${apiId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Erro ao excluir produto");
      }

      setProdutos((prev) => prev.filter((p) => p.id !== produto.id));
      alert("Bebida excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir o produto. Tente novamente.");
    }
  };

  const handleToggleStatus = async (produtoId: string) => {
    try {
      const produto = produtos.find((p) => p.id === produtoId);
      if (!produto) {
        alert("Produto não encontrado.");
        return;
      }

      const apiId = await resolveApiId(produto);

      const response = await fetch(`${BASE_URL}/produtos/${apiId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ ativo: !produto.ativo }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro da API:", errorText);
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      setProdutos((prev) =>
        prev.map((p) => (p.id === produtoId ? { ...p, ativo: !p.ativo } : p))
      );

      alert("Status alterado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao alterar status:", error);
      alert(`Erro ao alterar o status: ${error.message || "Erro desconhecido"}`);
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
            <h1 className="pratos-title">Bebidas</h1>
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
                placeholder="Buscar bebidas..."
                aria-label="Buscar bebidas por nome ou descrição"
                className="pratos-search-input"
              />
            </div>


            <button
              className="pratos-add-btn"
              onClick={handleAbrirModalAdicionar}
              title="Adicionar nova bebida"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Adicionar Bebida
            </button>
          </div>

          {loading ? (
            <div className="pratos-loading">Carregando bebidas...</div>
          ) : (
            <div className="pratos-grid">
              {produtosFiltrados.length === 0 ? (
                <div className="pratos-empty">
                  {busca !== "todos"
                    ? "Nenhuma bebida encontrada com os filtros atuais."
                    : "Nenhuma bebida cadastrada."}
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
                          onClick={() => handleEditarProduto(produto)}
                        >
                          Editar
                        </button>
                        <button
                          className="prato-btn excluir"
                          onClick={() => handleExcluirProduto(produto)}
                        >
                          Excluir
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

      {modalAberto && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Bebida</h2>
              <button className="modal-close" onClick={handleFecharModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                  id="titulo"
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Nome da bebida"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="descricao">Descrição *</label>
                <textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição da bebida"
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="preco">Preço (R$) *</label>
                  <input
                    id="preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.preco}
                    onChange={(e) =>
                      setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantidade">Quantidade em Estoque *</label>
                  <input
                    id="quantidade"
                    type="number"
                    min="0"
                    value={formData.quantidade}
                    onChange={(e) =>
                      setFormData({ ...formData, quantidade: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="imagem">URL da Imagem</label>
                <input
                  id="imagem"
                  type="url"
                  value={formData.imagem}
                  onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  />
                  <span>Produto ativo</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleFecharModal}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSalvarEdicao}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAdicionarAberto && (
        <div className="modal-overlay" onClick={handleFecharModalAdicionar}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adicionar Nova Bebida</h2>
              <button className="modal-close" onClick={handleFecharModalAdicionar}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="novo-titulo">Título *</label>
                <input
                  id="novo-titulo"
                  type="text"
                  value={novoProdutoData.titulo}
                  onChange={(e) => setNovoProdutoData({ ...novoProdutoData, titulo: e.target.value })}
                  placeholder="Nome da bebida"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="novo-descricao">Descrição *</label>
                <textarea
                  id="novo-descricao"
                  value={novoProdutoData.descricao}
                  onChange={(e) => setNovoProdutoData({ ...novoProdutoData, descricao: e.target.value })}
                  placeholder="Descrição da bebida"
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="novo-preco">Preço (R$) *</label>
                  <input
                    id="novo-preco"
                    type="number"
                    step="0.01"
                    min="0"
                    value={novoProdutoData.preco}
                    onChange={(e) =>
                      setNovoProdutoData({ ...novoProdutoData, preco: parseFloat(e.target.value) || 0 })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="novo-quantidade">Quantidade em Estoque *</label>
                  <input
                    id="novo-quantidade"
                    type="number"
                    min="0"
                    value={novoProdutoData.quantidade}
                    onChange={(e) =>
                      setNovoProdutoData({ ...novoProdutoData, quantidade: parseInt(e.target.value) || 0 })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="novo-imagem">URL da Imagem</label>
                <input
                  id="novo-imagem"
                  type="url"
                  value={novoProdutoData.imagem}
                  onChange={(e) => setNovoProdutoData({ ...novoProdutoData, imagem: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={novoProdutoData.ativo}
                    onChange={(e) => setNovoProdutoData({ ...novoProdutoData, ativo: e.target.checked })}
                  />
                  <span>Produto ativo</span>
                </label>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleFecharModalAdicionar}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={handleSalvarNovoProduto}>
                Adicionar Bebida
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Bebidas;
