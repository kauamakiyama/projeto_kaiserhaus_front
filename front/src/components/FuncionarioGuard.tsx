import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FuncionarioGuardProps {
  children: React.ReactNode;
}

const FuncionarioGuard: React.FC<FuncionarioGuardProps> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const userRole = user.hierarquia || 'usuario';
      
      // Se não é funcionário ou colaborador, redireciona para a página apropriada
      if (userRole !== 'funcionario' && userRole !== 'colaborador') {
        if (userRole === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } else if (!isAuthenticated) {
      // Se não está autenticado, redireciona para login
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Se não está autenticado, não renderiza nada
  if (!isAuthenticated) {
    return null;
  }

  // Se não é funcionário ou colaborador, não renderiza nada (já foi redirecionado)
  if (user && user.hierarquia !== 'funcionario' && user.hierarquia !== 'colaborador') {
    return null;
  }

  // Se é funcionário autenticado, renderiza os children
  return <>{children}</>;
};

export default FuncionarioGuard;
