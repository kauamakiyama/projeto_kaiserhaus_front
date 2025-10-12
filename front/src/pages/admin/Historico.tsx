import React, { useMemo, useState, useEffect } from "react";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/Historico.css";
import douradoImg from "../../assets/login/dourado.png";
import { apiGet } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

type Item = { name: string; qty: number };
type Order = {
  id: string;
  number: string;
  dateISO: string;
  items: Item[];
  customerName: string;
  payment: "Pix" | "Cartão" | "Dinheiro";
  total: number;
};



const fmtDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
};
const fmtMoney = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Historico: React.FC = () => {
  const [range, setRange] = useState<"todos" | "30" | "60" | "90">("todos");
  const [pedidosOriginais, setPedidosOriginais] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const { token } = useAuth();

  // Função para carregar pedidos
  const carregarPedidos = async () => {
    setLoading(true);
    setErro("");
    try {
      // Buscar pedidos do endpoint admin (todos os pedidos do sistema)
      const pedidosApi = await apiGet<any[]>('/pedidos/admin', token || undefined);
        
      // Converter dados da API para o formato esperado
      const pedidosFormatados = pedidosApi.map((pedido: any) => {
        // Mapear itens do pedido
        let items: Item[] = [];
        if (pedido.itens && Array.isArray(pedido.itens)) {
          items = pedido.itens.map((item: any) => ({
            name: item.produto?.nome || item.nome_produto || item.nome || 'Produto',
            qty: item.quantidade || item.qty || 1
          }));
        }
        
        // Mapear data
        let dateISO = new Date().toISOString().split('T')[0];
        if (pedido.data_criacao) {
          dateISO = new Date(pedido.data_criacao).toISOString().split('T')[0];
        } else if (pedido.createdAt) {
          dateISO = new Date(pedido.createdAt).toISOString().split('T')[0];
        } else if (pedido.data) {
          dateISO = new Date(pedido.data).toISOString().split('T')[0];
        }
        
        // Mapear método de pagamento
        let payment = 'Pix';
        if (pedido.metodo_pagamento) {
          const metodo = pedido.metodo_pagamento.toLowerCase();
          if (metodo.includes('cartao') || metodo.includes('cartão')) {
            payment = 'Cartão';
          } else if (metodo.includes('dinheiro')) {
            payment = 'Dinheiro';
          } else if (metodo.includes('pix')) {
            payment = 'Pix';
          }
        } else if (pedido.pagamento) {
          const pag = pedido.pagamento.toLowerCase();
          if (pag.includes('cartao') || pag.includes('cartão')) {
            payment = 'Cartão';
          } else if (pag.includes('dinheiro')) {
            payment = 'Dinheiro';
          } else if (pag.includes('pix')) {
            payment = 'Pix';
          }
        }
        
        return {
          id: pedido._id || pedido.id || Math.random().toString(),
          number: pedido.numero_pedido || pedido.numero || pedido.id?.toString() || Math.random().toString().slice(-5),
          dateISO,
          items,
          customerName: pedido.usuario?.nome || pedido.cliente?.nome || pedido.nome_cliente || 'Cliente',
          payment: payment as "Pix" | "Cartão" | "Dinheiro",
          total: Number(pedido.total) || Number(pedido.valor_total) || Number(pedido.total_produtos) || 0
        };
      });
        
      setPedidosOriginais(pedidosFormatados);
    } catch (e: any) {
      console.error('Erro ao carregar pedidos:', e);
      
      // Verificar se é erro de memória do MongoDB
      if (e.message && e.message.includes('memory limit')) {
        setErro("⚠️ Banco de dados temporariamente indisponível (limite de memória). Exibindo dados de exemplo. O problema será resolvido em breve.");
      } else {
        setErro("Não foi possível carregar pedidos da API. Exibindo dados de exemplo.");
      }
      
      // Se não conseguir carregar dados da API, usar array vazio
      setPedidosOriginais([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar pedidos na inicialização
  useEffect(() => {
    carregarPedidos();
  }, [token]);

  const pedidos = useMemo(() => {
    const base = [...pedidosOriginais].sort(
      (a, b) => +new Date(b.dateISO) - +new Date(a.dateISO)
    );

    if (range === "todos") return base;

    const dias = parseInt(String(range), 10) || 0;
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);

    return base.filter((p) => new Date(p.dateISO) >= limite);
  }, [pedidosOriginais, range]);

  return (
    <>
      <Header />
      <main className="historico-page">
        <header className="historico-header">
          <h1 className="historico-title">Histórico de pedidos</h1>
          <img className="historico-divider" src={douradoImg} alt="" />
        </header>

        <section className="historico-panel">
          {erro && (
            <div className="historico-error-section">
              <div className="historico-alert">{erro}</div>
              <button 
                className="historico-retry-btn"
                onClick={carregarPedidos}
                disabled={loading}
              >
                {loading ? 'Carregando...' : 'Tentar novamente'}
              </button>
            </div>
          )}
          
          <div className="historico-toolbar">
            <label className="sr-only" htmlFor="range">
              Filtrar por período
            </label>
            <select
              id="range"
              className="historico-filter"
              value={range}
              onChange={(e) => setRange(e.target.value as any)}
            >
              <option value="todos">Todos</option>
              <option value="30">Últimos 30 dias</option>
              <option value="60">Últimos 60 dias</option>
              <option value="90">Últimos 90 dias</option>
            </select>
          </div>

          {loading ? (
            <div className="historico-loading">Carregando pedidos...</div>
          ) : (
            <ul className="pedidos-list">
              {pedidos.length === 0 && (
                <li className="empty">Nenhum pedido nesse período.</li>
              )}

              {pedidos.map((p) => (
              <li key={p.id} className="pedido-card">
                <div className="pedido-left">
                  <p className="pedido-items">
                    {p.items
                      .map((it) => `${it.qty}x ${it.name}`)
                      .join(" | ")}
                  </p>
                  <p className="pedido-line">
                    <span className="label">Nome:</span>{" "}
                    <span>{p.customerName}</span>
                  </p>
                  <p className="pedido-line">
                    <span className="label">Pagamento:</span>{" "}
                    <span>{p.payment}</span>
                  </p>
                </div>

                <div className="pedido-right">
                  <p className="pedido-line">
                    <span className="label">Data:</span>{" "}
                    <span>{fmtDate(p.dateISO)}</span>
                  </p>
                  <p className="pedido-line total">
                    <span className="label">Total:</span>{" "}
                    <span>{fmtMoney(p.total)}</span>
                  </p>
                  <p className="pedido-line">
                    <span className="label">Nº</span>{" "}
                    <span>{p.number}</span>
                  </p>
                </div>
              </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Historico;
