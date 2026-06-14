import SplitText from '../components/SplitText.jsx'
import SideRays from '../components/SIdeRays.jsx'
import TextType from '../components/TextType.jsx'
import BlurText from "../components/BlurText.jsx";

import Header from './components/Header.jsx'
import AboutSection from './components/AboutSection.jsx'

import { useState, useEffect } from 'react'
import './index.css'
import 'boxicons'
import { useTheme } from './context/ThemeContext.jsx'


function App() {
  const [showHeader, setShowHeader] = useState(false)
  const { theme } = useTheme()
  
  const isDark = theme === 'dark'
  const rayColor = isDark ? '#00b4d8' : '#0077b6'
  const scrollIndicatorColor = isDark ? '#00b4d8' : '#0077b6'
  const scrollTextColor = isDark ? '#64748B' : '#7c7c8c'

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
          rayColor1={rayColor}
          rayColor2={rayColor}
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

        <div className="relative z-10 flex flex-col items-center gap-2 lg:gap-6">

        <BlurText
          text={[
            <a
              key="fb"
              href="https://facebook.com/markPie29"
              className="flex items-center gap-2 hover:text-accent transition-colors duration-300 gradient-text"
            >
              <i class='bx bxl-facebook-circle'></i>
            </a>,

            <a
              key="git"
              href="#"
              className="flex items-center gap-2 hover:text-accent transition-colors duration-300 gradient-text" 
            >
              <i class='bx bxl-github' ></i>
            </a>,

            <a
              key="in"
              href="#"
              className="flex items-center gap-2 hover:text-accent transition-colors duration-300 gradient-text"
            >
              <i class='bx bxl-linkedin-square'></i>
            </a>,

            <a
              key="dc"
              href="#"
              className="flex items-center gap-2 hover:text-accent transition-colors duration-300 gradient-text"
            >
              <i class='bx bxl-discord'></i>
            </a>,
          ]}
          delay={150}
          className="flex gap-9 md:gap-14 lg:gap-20 flex-wrap justify-center text-3xl lg:text-4xl text-white/75"
        />
          
          <SplitText
            text="Mark Angelo A. Isulat"
            tag="p"
            className="font-neutralfacebold text-3xl md:text-5xl lg:text-6xl text-center"
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
            text={["Software Engineer", "UI/UX Designer", "Multimedia Designer"]}
            typingSpeed={100}
            pauseDuration={1500}
            showCursor
            cursorCharacter="_"
            deletingSpeed={50}
            variableSpeedEnabled={false}
            cursorBlinkDuration={0.5}
            className="text-xl text-center font-helvetica-neue-medium md:text-2xl lg:text-3xl"
          />



          <a className="gradient-border-dark rounded-full text-sm pl-5 pr-5 pt-2 pb-2 mt-2 text-accent font-bold dark:gradient-border-light" href="Mark_Angelo_Isulat_Final_Resume.pdf" download>Download CV</a>
        </div>

        <div
          className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-500 ${
            showHeader ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <span className="text-xs tracking-widest uppercase" style={{ color: scrollTextColor }}>
            Scroll Down for more
          </span>
          <i
            className="bx bx-chevron-down text-2xl"
            style={{ color: scrollIndicatorColor, animation: 'bounceDown 1.5s ease-in-out infinite' }}
          />
        </div>
      </div>
    </>
  )
}

export default App
