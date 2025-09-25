import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header: React.FC = () => {
  const [activeLink, setActiveLink] = useState('sobre');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
    setIsMobileMenuOpen(false); // Fecha o menu ao clicar
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <img 
            src="/src/assets/header/image 91.png" 
            alt="KaizerHaus Logo" 
            className="logo"
          />
        </div>
        
        <nav className={`navigation ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link 
            to="/" 
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
            className={`nav-link ${activeLink === 'login' ? 'active' : ''}`}
            onClick={() => handleLinkClick('login')}
          >
            Log-in
          </Link>
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
