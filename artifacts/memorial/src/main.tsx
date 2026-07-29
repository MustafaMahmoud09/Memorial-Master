import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Register service worker for offline audio caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration is best-effort; the app works fine without it
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
