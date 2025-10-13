import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/GerenciarCategorias.css";
import douradoImg from "../../assets/login/dourado.png";
import { apiGet } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

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
  
  // Estados para o modal de adicionar categoria
  const [modalAberto, setModalAberto] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [slugCategoria, setSlugCategoria] = useState("");
  const [descricaoCategoria, setDescricaoCategoria] = useState("");
  const [salvando, setSalvando] = useState(false);
  
  // Estados para deletar categoria
  const [modalDeletarAberto, setModalDeletarAberto] = useState(false);
  const [categoriaParaDeletar, setCategoriaParaDeletar] = useState<Categoria | null>(null);
  const [deletando, setDeletando] = useState(false);

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
    
    // Navegar para páginas específicas baseado na categoria
    if (cat.label.toLowerCase().includes('prato') || cat.slug === 'pratos') {
      navigate('/admin/categorias/pratos');
    } else if (cat.label.toLowerCase().includes('entrada') || cat.slug === 'entradas') {
      navigate('/admin/categorias/entradas');
    } else if (cat.label.toLowerCase().includes('sobremesa') || cat.slug === 'sobremesas') {
      navigate('/admin/categorias/sobremesas');
    } else if (cat.label.toLowerCase().includes('bebida') || cat.slug === 'bebidas') {
      navigate('/admin/categorias/bebidas');
    } else {
      // Para outras categorias, apenas log por enquanto
      console.log("Categoria não implementada ainda:", cat.label);
    }
  };

  const handleAdicionarCategoria = () => {
    setModalAberto(true);
    setNomeCategoria("");
    setSlugCategoria("");
    setDescricaoCategoria("");
    setErro("");
  };
  
  const handleFecharModal = () => {
    setModalAberto(false);
    setNomeCategoria("");
    setSlugCategoria("");
    setDescricaoCategoria("");
    setErro("");
  };
  
  // Gera slug automaticamente a partir do nome
  const gerarSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove acentos
      .replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
      .trim()
      .replace(/\s+/g, "-"); // Substitui espaços por hífens
  };
  
  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoNome = e.target.value;
    setNomeCategoria(novoNome);
    // Gera slug automaticamente
    setSlugCategoria(gerarSlug(novoNome));
  };
  
  const handleSalvarCategoria = async () => {
    // Validação
    if (!nomeCategoria.trim()) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }
    
    if (!slugCategoria.trim()) {
      setErro("O slug da categoria é obrigatório.");
      return;
    }
    
    if (!descricaoCategoria.trim()) {
      setErro("A descrição da categoria é obrigatória.");
      return;
    }
    
    setSalvando(true);
    setErro("");
    
    try {
      const response = await fetch(`${BASE_URL}/categorias/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: nomeCategoria.trim(),
          slug: slugCategoria.trim(),
          descricao: descricaoCategoria.trim(),
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }
      
      const novaCategoria = await response.json();
      
      // Adiciona a nova categoria à lista local
      setCategorias(prev => [...prev, {
        id: novaCategoria._id || novaCategoria.id,
        label: novaCategoria.nome,
        slug: novaCategoria.slug
      }]);
      
      alert(`Categoria "${nomeCategoria}" criada com sucesso!`);
      handleFecharModal();
      
    } catch (error: any) {
      console.error("Erro ao criar categoria:", error);
      setErro(`Erro ao criar categoria: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setSalvando(false);
    }
  };

  // Funções para deletar categoria
  const handleDeletarCategoria = (categoria: Categoria, event: React.MouseEvent) => {
    event.stopPropagation(); // Evita que o clique abra a categoria
    setCategoriaParaDeletar(categoria);
    setModalDeletarAberto(true);
    setErro("");
  };

  const handleFecharModalDeletar = () => {
    setModalDeletarAberto(false);
    setCategoriaParaDeletar(null);
    setErro("");
  };

  const handleConfirmarDeletar = async () => {
    if (!categoriaParaDeletar) return;

    setDeletando(true);
    setErro("");

    try {
      const response = await fetch(`${BASE_URL}/categorias/${categoriaParaDeletar.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erro ${response.status}: ${errorText}`);
      }

      // Remove a categoria da lista local
      setCategorias(prev => prev.filter(cat => cat.id !== categoriaParaDeletar.id));

      alert(`Categoria "${categoriaParaDeletar.label}" deletada com sucesso!`);
      handleFecharModalDeletar();

    } catch (error: any) {
      console.error("Erro ao deletar categoria:", error);
      setErro(`Erro ao deletar categoria: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setDeletando(false);
    }
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
                    <div key={cat.id} className="gc-card-container">
                        <button
                            className="gc-card"
                            onClick={() => handleAbrirCategoria(cat)}
                        >
                            {cat.label}
                        </button>
                        <button
                            className="gc-delete-btn"
                            onClick={(e) => handleDeletarCategoria(cat, e)}
                            aria-label={`Deletar categoria ${cat.label}`}
                            title={`Deletar categoria ${cat.label}`}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19,6V20a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6M8,6V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2V6"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                        </button>
                    </div>
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
        
        {/* Modal para adicionar nova categoria */}
        {modalAberto && (
          <div className="gc-modal" role="dialog" aria-modal="true">
            <div className="gc-modal-box">
              <div className="gc-modal-head">
                <h2>Nova Categoria</h2>
                <button 
                  className="gc-close" 
                  onClick={handleFecharModal} 
                  aria-label="Fechar"
                  disabled={salvando}
                >
                  ×
                </button>
              </div>

              <div className="gc-modal-body">
                {erro && <div className="gc-modal-alert">{erro}</div>}
                
                <label className="gc-field">
                  <span>Nome da Categoria *</span>
                  <input
                    type="text"
                    value={nomeCategoria}
                    onChange={handleNomeChange}
                    placeholder="Ex: Pizzas, Sucos, Lanches..."
                    disabled={salvando}
                    autoFocus
                  />
                </label>

                <label className="gc-field">
                  <span>Slug (URL amigável) *</span>
                  <input
                    type="text"
                    value={slugCategoria}
                    onChange={(e) => setSlugCategoria(e.target.value)}
                    placeholder="Ex: pizzas, sucos, lanches..."
                    disabled={salvando}
                  />
                  <small className="gc-field-hint">
                    Gerado automaticamente. Apenas letras minúsculas, números e hífens.
                  </small>
                </label>

                <label className="gc-field">
                  <span>Descrição *</span>
                  <textarea
                    value={descricaoCategoria}
                    onChange={(e) => setDescricaoCategoria(e.target.value)}
                    placeholder="Descreva brevemente esta categoria..."
                    disabled={salvando}
                    rows={3}
                    className="gc-textarea"
                  />
                  <small className="gc-field-hint">
                    Uma breve descrição da categoria para melhor organização.
                  </small>
                </label>
              </div>

              <div className="gc-modal-foot">
                <button 
                  className="gc-btn ghost" 
                  onClick={handleFecharModal}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button 
                  className="gc-btn primary" 
                  onClick={handleSalvarCategoria}
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Criar Categoria'}
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal de confirmação de exclusão */}
        {modalDeletarAberto && categoriaParaDeletar && (
          <div className="gc-modal" role="dialog" aria-modal="true">
            <div className="gc-modal-box gc-modal-delete">
              <div className="gc-modal-head">
                <h2>Confirmar Exclusão</h2>
                <button 
                  className="gc-close" 
                  onClick={handleFecharModalDeletar} 
                  aria-label="Fechar"
                  disabled={deletando}
                >
                  ×
                </button>
              </div>

              <div className="gc-modal-body">
                {erro && <div className="gc-modal-alert">{erro}</div>}
                
                <div className="gc-delete-warning">
                  <div className="gc-warning-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="15" y1="9" x2="9" y2="15"></line>
                      <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                  </div>
                  <div className="gc-warning-content">
                    <h3>Tem certeza que deseja deletar esta categoria?</h3>
                    <p>
                      A categoria <strong>"{categoriaParaDeletar.label}"</strong> será permanentemente removida.
                    </p>
                    <p className="gc-warning-note">
                      <strong>Atenção:</strong> Esta ação não pode ser desfeita e pode afetar produtos associados a esta categoria.
                    </p>
                  </div>
                </div>
              </div>

              <div className="gc-modal-foot">
                <button 
                  className="gc-btn ghost" 
                  onClick={handleFecharModalDeletar}
                  disabled={deletando}
                >
                  Cancelar
                </button>
                <button 
                  className="gc-btn danger" 
                  onClick={handleConfirmarDeletar}
                  disabled={deletando}
                >
                  {deletando ? 'Deletando...' : 'Sim, Deletar'}
                </button>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default GerenciarCategorias;
