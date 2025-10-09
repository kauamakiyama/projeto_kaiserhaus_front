import React, { useState} from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import douradoImg from '../assets/login/dourado.png';
import '../styles/Login.css';

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:8001';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${BASE_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const tokenFromApi = (data as any)?.token as string | undefined;
        if (!tokenFromApi) {
          setError('API não retornou token no login.');
          setIsLoading(false);
          return;
        }
        // persiste token e um snapshot do usuário retornado para uso em "Meus dados"
        try { localStorage.setItem('user', JSON.stringify((data as any).usuario || (data as any).user || data)); } catch {}
        login(tokenFromApi);
        setSuccess('Login realizado com sucesso!');
        const role = (data as any).hierarquia || (data as any).user?.hierarquia || (data as any).usuario?.hierarquia || 'usuario';
        if (role === 'usuario') {
          navigate('/', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        
        if (data?.detail) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail.map((err: any) => err.msg || err.message || err).join(', ');
          } else {
            errorMessage = data.detail;
          }
        } else if (data?.message) {
          errorMessage = data.message;
        } else if (data?.error) {
          errorMessage = data.error;
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      setError('Erro de conexão com a API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-container">
          <div className="login-header">
            <h1 className="login-title">Login</h1>
            <img src={douradoImg} alt="decoracao dourada" className="login-divider-img" />
          </div>
          
          <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">Senha:</label>
                <input
                  type="password"
                  id="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}
              
              <button 
                type="submit" 
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Login'}
              </button>
            </form>
            
                    <div className="login-links">
                      <p className="login-link-text">
                        Esqueceu a senha? <a href="#forgot-password" className="login-link">Clique aqui</a>
                      </p>
                      <p className="login-link-text">
                        Não tem um cadastro? <a href="/register" className="login-link">Cadastre-se aqui</a>
                      </p>
                    </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
