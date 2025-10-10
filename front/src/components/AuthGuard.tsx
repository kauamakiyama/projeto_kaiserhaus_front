import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.hierarquia || 'usuario';
      
      // Se não há roles permitidos especificados, permite acesso
      if (!allowedRoles) return;
      
      // Se o usuário não tem uma role permitida, redireciona
      if (!allowedRoles.includes(userRole)) {
        if (userRole === 'funcionario') {
          navigate('/funcionario', { replace: true });
        } else if (userRole === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    }
  }, [isAuthenticated, user, allowedRoles, navigate]);

  // Se não está autenticado, não renderiza nada (deixa o login/register lidar)
  if (!isAuthenticated) {
    return null;
  }

  // Se está autenticado e tem permissão, renderiza os children
  return <>{children}</>;
};

export default AuthGuard;
