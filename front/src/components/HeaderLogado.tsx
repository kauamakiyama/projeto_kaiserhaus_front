import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../styles/Header.css';

const Header: React.FC = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveLink('');
    else if (path === '/cardapio') setActiveLink('cardapio');
    else if (path === '/login') setActiveLink('login');
    else setActiveLink('');
  }, [location]);

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
    setIsMobileMenuOpen(false);
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
          <Link
            to="/login"
            className={`nav-link login-link ${activeLink === 'login' ? 'active' : ''}`}
            onClick={() => handleLinkClick('login')}
            aria-label="Entrar"
          >
            <img src="/src/assets/header/perfil.png" alt="" className="login-avatar" />
            <span className="sr-only">Entrar</span>
          </Link>

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
