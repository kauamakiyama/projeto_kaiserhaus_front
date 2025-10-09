import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home";
import SobreNos from './pages/SobreNos'
import CardapioPage from './pages/Cardapio'
import Sacola from './pages/Sacola'
import Usuario from './pages/Usuario'
import MeusDados from './pages/MeusDados'
import Entrega from './pages/Entrega'
import Pagamento from './pages/Pagamento'
import PixPagamento from './pages/PixPagamento'
import Conclusao from './pages/Conclusao'
import HistoricoPedidos from './pages/HistoricoPedidos'
import Adm from './pages/Adm'
import GerFunc from './pages/admin/GerenciarFuncionarios'
import GerCateg from './pages/admin/GerenciarCategorias'
import Avaliacoes from './pages/admin/Avaliacoes'
import Historico from './pages/admin/Historico';
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import './App.css'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="app">
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cardapio" element={<CardapioPage />} />
                <Route path="/sobre" element={<SobreNos />} />
                <Route path="/sacola" element={<Sacola />} />
                <Route path="/entrega" element={<Entrega />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/pix-pagamento" element={<PixPagamento />} />
                <Route path="/conclusao" element={<Conclusao />} />

                <Route path="/usuario" element={<Usuario />} />
                <Route path="/usuario/dados" element={<MeusDados />} />
                <Route path="/historico-pedidos" element={<HistoricoPedidos />} />

                <Route path="/admin" element={<Adm />} />
                <Route path="/admin/funcionarios" element={<GerFunc />} />
                <Route path="/admin/categorias" element={<GerCateg />} />
                <Route path="/admin/avaliacoes" element={<Avaliacoes />} />
                <Route path="/admin/historico" element={<Historico />} />

              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
