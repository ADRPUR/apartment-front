import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// PWA registration – folosește entry-ul generat de pluginul VitePWA
import { registerSW } from 'virtual:pwa-register'

registerSW({
    immediate: true,
})

createRoot(document.getElementById('root') as HTMLElement).render(<App />)
