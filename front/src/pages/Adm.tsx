import React, { useState } from "react";
import Header from "../components/HeaderLogadoLoja.tsx";
import Footer from "../components/Footer";
import "../styles/Adm.css";
import {Link, useNavigate} from "react-router-dom";
import douradoImg from "../assets/login/dourado.png";
import { useAuth } from "../contexts/AuthContext";

const Adm: React.FC = () => {
  const [query, setQuery] = useState("");
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Buscar:", query);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div className="adm-page">
        <div className="adm-wrapper">
          <header className="adm-header">
            <div className="adm-header-content">
              <div className="adm-title-section">
                <h1 className="adm-title">Área do Administrador</h1>
                <img
                  src={douradoImg}
                  alt=""
                  aria-hidden
                  className="adm-divider-img"
                />
              </div>
              
              <div className="adm-user-section">
                <div className="adm-user-info">
                  <span className="adm-welcome">Bem-vindo, {user?.nome || 'Administrador'}</span>
                  <span className="adm-role">{user?.hierarquia || 'admin'}</span>
                </div>
                <button 
                  className="adm-logout-btn"
                  onClick={handleLogout}
                  title="Sair da conta"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16,17 21,12 16,7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span>Sair</span>
                </button>
              </div>
            </div>
          </header>

          <section className="adm-panel">
            <nav className="adm-sidebar" aria-label="Menu do administrador">
              <Link className="adm-nav-btn" to="/admin/historico">
                Histórico de pedidos
              </Link>
              <Link className="adm-nav-btn" to="/admin/avaliacoes">
                Avaliações
              </Link>
              <Link className="adm-nav-btn" to="/admin/categorias">
                Gerenciar Cardápio
              </Link>
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
