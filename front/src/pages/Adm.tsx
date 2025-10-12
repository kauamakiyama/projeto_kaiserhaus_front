import React from "react";
import Header from "../components/HeaderLogadoLoja.tsx";
import Footer from "../components/Footer";
import "../styles/Adm.css";
import {Link, useNavigate} from "react-router-dom";
import douradoImg from "../assets/login/dourado.png";
import { useAuth } from "../contexts/AuthContext";

const Adm: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

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
              <Link className="adm-nav-btn" to="/admin/categorias">
                Gerenciar Cardápio
              </Link>
              <Link className="adm-nav-btn" to="/admin/funcionarios">
                Funcionários
              </Link>
            </nav>

          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Adm;
