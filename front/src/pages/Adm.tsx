import React, { useState } from "react";
import Header from "../components/HeaderLogadoLoja.tsx";
import Footer from "../components/Footer";
import "../styles/Adm.css";
import {Link} from "react-router-dom";
import douradoImg from "../assets/login/dourado.png";

const Adm: React.FC = () => {
  const [query, setQuery] = useState("");

  const goHistorico = () => console.log("Ir para Histórico de pedidos");
  const goAvaliacoes = () => console.log("Ir para Avaliações");
  const goCardapio = () => console.log("Ir para Gerenciar Cardápio");

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscar:", query);
  };

  return (
    <>
      <Header />
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
              <Link className="adm-nav-btn" to="/admin/funcionarios">
                Funcionários
              </Link>
            </nav>

            <div className="adm-sep" aria-hidden />

            <div className="adm-content">
              <form className="adm-search" onSubmit={onSearch} role="search">
                <span className="adm-search-icon" aria-hidden>
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

              <div className="adm-content-placeholder">
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Adm;
