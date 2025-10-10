import React, { useMemo, useState } from "react";
import Header from "../../components/HeaderLogadoLoja";
import Footer from "../../components/Footer";
import "../../styles/admin/Historico.css";
import douradoImg from "../../assets/login/dourado.png";

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


const MOCK_ORDERS: Order[] = [
  {
    id: "1",
    number: "73281",
    dateISO: "2025-09-07",
    items: [
      { name: "Brezel", qty: 3 },
      { name: "Strudel", qty: 1 },
      { name: "Coca Cola", qty: 1 },
    ],
    customerName: "Caique Bezerra",
    payment: "Pix",
    total: 129.97,
  },
  {
    id: "2",
    number: "32457",
    dateISO: "2025-08-04",
    items: [
      { name: "Schnitzel", qty: 4 },
      { name: "Coca Cola", qty: 1 },
    ],
    customerName: "Enzo Nogueira",
    payment: "Cartão",
    total: 189.97,
  },
  {
    id: "3",
    number: "19899",
    dateISO: "2025-09-30",
    items: [
      { name: "Apfelstrudel", qty: 1 },
      { name: "Água", qty: 1 },
    ],
    customerName: "Theo Blade",
    payment: "Pix",
    total: 39.9,
  },
];

const fmtDate = (iso: string) => {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
};
const fmtMoney = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Historico: React.FC = () => {
  const [range, setRange] = useState<"todos" | "30" | "60" | "90">("todos");

  const pedidos = useMemo(() => {
    const base = [...MOCK_ORDERS].sort(
      (a, b) => +new Date(b.dateISO) - +new Date(a.dateISO)
    );

    if (range === "todos") return base;

    const dias = parseInt(String(range), 10) || 0;
    const limite = new Date();
    limite.setDate(limite.getDate() - dias);

    return base.filter((p) => new Date(p.dateISO) >= limite);
  }, [range]);

  return (
    <>
      <Header />
      <main className="historico-page">
        <header className="historico-header">
          <h1 className="historico-title">Histórico de pedidos</h1>
          <img className="historico-divider" src={douradoImg} alt="" />
        </header>

        <section className="historico-panel">
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
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Historico;
