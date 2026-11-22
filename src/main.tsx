/* Main entry point for the application - renders the root React component */
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'
// Gera as artes oficiais da marca em public/brand/ (efeito colateral do
// build/dev do Vite — nada é usado em runtime).
import './lib/brand/artGeneration'

// @skip-protected: Do not remove. Required for React rendering.
createRoot(document.getElementById('root')!).render(<App />)
