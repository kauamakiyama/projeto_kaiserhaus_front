import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home";
import CardapioPage from './pages/Cardapio'
import './App.css'

export default function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cardapio" element={<CardapioPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
