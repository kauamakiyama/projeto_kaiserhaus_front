import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Usuario.css';
import '../styles/Pagamento.css'; // Para usar os estilos do modal
import douradoImg from '../assets/login/dourado.png';
import { useAuth } from '../contexts/AuthContext';
import { apiPost, apiGet } from '../services/api';

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
  const [showTrackOrderModal, setShowTrackOrderModal] = useState(false);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  
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

  const handleTrackOrder = async () => {
    setShowTrackOrderModal(true);
    await loadUserOrders();
  };

  const handleCloseTrackModal = () => {
    setShowTrackOrderModal(false);
    setUserOrders([]);
  };

  const loadUserOrders = async () => {
    if (!token) {
      alert('Você precisa estar logado para acompanhar pedidos.');
      return;
    }

    setIsLoadingOrders(true);
    try {
      console.log('🔍 Buscando pedidos do usuário...');
      console.log('🔑 Token disponível:', token ? 'Sim' : 'Não');
      console.log('🌐 URL base:', import.meta.env.VITE_API_URL || 'http://localhost:8001');
      
      // Buscar pedidos do usuário
      const response = await apiGet('/pedidos/', token);
      console.log('✅ Resposta da API:', response);
      console.log('📊 Tipo da resposta:', typeof response);
      console.log('📋 É array?', Array.isArray(response));
      
      if (response) {
        let pedidosData: any[] = [];
        
        // Processar resposta do backend de forma mais robusta
        if (Array.isArray(response)) {
          // Resposta é um array direto de pedidos
          pedidosData = response;
          console.log(`✅ Array direto: ${pedidosData.length} pedidos`);
        } else if (response && typeof response === 'object' && 'pedidos' in response && Array.isArray((response as any).pedidos)) {
          // Resposta tem estrutura { pedidos: [...] }
          pedidosData = (response as any).pedidos;
          console.log(`✅ Wrapper com pedidos: ${pedidosData.length} pedidos`);
        } else if (response && typeof response === 'object' && 'data' in response && Array.isArray((response as any).data)) {
          // Resposta tem estrutura { data: [...] }
          pedidosData = (response as any).data;
          console.log(`✅ Wrapper com data: ${pedidosData.length} pedidos`);
        } else {
          console.error('❌ Formato de resposta não reconhecido:', response);
          throw new Error(`Formato de resposta inesperado. Recebido: ${typeof response}`);
        }
        
        console.log(`📊 Total de pedidos encontrados: ${pedidosData.length}`);
        
        if (pedidosData.length > 0) {
          console.log('📋 Primeiro pedido:', pedidosData[0]);
          console.log('🔍 Status do primeiro pedido:', pedidosData[0].status);
        }
        
        // Filtrar apenas pedidos que não foram concluídos
        const activeOrders = pedidosData.filter((order: any) => {
          console.log(`🔍 Verificando pedido ${order.id}: status = ${order.status}`);
          return order.status !== 'concluido';
        });
        
        console.log(`📊 Pedidos ativos após filtro: ${activeOrders.length}`);
        
        setUserOrders(activeOrders);
        
        // Não fechar o modal automaticamente - deixar o usuário ver a mensagem
      } else {
        console.error('❌ Resposta vazia da API');
        setUserOrders([]);
        alert('Não foi possível carregar seus pedidos. Tente novamente mais tarde.');
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar pedidos:', error);
      console.error('❌ Detalhes do erro:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      // Não fechar o modal automaticamente - deixar o usuário tentar novamente
      setUserOrders([]);
    } finally {
      setIsLoadingOrders(false);
    }
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

  const handleSelectOrder = (orderId: string) => {
    handleCloseTrackModal();
    navigate(`/acompanhar-pedido/${orderId}`);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_preparacao': return 'Em Preparação';
      case 'saiu_para_entrega': return 'Saiu para Entrega';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return '#FF8C00';
      case 'em_preparacao': return '#4169E1';
      case 'saiu_para_entrega': return '#FFD700';
      default: return '#666';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data não disponível';
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
            <button className="usuario-btn" onClick={handleTrackOrder}>Acompanhar pedido</button>
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

      {/* Modal para Acompanhar Pedido */}
      {showTrackOrderModal && (
        <div className="modal-overlay" onClick={handleCloseTrackModal}>
          <div className="modal-content order-list-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Seus Pedidos Ativos</h3>
              <button className="modal-close" onClick={handleCloseTrackModal}>×</button>
            </div>
            
            <div className="modal-body">
              {isLoadingOrders ? (
                <div className="loading-orders">
                  <div className="loading-spinner"></div>
                  <p>Carregando seus pedidos...</p>
                </div>
              ) : userOrders.length > 0 ? (
                <div className="orders-list">
                  <p className="orders-info">
                    Selecione um pedido para acompanhar:
                  </p>
                  {userOrders.map((order) => (
                    <div key={order.id} className="order-item" onClick={() => handleSelectOrder(order.id)}>
                      <div className="order-header">
                        <span className="order-id">Pedido #{order.id}</span>
                        <span 
                          className="order-status"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="order-details">
                        <span className="order-total">R$ {order.total?.toFixed(2) || '0.00'}</span>
                        <span className="order-date">{formatDate(order.criadoEm)}</span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="problems-section">
                    <button 
                      className="problems-btn"
                      onClick={() => navigate('/problemas-pedido')}
                    >
                      ❓ Problemas com o pedido?
                    </button>
                  </div>
                </div>
              ) : (
                <div className="no-orders">
                  <p>Nenhum pedido ativo encontrado.</p>
                  <p className="no-orders-help">
                    Todos os seus pedidos podem ter sido concluídos ou você ainda não fez nenhum pedido.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="btn-cancel" 
                onClick={handleCloseTrackModal}
              >
                Fechar
              </button>
              {!isLoadingOrders && userOrders.length === 0 && (
                <button 
                  className="btn-save" 
                  onClick={loadUserOrders}
                >
                  Tentar Novamente
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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


