import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import '../styles/Header.css';

const Header: React.FC = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { isAuthenticated } = useAuth();

  // Atualiza o link ativo baseado na rota atual
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveLink(''); // Home não tem linha ativa
    } else if (path === '/cardapio') {
      setActiveLink('cardapio');
    } else if (path === '/login') {
      setActiveLink('login');
    } else {
      setActiveLink(''); // Nenhum link ativo para outras rotas
    }
  }, [location]);

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
    setIsMobileMenuOpen(false); // Fecha o menu ao clicar
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" onClick={() => handleLinkClick('sobre')}>
            <img 
              src="/src/assets/header/image 91.png" 
              alt="KaizerHaus Logo" 
              className="logo"
            />
          </Link>
        </div>
        
        <nav className={`navigation ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/sobre" 
            className={`nav-link ${activeLink === 'sobre' ? 'active' : ''}`}
            onClick={() => handleLinkClick('sobre')}
          >
            Sobre Nós
          </Link>
          <Link 
            to="/cardapio" 
            className={`nav-link ${activeLink === 'cardapio' ? 'active' : ''}`}
            onClick={() => handleLinkClick('cardapio')}
          >
            Cardápio
          </Link>
          {isAuthenticated ? (
            <Link 
              to="/usuario" 
              className={`nav-link ${activeLink === 'profile' ? 'active' : ''}`}
              onClick={() => handleLinkClick('profile')}
            >
              <img 
                src="/src/assets/header/Group 78.png" 
                alt="Perfil" 
                style={{ width: 28, height: 28, borderRadius: '50%', transform: 'translateY(2px)' }}
              />
            </Link>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link ${activeLink === 'login' ? 'active' : ''}`}
              onClick={() => handleLinkClick('login')}
            >
              Log-in
            </Link>
          )}

          {/* Carrinho como botão no menu mobile */}
          <Link
            to="/sacola"
            className={`nav-link cart-mobile-link ${activeLink === 'sacola' ? 'active' : ''}`}
            onClick={() => handleLinkClick('sacola')}
            aria-label="Carrinho de compras"
          >
            <img 
              src="/src/assets/header/shopping-cart.png" 
              alt="Carrinho" 
              className="cart-mobile-icon" 
            />
            {getTotalItems() > 0 && (
              <span className="cart-mobile-badge">{getTotalItems()}</span>
            )}
          </Link>
          
          {/* Carrinho de compras dentro da navegação desktop */}
          <div className="cart-container">
            <Link to="/sacola" className="cart-button" aria-label="Carrinho de compras">
              <img 
                src="/src/assets/header/shopping-cart.png" 
                alt="Carrinho" 
                className="cart-icon" 
              />
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </Link>
          </div>
        </nav>
        
        {/* Menu hambúrguer para mobile */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`} 
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
