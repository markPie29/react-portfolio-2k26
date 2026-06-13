import Header from './components/Header.jsx'
import SplitText from './components/SplitText.jsx'
import SideRays from './components/SideRays.jsx'
import TextType from './components/TextType.jsx'
import AboutSection from './components/AboutSection.jsx'
import { useState, useEffect } from 'react'
import './index.css'
import 'boxicons'

function App() {
  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <>
      {/* Fixed background — stays behind everything while scrolling */}
      <div className="fixed inset-0 z-0">
        <SideRays
          speed={2.5}
          rayColor1="#00b4d8"
          rayColor2="#00b4d8"
          intensity={2}
          spread={2}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={1}
        />
      </div>

      {/* Header */}
      <div
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          showHeader ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
        }`}
      >
        <Header />
      </div>

      {/* Hero section */}
      <div id="home" className="home-container w-full h-screen flex flex-col items-center justify-center relative z-10">

        <div className="relative z-10 intro-about-me flex flex-col items-center gap-0.5">
          <SplitText
            text="Mark Angelo A. Isulat"
            tag="p"
            className="font-neutralfacebold text-2xl"
            delay={40}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="0px 0px -10% 0px"
            textAlign="center"
          />
          <TextType
            text={["Software Engineer", "UI/UX Designer", "Graphic Designer", "Video Editor"]}
            typingSpeed={100}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            variableSpeedEnabled={false}
            cursorBlinkDuration={0.5}
            className="text-sm text-center"
          />
          <a className="gradient-border rounded-full text-sm pl-5 pr-5 pt-2 pb-2 mt-2 text-accent font-bold" href="Mark_Angelo_Isulat_Final_Resume.pdf" download>Download CV</a>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 ${
            showHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: '#64748B' }}>
            Scroll Down for more
          </span>
          <i
            className='bx bx-chevron-down text-2xl'
            style={{ color: '#00b4d8', animation: 'bounceDown 1.5s ease-in-out infinite' }}
          />
        </div>
      </div>

      {/* About section */}
      <AboutSection />
    </>
  )
}

export default App