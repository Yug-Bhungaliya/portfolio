import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './NavBar'
import Home from './Home'
import NotFound from './NotFound'
import Footer from './footer'
import TaskManager from './TaskManager'

const Projects = lazy(() => import('./Projects'))
const Contact = lazy(() => import('./Contact'))

function App() {
  return (
    <div className="app">
      <NavBar />
      <main className="portfolio">
        <Suspense
          fallback={
            <div className="api-status loading page-loading" role="status" aria-live="polite">
              <span className="spinner" aria-hidden="true"></span>
              Loading page...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer name="Yug" />
    </div>
  )
}

export default App