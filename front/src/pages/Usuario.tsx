import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Usuario.css';
import '../styles/Pagamento.css'; // Para usar os estilos do modal
import douradoImg from '../assets/login/dourado.png';
import { useAuth } from '../contexts/AuthContext';
import { apiPost } from '../services/api';

type NewCard = {
  numero: string;
  mes: string;
  ano: string;
  cvv: string;
  nome: string;
};

const Usuario: React.FC = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  
  // Estado para o formulário de novo cartão
  const [newCard, setNewCard] = useState<NewCard>({
    numero: '',
    mes: '',
    ano: '',
    cvv: '',
    nome: ''
  });

  const handleLogoff = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleAddCard = () => {
    setShowAddCardModal(true);
  };

  const handleCloseModal = () => {
    setShowAddCardModal(false);
    setNewCard({
      numero: '',
      mes: '',
      ano: '',
      cvv: '',
      nome: ''
    });
  };

  const handleInputChange = (field: keyof NewCard, value: string) => {
    setNewCard(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para formatar número do cartão
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19); // Máximo 16 dígitos + 3 espaços
  };

  const handleSaveCard = async () => {
    if (!token) {
      alert('Você precisa estar logado para salvar um cartão.');
      return;
    }

    // Validações básicas
    if (!newCard.numero || !newCard.mes || !newCard.ano || !newCard.cvv || !newCard.nome) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (newCard.cvv.length !== 3) {
      alert('Código de segurança deve ter exatamente 3 dígitos.');
      return;
    }

    setIsSavingCard(true);
    try {
      const cardData = {
        numero: newCard.numero.replace(/\D/g, ''),
        mes: newCard.mes,
        ano: newCard.ano,
        cvv: newCard.cvv,
        nome: newCard.nome
        // Removido: bandeira - deixar o backend detectar
      };

      await apiPost('/cartoes/', cardData, token);
      
      // Fecha o modal
      handleCloseModal();
      
      alert('Cartão salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cartão:', error);
      alert((error as Error).message || 'Erro ao salvar cartão');
    } finally {
      setIsSavingCard(false);
    }
  };

  return (
    <>
      <Header />
      <div className="usuario-page">
        <div className="usuario-header">
          <h1 className="usuario-title">Área do Usuário</h1>
          <img src={douradoImg} alt="" className="usuario-divider" />
        </div>

        <section className="usuario-card">
          <div className="usuario-actions">
            <a className="usuario-btn usuario-btn--link" href="/usuario/dados">Meus dados</a>
            <button className="usuario-btn" onClick={handleAddCard}>Adicionar cartão</button>
                <button 
                  className="usuario-btn" 
                  onClick={() => navigate('/historico-pedidos')}
                >
                  Histórico de pedidos
                </button>
          </div>
          <div className="usuario-logoff">
            <button className="logoff-btn" onClick={handleLogoff}>Logoff</button>
          </div>
        </section>
      </div>

      {/* Modal para Adicionar Cartão */}
      {showAddCardModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Informação de pagamento:</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="card-number">Número do cartão</label>
                <input
                  type="text"
                  id="card-number"
                  value={newCard.numero}
                  onChange={(e) => handleInputChange('numero', formatCardNumber(e.target.value))}
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
                <div className="card-brands">
                  <img src="/src/assets/pagamento/cartoes.png" alt="Bandeiras de cartão" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiry-month">Data de validade</label>
                  <div className="expiry-inputs">
                    <input
                      type="text"
                      id="expiry-month"
                      value={newCard.mes}
                      onChange={(e) => handleInputChange('mes', e.target.value.replace(/\D/g, '').slice(0, 2))}
                      placeholder="MM"
                      maxLength={2}
                    />
                    <span>/</span>
                    <input
                      type="text"
                      value={newCard.ano}
                      onChange={(e) => handleInputChange('ano', e.target.value.replace(/\D/g, '').slice(0, 2))}
                      placeholder="AA"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">Código de segurança</label>
                  <input
                    type="text"
                    id="cvv"
                    value={newCard.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 3))}
                    placeholder="CVV"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="card-name">Nome no cartão</label>
                <input
                  type="text"
                  id="card-name"
                  value={newCard.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Nome como está no cartão"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={handleCloseModal}
                disabled={isSavingCard}
              >
                Cancelar
              </button>
              <button 
                className="btn-save" 
                onClick={handleSaveCard}
                disabled={isSavingCard}
              >
                {isSavingCard ? 'Salvando...' : 'Salvar cartão'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Usuario;


