import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import AboutSection from './components/AboutSection'
import 'boxicons/css/boxicons.min.css'
import Lenis from 'lenis'

import { ThemeProvider } from './context/ThemeContext'
import ProjectsSection from '#components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>

    <ThemeProvider>
      <AboutSection />
    </ThemeProvider>

    <ThemeProvider>
      <ExperienceSection />
    </ThemeProvider>

    <ThemeProvider>
      <ProjectsSection />
    </ThemeProvider>
  </StrictMode>
);