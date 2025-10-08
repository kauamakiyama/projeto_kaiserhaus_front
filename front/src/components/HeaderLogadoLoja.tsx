import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const Header: React.FC = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveLink('');
    } else if (path === '/cardapio') {
      setActiveLink('cardapio');
    } else if (path === '/admin') {
      setActiveLink('admin');
    } else {
      setActiveLink('');
    }
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
          {isAuthenticated ? (
            <Link 
              to="/sobre" 
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
              to="/admin" 
              className={`nav-link ${activeLink === 'admin' ? 'active' : ''}`}
              onClick={() => handleLinkClick('admin')}
            >
              <img 
                src="/src/assets/header/Group 78.png" 
                alt="Perfil" 
                style={{ width: 28, height: 28, borderRadius: '50%', transform: 'translateY(2px)' }}
              />
            </Link>
          )}
          
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
