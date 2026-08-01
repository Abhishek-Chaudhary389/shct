 import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // 1. Yahan BrowserRouter import kiya gaya hai
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. App component ko BrowserRouter se wrap kar diya hai */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)