import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import Footer from './components/Footer'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-800">
        <Navbar />
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Contact />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
