import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DeanApproval from './pages/DeanApproval'
import Dashboard from './pages/Dashboard'
import Add from './pages/Add'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<Add />} />
        <Route path="/dean-approval" element={<DeanApproval />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App