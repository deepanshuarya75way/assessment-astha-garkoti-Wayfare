import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { BookingProvider } from './context/BookingContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BookingProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </BookingProvider>
    </BrowserRouter>
  </StrictMode>,
)