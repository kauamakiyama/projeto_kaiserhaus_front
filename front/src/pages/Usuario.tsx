import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Usuario.css';
import douradoImg from '../assets/login/dourado.png';
import { useAuth } from '../contexts/AuthContext';

const Usuario: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogoff = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="usuario-page">
      <div className="usuario-header">
        <h1 className="usuario-title">Área do Usuário</h1>
        <img src={douradoImg} alt="" className="usuario-divider" />
      </div>

      <section className="usuario-card">
        <div className="usuario-actions">
          <a className="usuario-btn usuario-btn--link" href="/usuario/dados">Meus dados</a>
          <button className="usuario-btn">Adicionar cartão</button>
          <button className="usuario-btn">Histórico de pedidos</button>
        </div>
        <div className="usuario-logoff">
          <button className="logoff-btn" onClick={handleLogoff}>Logoff</button>
        </div>
      </section>
    </div>
  );
};

export default Usuario;


