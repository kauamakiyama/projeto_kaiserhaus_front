import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Usuario.css';
import '../styles/HistoricoPedidos.css';
import { useAuth } from '../contexts/AuthContext';
import { apiGet } from '../services/api';

interface ItemPedido {
  produtoId: string;
  quantidade: number;
  observacoes?: string;
  produto?: {
    nome: string;
    preco: number;
    imagem: string;
  };
}

interface Pedido {
  _id: string;
  pedidoId: number;
  status: 'pendente' | 'em preparação' | 'saiu para entrega' | 'concluido';
  total: number;
  taxaEntrega: number;
  metodoPagamento: string;
  criadoEm: string;
  itens: ItemPedido[];
}

const HistoricoPedidos: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      
      if (!token) {
        throw new Error('Token não encontrado. Faça login novamente.');
      }
      
      const response = await apiGet<any>('/pedidos/', token);
      
      let pedidosData: Pedido[] = [];
      
      if (Array.isArray(response)) {
        pedidosData = response;
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.pedidos)) {
          pedidosData = response.pedidos;
        } else if (Array.isArray(response.data)) {
          pedidosData = response.data;
        } else if (Array.isArray(response.items)) {
          pedidosData = response.items;
        } else {
          console.warn('Estrutura de resposta inesperada:', response);
          if (response._id || response.pedidoId) {
            pedidosData = [response];
          }
        }
      }
      
      setPedidos(pedidosData);
      
      setLoading(false);
      
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
      setError(`Erro ao carregar histórico: ${(error as Error).message}`);
      
      const mockPedidos: Pedido[] = [
        {
          _id: '1',
          pedidoId: 1,
          status: 'pendente',
          total: 45.90,
          taxaEntrega: 10.99,
          metodoPagamento: 'cartao',
          criadoEm: new Date().toISOString(),
          itens: [
            {
              produtoId: '123',
              quantidade: 2,
              observacoes: 'sem cebola',
              produto: {
                nome: 'Hambúrguer',
                preco: 25.90,
                imagem: ''
              }
            }
          ]
        }
      ];
      setPedidos(mockPedidos);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    
    loadPedidos();
  }, [token, navigate]);

  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status: string) => {
    const statusMap = {
      'pendente': 'Pendente',
      'em preparação': 'Em Preparação',
      'saiu para entrega': 'Saiu para Entrega',
      'concluido': 'Concluído'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      'pendente': '#ffa500',
      'em preparação': '#007bff',
      'saiu para entrega': '#28a745',
      'concluido': '#6c757d'
    };
    return colorMap[status as keyof typeof colorMap] || '#6c757d';
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="historico-page">
          <div className="historico-container">
            <h1 className="historico-title">Histórico de Pedidos</h1>
            <div className="loading">Carregando pedidos...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="historico-page">
          <div className="historico-container">
            <h1 className="historico-title">Histórico de Pedidos</h1>
            <div className="error">{error}</div>
            <button onClick={loadPedidos} className="retry-btn">Tentar novamente</button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="usuario-page historico-pedidos-page">
        <div className="usuario-header">
          <h1 className="usuario-title">Histórico de Pedidos</h1>
          <img src="/src/assets/login/dourado.png" alt="" className="usuario-divider" />
        </div>

        <section className="usuario-card">
          
          {!pedidos || pedidos.length === 0 ? (
            <div className="no-pedidos">
              <p>Você ainda não fez nenhum pedido.</p>
              <button onClick={() => navigate('/cardapio')} className="btn-cardapio">
                Ver Cardápio
              </button>
            </div>
          ) : (
            <div className="pedidos-list">
              {pedidos.map((pedido, index) => (
                <div key={pedido._id || `pedido-${index}`} className="pedido-linear">
                  <div className="pedido-info">
                    <div className="pedido-itens-info">
                      {pedido.itens && Array.isArray(pedido.itens) ? pedido.itens.map((item, itemIndex) => (
                        <div key={itemIndex} className="item-container">
                          <span className="item-linear">
                            {item.quantidade || 1}x {item.produto?.nome || 'Produto não encontrado'}
                            {itemIndex < pedido.itens.length - 1 && <span className="item-separator"> • </span>}
                          </span>
                          {item.observacoes && (
                            <div className="item-obs">
                              Obs: {item.observacoes}
                            </div>
                          )}
                        </div>
                      )) : (
                        <span>Itens não disponíveis</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="pedido-detalhes">
                    <span className="pedido-status-badge" style={{ backgroundColor: getStatusColor(pedido.status) }}>
                      {getStatusText(pedido.status)}
                    </span>
                    <span className="pedido-preco">{formatPrice(pedido.total || 0)}</span>
                    <span className="pedido-pagamento">{pedido.metodoPagamento || 'N/A'}</span>
                    <span className="pedido-data">{pedido.criadoEm ? formatDate(pedido.criadoEm) : 'Data não disponível'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default HistoricoPedidos;
