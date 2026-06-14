import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AboutSection from './components/AboutSection.jsx'
import 'boxicons/css/boxicons.min.css'
import Lenis from 'lenis'

import { ThemeProvider } from './context/ThemeContext.jsx'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>

    <ThemeProvider>
      <AboutSection />
    </ThemeProvider>
  </StrictMode>
);