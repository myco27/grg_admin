import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import './App.css'
import Orders from './pages/Orders'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:orderId" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
      </Routes>
    </Router>
  )
}

export default App
