import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthContextProvider } from './store/auth-context.jsx'
// Comment out the App.css to let Bootstrap stylesheets
// take over.
//import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
  </StrictMode>,
)
