import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home";
import SobreNos from './pages/SobreNos'
import CardapioPage from './pages/Cardapio'
import Sacola from './pages/Sacola'
import Usuario from './pages/Usuario'
import MeusDados from './pages/MeusDados'
import Adm from './pages/Adm'
import GerFunc from './pages/admin/GerenciarFuncionarios'
import GerCateg from './pages/admin/GerenciarCategorias'
import Avaliacoes from './pages/admin/Avaliacoes'
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

                <Route path="/usuario" element={<Usuario />} />
                <Route path="/usuario/dados" element={<MeusDados />} />

                <Route path="/admin" element={<Adm />} />
                <Route path="/admin/funcionarios" element={<GerFunc />} />
                <Route path="/admin/categorias" element={<GerCateg />} />
                <Route path="/admin/avaliacoes" element={<Avaliacoes />} />

              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
