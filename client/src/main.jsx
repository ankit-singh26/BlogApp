import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SearchProvider } from './context/SearchContext.jsx'
import { loadTheme } from "./utils/theme";
loadTheme();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <SearchProvider>
    <App />
    </SearchProvider>
  </AuthProvider>
  </BrowserRouter>,
)
