import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Header.css';

const HeaderLogadoColaborador: React.FC = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/funcionario') {
      setActiveLink('funcionario');
    } else {
      setActiveLink('');
    }
  }, [location]);

  const handleLinkClick = (linkName: string) => {
    setActiveLink(linkName);
    setIsMobileMenuOpen(false);
  };

  const handleLogoff = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/funcionario" onClick={() => handleLinkClick('funcionario')}>
            <img 
              src="/src/assets/header/image 91.png" 
              alt="KaizerHaus Logo" 
              className="logo"
            />
          </Link>
        </div>
        
        <nav className={`navigation ${isMobileMenuOpen ? 'active' : ''}`}>
          
          <div className="user-info">
            <span className="user-name">
              {user?.nome || 'Colaborador'}
            </span>
          </div>
          
          <button 
            className="logoff-button"
            onClick={handleLogoff}
            title="Fazer logoff"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Logoff</span>
          </button>
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

export default HeaderLogadoColaborador;
