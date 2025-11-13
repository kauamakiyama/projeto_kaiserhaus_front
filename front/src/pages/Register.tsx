import React, { useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from 'react-router-dom';
import douradoImg from '../assets/login/dourado.png';
import '../styles/Register.css';
import { apiPost } from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    cpf: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    complemento: '',
    dataNascimento: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    // Aplicar máscara para CPF
    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    }
    
    // Aplicar máscara para telefone
    if (name === 'telefone') {
      formattedValue = formatPhone(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  // Função para formatar CPF (000.000.000-00)
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(formData.dataNascimento.trim())) {
        setError('Data de nascimento inválida. Use o formato AAAA-MM-DD.');
        setIsLoading(false);
        return;
      }

      // Mapear os campos do formulário para os campos esperados pelo backend
      const requestData = {
        nome: formData.nomeCompleto,
        email: formData.email,
        data_nascimento: formData.dataNascimento || undefined,
        telefone: formData.telefone.replace(/\D/g, ''), // Remover formatação do telefone
        endereco: formData.endereco,
        complemento: formData.complemento || undefined,
        senha: formData.senha,
        cpf: formData.cpf.replace(/\D/g, '') // Adicionar CPF sem formatação
      };
      
      await apiPost('/usuarios', requestData);

      setSuccess('Cadastro realizado com sucesso!');
      
      // Limpar o formulário após sucesso
      setFormData({
        nomeCompleto: '',
        cpf: '',
        email: '',
        senha: '',
        telefone: '',
        endereco: '',
        complemento: '',
        dataNascimento: ''
      });
      
    } catch (err: any) {
      setError(err?.message || 'Erro de conexão com a API. Verifique se o backend está rodando.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h1 className="register-title">Cadastro</h1>
            <img src={douradoImg} alt="decoracao dourada" className="register-divider-img" />
          </div>
          
          <div className="register-form-container">
            <form className="register-form" onSubmit={handleSubmit}>
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
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nomeCompleto" className="form-label">Nome Completo:</label>
                  <input
                    type="text"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    className="form-input"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="telefone" className="form-label">Telefone:</label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    className="form-input"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="cpf" className="form-label">CPF:</label>
                  <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    className="form-input"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="000.000.000-00"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="endereco" className="form-label">Endereço:</label>
                  <input
                    type="text"
                    id="endereco"
                    name="endereco"
                    className="form-input"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="complemento" className="form-label">Complemento:</label>
                  <input
                    type="text"
                    id="complemento"
                    name="complemento"
                    className="form-input"
                    value={formData.complemento}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="senha" className="form-label">Senha:</label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    className="form-input"
                    value={formData.senha}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                  <div className="password-requirements">
                    <p className="requirements-title">Requisitos da senha:</p>
                    <ul className="requirements-list">
                      <li>Uma letra minúscula</li>
                      <li>Uma letra maiúscula</li>
                      <li>Um número</li>
                      <li>Um caractere especial</li>
                      <li>8 dígitos</li>
                    </ul>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="dataNascimento" className="form-label">Data de Nascimento:</label>
                  <input
                    type="date"
                    id="dataNascimento"
                    name="dataNascimento"
                    className="form-input"
                    value={formData.dataNascimento}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="register-button"
                disabled={isLoading}
              >
                {isLoading ? 'Cadastrando...' : 'Cadastre-se'}
              </button>
            </form>
            
            <div className="register-links">
              <p className="register-link-text">
                Já tem uma conta? <Link to="/login" className="register-link">Faça login aqui</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;
