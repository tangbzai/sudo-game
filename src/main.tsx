import ReactDOM from 'react-dom/client'
import 'amfe-flexible'
import { StrictMode } from 'react'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
