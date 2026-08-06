import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './NavBar'
import Home from './Home'
import Projects from './Projects'
import Contact from './Contact'
import NotFound from './NotFound'
import Footer from './footer'

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="portfolio">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer name="Yug" />
    </div>
  )
}

export default App