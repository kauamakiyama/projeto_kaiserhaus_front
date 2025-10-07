import React, { useState } from "react";
import "../styles/Adm.css";
import douradoImg from "../assets/login/dourado.png"; // mesmo ornamento usado no Login

const Adm: React.FC = () => {
  const [query, setQuery] = useState("");

  // Handlers de navegação (substitua por navigate(...) quando integrar)
  const goHistorico = () => console.log("Ir para Histórico de pedidos");
  const goAvaliacoes = () => console.log("Ir para Avaliações");
  const goCardapio = () => console.log("Ir para Gerenciar Cardápio");
  const goFuncionarios = () => console.log("Ir para Funcionários");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscar:", query);
    // quando integrar: chamar API ou filtrar lista
  };

  return (
    <div className="adm-page">
      <div className="adm-wrapper">
        <header className="adm-header">
          <h1 className="adm-title">Área do Administrador</h1>
          <img
            src={douradoImg}
            alt=""
            aria-hidden
            className="adm-divider-img"
          />
        </header>

        <section className="adm-panel">
          {/* Coluna esquerda: botões */}
          <nav className="adm-sidebar" aria-label="Menu do administrador">
            <button className="adm-nav-btn" onClick={goHistorico}>
              Histórico de pedidos
            </button>
            <button className="adm-nav-btn" onClick={goAvaliacoes}>
              Avaliações
            </button>
            <button className="adm-nav-btn" onClick={goCardapio}>
              Gerenciar Cardápio
            </button>
            <button className="adm-nav-btn" onClick={goFuncionarios}>
              Funcionários
            </button>
          </nav>

          {/* Divisor vertical */}
          <div className="adm-sep" aria-hidden />

          {/* Conteúdo à direita */}
          <div className="adm-content">
            <form className="adm-search" onSubmit={onSearch} role="search">
              <span className="adm-search-icon" aria-hidden>
                {/* Ícone lupa (SVG simples) */}
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="M21 21l-4.3-4.3m2.3-6.2a8 8 0 11-16 0 8 8 0 0116 0z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <input
                className="adm-search-input"
                type="search"
                placeholder="Buscar por título ou nome"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>

            {/* Área futura para tabelas/listas/cards */}
            <div className="adm-content-placeholder">
              {/* Renderize aqui o conteúdo da seção selecionada */}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Adm;
