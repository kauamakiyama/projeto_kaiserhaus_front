
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <div className="hero-section">
          <h1>Bem-vindo à KaizerHaus</h1>
          <p>O melhor da culinária alemã em São Paulo</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
