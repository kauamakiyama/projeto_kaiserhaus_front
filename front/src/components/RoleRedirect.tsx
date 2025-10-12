import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface RoleRedirectProps {
  children: React.ReactNode;
}

const RoleRedirect: React.FC<RoleRedirectProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.hierarquia || 'usuario';
      const currentPath = location.pathname;

      // Se é funcionário ou colaborador e não está na página de funcionário, redireciona
      if ((userRole === 'funcionario' || userRole === 'colaborador') && currentPath !== '/funcionario') {
        navigate('/funcionario', { replace: true });
        return;
      }

      // Se é admin e não está em páginas de admin, redireciona
      if (userRole === 'admin' && !currentPath.startsWith('/admin')) {
        navigate('/admin', { replace: true });
        return;
      }

      // Se é usuário comum e está tentando acessar páginas restritas, redireciona
      if (userRole === 'usuario' && (currentPath === '/funcionario' || currentPath.startsWith('/admin'))) {
        navigate('/', { replace: true });
        return;
      }
    }
  }, [isAuthenticated, user, location.pathname, navigate]);

  return <>{children}</>;
};

export default RoleRedirect;
