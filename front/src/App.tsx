import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home";
import SobreNos from './pages/SobreNos'
import CardapioPage from './pages/Cardapio'
import Sacola from './pages/Sacola'
import Adm from './pages/Adm'
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
                <Route path="/admin" element={<Adm />} />
              </Routes>
            </main>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
