import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'boxicons/css/boxicons.min.css'
import Lenis from 'lenis'

import AnimatedRoutes from './components/AnimatedRoutes'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

// Expose lenis globally so we can stop/start it from other components
(window as any).lenis = lenis;

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);