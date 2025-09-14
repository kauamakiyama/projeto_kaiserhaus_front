import React, { useState } from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  const [activeLink, setActiveLink] = useState('sobre');

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
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
        
        <nav className="navigation">
          <a 
            href="#sobre" 
            className={`nav-link ${activeLink === 'sobre' ? 'active' : ''}`}
            onClick={() => handleLinkClick('sobre')}
          >
            Sobre Nós
          </a>
          <a 
            href="#cardapio" 
            className={`nav-link ${activeLink === 'cardapio' ? 'active' : ''}`}
            onClick={() => handleLinkClick('cardapio')}
          >
            Cardápio
          </a>
          <a 
            href="#login" 
            className={`nav-link ${activeLink === 'login' ? 'active' : ''}`}
            onClick={() => handleLinkClick('login')}
          >
            Log-in
          </a>
        </nav>
        
        {/* Menu hambúrguer para mobile */}
        <button className="mobile-menu-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
