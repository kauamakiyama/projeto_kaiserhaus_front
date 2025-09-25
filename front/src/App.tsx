
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <>
                <div className="hero-section">
                  <h1>Bem-vindo à KaizerHaus</h1>
                  <p>O melhor da culinária alemã em São Paulo</p>
                </div>
                <Footer />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
