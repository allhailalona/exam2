import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { OptionsProvider } from './context/OptionsContext.tsx'
import App from './App.tsx'
import './index.css'


createRoot(document.getElementById('root')!).render(
  <OptionsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </OptionsProvider>
)
