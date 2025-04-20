"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  FileText,
  Zap,
  Target,
  Palette,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  BrainCircuit,
  Lightbulb,
  BarChart,
  Github,
  Linkedin,
} from "lucide-react"

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const statRefs = useRef<(HTMLDivElement | null)[]>([])
  const hasAnimated = useRef<boolean[]>([])

  // Interactive Particle Animation for Hero
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = []
    const particleCount = 80
    let mouse = { x: 0, y: 0 }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15,
      })
    }

    canvas.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle) => {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const force = distance < 100 ? (100 - distance) / 100 : 0

        particle.x += particle.speedX + (dx * force) / 100
        particle.y += particle.speedY + (dy * force) / 100

        ctx.fillStyle = `rgba(147, 51, 234, ${0.5 + force})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(0)
      canvas.removeEventListener("mousemove", () => {})
    }
  }, [])

  // Reduced Sparkle Effect for ATS-Optimized
  useEffect(() => {
    const atsText = document.querySelector(".ats-optimized")
    if (!atsText) return

    const sparkleCanvas = document.createElement("canvas")
    sparkleCanvas.className = "absolute inset-0 -z-10 pointer-events-none"
    atsText.appendChild(sparkleCanvas)

    const ctx = sparkleCanvas.getContext("2d")!
    sparkleCanvas.width = atsText.clientWidth
    sparkleCanvas.height = atsText.clientHeight

    const sparkles: { x: number; y: number; size: number; opacity: number; speed: number; angle: number }[] = []
    for (let i = 0; i < 20; i++) {
      sparkles.push({
        x: Math.random() * sparkleCanvas.width,
        y: Math.random() * sparkleCanvas.height,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.6 + 0.3,
        angle: Math.random() * Math.PI * 2,
      })
    }

    let hoverBurst = false
    atsText.addEventListener("mouseenter", () => {
      hoverBurst = true
      for (let i = 0; i < 8; i++) {
        sparkles.push({
          x: sparkleCanvas.width / 2,
          y: sparkleCanvas.height / 2,
          size: Math.random() * 5 + 2,
          opacity: 0.8,
          speed: Math.random() * 2 + 0.8,
          angle: Math.random() * Math.PI * 2,
        })
      }
    })

    function animateSparkles() {
      ctx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height)
      sparkles.forEach((sparkle, index) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${sparkle.opacity})`
        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2)
        ctx.fill()

        sparkle.x += Math.cos(sparkle.angle) * sparkle.speed
        sparkle.y += Math.sin(sparkle.angle) * sparkle.speed
        sparkle.opacity -= 0.02 * sparkle.speed

        if (sparkle.opacity <= 0 || sparkle.x < 0 || sparkle.x > sparkleCanvas.width || sparkle.y < 0 || sparkle.y > sparkleCanvas.height) {
          if (hoverBurst && index >= 20) {
            sparkles.splice(index, 1)
          } else {
            sparkle.x = Math.random() * sparkleCanvas.width
            sparkle.y = Math.random() * sparkleCanvas.height
            sparkle.opacity = Math.random() * 0.6 + 0.2
            sparkle.angle = Math.random() * Math.PI * 2
          }
        }
      })
      requestAnimationFrame(animateSparkles)
    }

    animateSparkles()

    return () => {
      sparkleCanvas.remove()
    }
  }, [])

  // Button Particle Burst Effect
  useEffect(() => {
    const buttons = document.querySelectorAll(".futuristic-button")
    buttons.forEach((button) => {
      const canvas = document.createElement("canvas")
      canvas.className = "absolute inset-0 -z-10 pointer-events-none"
      button.appendChild(canvas)

      const ctx = canvas.getContext("2d")!
      canvas.width = button.clientWidth
      canvas.height = button.clientHeight

      const particles: { x: number; y: number; size: number; opacity: number; speed: number; angle: number }[] = []

      button.addEventListener("mouseenter", (e) => {
        const rect = button.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        for (let i = 0; i < 15; i++) {
          particles.push({
            x,
            y,
            size: Math.random() * 3 + 1,
            opacity: 1,
            speed: Math.random() * 2 + 1,
            angle: Math.random() * Math.PI * 2,
          })
        }
      })

      function animateButtonParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        particles.forEach((particle, index) => {
          ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          particle.x += Math.cos(particle.angle) * particle.speed
          particle.y += Math.sin(particle.angle) * particle.speed
          particle.opacity -= 0.05

          if (particle.opacity <= 0) {
            particles.splice(index, 1)
          }
        })
        requestAnimationFrame(animateButtonParticles)
      }

      animateButtonParticles()
    })
  }, [])

  // Spotlight Effect for Hero Section Only
  useEffect(() => {
    const heroSection = document.querySelector("#hero-section") as HTMLElement
    if (!heroSection) return

    const spotlight = document.createElement("div")
    spotlight.className = "absolute inset-0 pointer-events-none"
    spotlight.style.background = "radial-gradient(circle 200px at 0 0, rgba(147, 51, 234, 0.2), transparent)"
    heroSection.appendChild(spotlight)

    let mouseX = 0
    let mouseY = 0
    let scrollY = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      updateSpotlight()
    }

    const handleScroll = () => {
      scrollY = window.scrollY / window.innerHeight
      updateSpotlight()
    }

    const updateSpotlight = () => {
      const intensity = 0.2 + scrollY * 0.3
      spotlight.style.background = `radial-gradient(circle 200px at ${mouseX}px ${mouseY}px, rgba(147, 51, 234, ${intensity}), transparent)`
    }

    heroSection.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      heroSection.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      spotlight.remove()
    }
  }, [])

  // Live Resume Editor Typing Animation
  useEffect(() => {
    const resumeText = document.querySelector(".resume-text")
    if (!resumeText) return

    const content = [
      "Nikhil Jangid\n",
      "Software Developer\n",
      "Built ResumeRocket AI to empower job seekers\n",
      "Expert in React, Node.js, and AI-driven solutions\n",
      "Passionate about simplifying career journeys\n",
    ]

    let lineIndex = 0
    let charIndex = 0
    let isDeleting = false

    function type() {
      const currentLine = content[lineIndex]
      const text = currentLine.slice(0, charIndex)
      resumeText.textContent = content.slice(0, lineIndex).join("") + text + "|"

      if (!isDeleting && charIndex < currentLine.length) {
        charIndex++
      } else if (isDeleting && charIndex > 0) {
        charIndex--
      } else if (!isDeleting && charIndex === currentLine.length) {
        isDeleting = true
        setTimeout(type, 1000)
        return
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false
        lineIndex = (lineIndex + 1) % content.length
      }

      setTimeout(type, isDeleting ? 50 : 100)
    }

    type()
  }, [])

  // Hero Stats Scroll-Based Number Animation and Holographic Hover
  useEffect(() => {
    const statCards = document.querySelectorAll(".stat-card")
    statRefs.current = Array.from(statCards) as HTMLDivElement[]

    // Scroll-based number animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting && !hasAnimated.current[index]) {
            const numberElement = entry.target.querySelector(".stat-number") as HTMLElement
            const targetValue = parseFloat(numberElement.dataset.value || "0")
            let currentValue = 0
            const duration = 1500 // 1.5s
            const startTime = performance.now()

            const animateNumber = (time: number) => {
              const elapsed = time - startTime
              const progress = Math.min(elapsed / duration, 1)
              const easedProgress = 1 - Math.pow(1 - progress, 3) // Ease-out
              currentValue = targetValue * easedProgress
              numberElement.textContent = Math.round(currentValue).toString() + (targetValue % 1 === 0 ? "" : "%")

              if (progress < 1) {
                requestAnimationFrame(animateNumber)
              } else {
                numberElement.textContent = targetValue.toString() + (targetValue % 1 === 0 ? "" : "%")
                hasAnimated.current[index] = true
              }
            }

            requestAnimationFrame(animateNumber)
          }
        })
      },
      { threshold: 0.5 }
    )

    statRefs.current.forEach((card, index) => {
      hasAnimated.current[index] = false
      if (card) observer.observe(card)
    })

    // Holographic hover effect
    statCards.forEach((card) => {
      const canvas = document.createElement("canvas")
      canvas.className = "absolute inset-0 -z-10 pointer-events-none"
      card.appendChild(canvas)

      const ctx = canvas.getContext("2d")!
      canvas.width = card.clientWidth
      canvas.height = card.clientHeight

      const ripples: { x: number; y: number; radius: number; opacity: number }[] = []
      const flares: { x: number; y: number; opacity: number }[] = []

      card.addEventListener("mouseenter", (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ripples.push({ x, y, radius: 0, opacity: 1 })
        flares.push({ x, y, opacity: 1 })
      })

      function animateHoloEffect() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw ripples
        ripples.forEach((ripple, index) => {
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(147, 51, 234, ${ripple.opacity})`
          ctx.lineWidth = 2
          ctx.stroke()

          ripple.radius += 1
          ripple.opacity -= 0.02

          if (ripple.opacity <= 0) {
            ripples.splice(index, 1)
          }
        })

        // Draw flares
        flares.forEach((flare, index) => {
          ctx.beginPath()
          ctx.arc(flare.x, flare.y, 5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${flare.opacity})`
          ctx.shadowBlur = 20
          ctx.shadowColor = "#9333ea"
          ctx.fill()

          flare.opacity -= 0.05

          if (flare.opacity <= 0) {
            flares.splice(index, 1)
          }
        })

        requestAnimationFrame(animateHoloEffect)
      }

      animateHoloEffect()
    })

    return () => {
      statRefs.current.forEach((card) => {
        if (card) observer.unobserve(card)
      })
    }
  }, [])

  // How It Works Card Neon Grid and Particle Swarm - Improved Version
  useEffect(() => {
    const cards = document.querySelectorAll(".how-it-works-card")
    cards.forEach((card) => {
      const canvas = document.createElement("canvas")
      canvas.className = "absolute inset-0 -z-10 pointer-events-none"
      card.appendChild(canvas)

      const ctx = canvas.getContext("2d")!
      canvas.width = card.clientWidth
      canvas.height = card.clientHeight

      const particles: { x: number; y: number; size: number; opacity: number; angle: number; radius: number }[] = []
      let isHovered = false

      card.addEventListener("mouseenter", () => {
        isHovered = true
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            opacity: 1,
            angle: Math.random() * Math.PI * 2,
            radius: Math.random() * 50,
          })
        }
      })

      card.addEventListener("mouseleave", () => {
        isHovered = false
      })

      function animateCardEffects() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Draw connecting lines between particles when hovered
        if (isHovered) {
          ctx.strokeStyle = "rgba(147, 51, 234, 0.3)"
          ctx.lineWidth = 1
          
          // Draw connections between nearby particles
          for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
              const dx = particles[i].x - particles[j].x
              const dy = particles[i].y - particles[j].y
              const distance = Math.sqrt(dx * dx + dy * dy)
              
              if (distance < 100) {
                ctx.beginPath()
                ctx.moveTo(particles[i].x, particles[i].y)
                ctx.lineTo(particles[j].x, particles[j].y)
                ctx.stroke()
              }
            }
          }
        }

        // Draw particle swarm
        particles.forEach((particle, index) => {
          particle.angle += 0.02
          particle.radius += 0.2
          particle.x += Math.cos(particle.angle) * 0.5
          particle.y += Math.sin(particle.angle) * 0.5
          particle.opacity -= isHovered ? 0.005 : 0.02

          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`
          ctx.fill()

          if (particle.opacity <= 0 || 
              particle.x < -50 || particle.x > canvas.width + 50 || 
              particle.y < -50 || particle.y > canvas.height + 50) {
            particles.splice(index, 1)
          }
        })

        requestAnimationFrame(animateCardEffects)
      }

      animateCardEffects()
    })
  }, [])

  // Transition Effect for Buttons
  const handleTransition = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    const rect = button.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const transitionOverlay = document.createElement("div")
    transitionOverlay.style.position = "fixed"
    transitionOverlay.style.top = "0"
    transitionOverlay.style.left = "0"
    transitionOverlay.style.width = "100vw"
    transitionOverlay.style.height = "100vh"
    transitionOverlay.style.background = "radial-gradient(circle at " + x + "px " + y + "px, #9333ea 0%, #3b82f6 100%)"
    transitionOverlay.style.transform = "scale(0)"
    transitionOverlay.style.transformOrigin = `${x}px ${y}px`
    transitionOverlay.style.zIndex = "9999"
    document.body.appendChild(transitionOverlay)

    requestAnimationFrame(() => {
      transitionOverlay.style.transition = "transform 0.6s ease-out"
      transitionOverlay.style.transform = "scale(2)"
    })

    setTimeout(() => {
      router.push("/resume-builder")
      setTimeout(() => {
        transitionOverlay.remove()
      }, 600)
    }, 400)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative">
      {/* Global Styles */}
      <style>{`
        @keyframes textFill {
          0% { background-position: 0% 50%; }
          100% { background-position: 400% 50%; }
        }
        @keyframes outlinePulse {
          0% { text-shadow: 0 0 10px rgba(147, 51, 234, 0.9), 0 0 25px rgba(59, 130, 246, 0.9); }
          50% { text-shadow: 0 0 30px rgba(147, 51, 234, 1), 0 0 50px rgba(59, 130, 246, 1); }
          100% { text-shadow: 0 0 10px rgba(147, 51, 234, 0.9), 0 0 25px rgba(59, 130, 246, 0.9); }
        }
        @keyframes letterFade {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes wave {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes morph {
          0%, 100% { transform: scale(1) translate(0, 0); }
          25% { transform: scale(1.3) translate(60px, -60px); }
          50% { transform: scale(0.9) translate(-60px, 60px); }
          75% { transform: scale(1.2) translate(40px, 40px); }
        }
        @keyframes particleBurst {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes glowPulse {
          0% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.6); }
          50% { box-shadow: 0 0 30px rgba(147, 51, 234, 0.9); }
          100% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px; }
          100% { background-position: 1000px; }
        }
        @keyframes lineTravel {
          0% { width: 0; height: 0; }
          50% { width: 100%; height: 0; }
          100% { width: 100%; height: 100%; }
        }
        @keyframes neonPulse {
          0% { box-shadow: 0 0 10px rgba(236, 72, 153, 0.5); }
          50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); }
          100% { box-shadow: 0 0 10px rgba(236, 72, 153, 0.5); }
        }
        @keyframes backgroundPulse {
          0% { background-color: rgba(147, 51, 234, 0.1); }
          50% { background-color: rgba(147, 51, 234, 0.2); }
          100% { background-color: rgba(147, 51, 234, 0.1); }
        }
        @keyframes particleSwarm {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes holoRipple {
          0% { opacity: 1; transform: scale(0); }
          100% { opacity: 0; transform: scale(3); }
        }
        @keyframes neonFlare {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes shakeText {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
          100% { transform: translateX(0); }
        }
        @keyframes borderPulse {
          0% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
          50% { box-shadow: 0 0 15px rgba(147, 51, 234, 0.8); }
          100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
        }
        .futuristic-text span {
          display: inline-block;
          animation: letterFade 0.6s ease forwards;
          animation-delay: calc(0.1s * var(--i));
        }
        .ats-optimized {
          position: relative;
          background: linear-gradient(45deg, #9333ea, #3b82f6, #ec4899, #facc15, #9333ea);
          background-size: 500%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: textFill 4s linear infinite, outlinePulse 2s ease-in-out infinite;
          font-weight: 900;
          transform-style: preserve-3d;
          transition: transform 0.3s ease;
          filter: brightness(1.2);
        }
        .ats-optimized::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          background-size: 2000px;
          animation: shimmer 3s linear infinite;
          z-index: -1;
          opacity: 0.7;
        }
        .ats-optimized:hover {
          transform: scale(1.15) rotateX(10deg) rotateY(10deg);
        }
        .ats-optimized:hover::after {
          opacity: 1;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        }
        .futuristic-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          transform-style: preserve-3d;
          border: 2px solid transparent;
        }
        .futuristic-button:hover {
          transform: scale(1.05) rotateX(5deg) rotateY(5deg);
          border-color: #9333ea;
          box-shadow: 0 0 20px rgba(147, 51, 234, 0.6);
        }
        .futuristic-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: 0.5s;
        }
        .futuristic-button:hover::after {
          left: 100%;
        }
        .gooey-blob {
          animation: morph 12s ease-in-out infinite;
          backdrop-filter: blur(10px);
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(147, 51, 234, 0.1));
        }
        .features-card {
          position: relative;
          transition: all 0.3s ease;
        }
        .features-card::before, .features-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
          border-top: 4px solid #a855f7;
          border-left: 4px solid #60a5fa;
          box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
          transition: all 0.7s ease;
          z-index: 1;
        }
        .features-card::after {
          border-top: none;
          border-left: none;
          border-bottom: 4px solid #a855f7;
          border-right: 4px solid #60a5fa;
          top: auto;
          left: auto;
          bottom: 0;
          right: 0;
        }
        .features-card:hover::before, .features-card:hover::after {
          animation: lineTravel 0.7s ease forwards;
        }
        .features-card:hover {
          background: rgba(147, 51, 234, 0.1);
          animation: backgroundPulse 1.5s ease-in-out infinite;
        }
        .how-it-works-card {
          position: relative;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(147, 51, 234, 0.3);
          border-radius: 1rem;
          padding: 2rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 0 10px rgba(147, 51, 234, 0.2);
          min-width: 280px;
        }
        .how-it-works-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(147, 51, 234, 0.6);
        }
        .how-it-works-card:hover .card-content {
          text-shadow: 0 0 10px rgba(236, 72, 153, 0.8);
        }
        .ai-tools-card {
          position: relative;
          transition: transform 0.3s ease;
        }
        .ai-tools-card:hover {
          transform: translateY(-10px);
          animation: neonPulse 1.5s infinite;
        }
        .ai-tools-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          z-index: -1;
        }
        .ai-tools-card:hover::before {
          opacity: 1;
        }
        .section-title {
          animation: slideUp 0.8s ease forwards;
        }
        .parallax-bg {
          background-attachment: fixed;
          background-size: cover;
          background-position: center;
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
        .horizontal-scroll {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 20px;
        }
        .horizontal-scroll::-webkit-scrollbar {
          display: none;
        }
        .horizontal-scroll > div {
          flex: 0 0 auto;
          scroll-snap-align: center;
          width: 280px;
          margin-right: 20px;
        }
        .link-hover {
          position: relative;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .link-hover:hover {
          color: #9333ea;
          transform: scale(1.05);
        }
        .link-hover::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #9333ea, #3b82f6);
          transition: width 0.3s ease;
        }
        .link-hover:hover::after {
          width: 100%;
        }
        .about-card {
          position: relative;
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .about-card:hover {
          transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
          box-shadow: 0 20px 40px rgba(147, 51, 234, 0.3);
        }
        .about-image {
          position: relative;
        }
        .about-image::before {
          content: '';
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(236, 72, 153, 0.4), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }
        .about-image:hover::before {
          opacity: 1;
        }
        .social-icon {
          will-change: transform;
          transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
        }
        .social-icon:hover {
          transform: translate3d(0, -10px, 0) scale(1.1);
          box-shadow: 0 0 10px rgba(147, 51, 234, 0.5);
        }
        .typing-text {
          animation: slideUp 0.8s ease forwards;
          white-space: pre-wrap;
        }
        .resume-editor {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(147, 51, 234, 0.05));
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .stat-card {
          position: relative;
          transition: all 0.3s ease;
        }
        .stat-card:hover {
          animation: borderPulse 1s ease infinite;
        }
        .stat-card:hover .stat-number {
          text-shadow: 0 0 10px #9333ea;
          animation: shakeText 0.3s ease;
        }
        .stat-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #9333ea, #3b82f6);
          transition: width 0.3s ease;
        }
        .stat-card:hover::after {
          width: 100%;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md dark:bg-gray-950/90 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600 animate-pulse" />
            <span className="text-xl font-bold">ResumeRocket AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium link-hover">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium link-hover">
              How It Works
            </a>
            <a href="#ai-tools" className="text-sm font-medium link-hover">
              AI Tools
            </a>
            <a href="#about" className="text-sm font-medium link-hover">
              About
            </a>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/resume-builder" passHref>
                <Button className="bg-purple-600 hover:bg-purple-700 futuristic-button" onClick={handleTransition}>
                  Launch App
                </Button>
              </Link>
            </div>
          </nav>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t dark:border-gray-800">
            <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
              <a href="#features" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 link-hover" onClick={() => setIsMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 link-hover" onClick={() => setIsMenuOpen(false)}>
                How It Works
              </a>
              <a href="#ai-tools" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 link-hover" onClick={() => setIsMenuOpen(false)}>
                AI Tools
              </a>
              <a href="#about" className="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 link-hover" onClick={() => setIsMenuOpen(false)}>
                About
              </a>
              <Link href="/resume-builder" passHref>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 futuristic-button" onClick={handleTransition}>
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero-section" className="relative overflow-hidden py-24 md:py-36 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
          {/* Particle Canvas */}
          <canvas id="particle-canvas" className="absolute inset-0 -z-10" />

          {/* Animated Wave Background */}
          <svg className="absolute inset-0 -z-10" viewBox="0 0 1440 320">
            <path
              fill="rgba(147, 51, 234, 0.1)"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,213.3C672,203,768,149,864,144C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              className="animate-wave"
            ></path>
          </svg>

          {/* Floating Blobs */}
          <svg className="absolute inset-0 -z-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="gooey">
                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
                <feBlend in="SourceGraphic" in2="gooey" />
              </filter>
            </defs>
            <g filter="url(#gooey)">
              <circle className="gooey-blob" cx="15%" cy="25%" r="220" />
              <circle className="gooey-blob" cx="85%" cy="75%" r="180" />
              <ellipse className="gooey-blob" cx="50%" cy="50%" rx="150" ry="200" />
            </g>
          </svg>

          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center">
              <Badge className="mb-6 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 animate-pulse">
                AI-Powered Resume Builder
              </Badge>
              <h1 className="mb-8 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl futuristic-text">
                {["Create", "an", "ATS-Optimized", "Resume", "in", "Minutes"].map((word, index) => (
                  <span
                    key={index}
                    style={{ "--i": index } as any}
                    className={`${
                      word === "ATS-Optimized"
                        ? "ats-optimized"
                        : "text-white dark:text-gray-100"
                    } mx-1`}
                  >
                    {word}
                  </span>
                ))}
              </h1>
              <p className="mb-10 max-w-2xl text-lg text-gray-200 dark:text-gray-300 sm:text-xl animate-fade-in">
                Unleash your career potential with AI-crafted resumes that captivate recruiters and conquer ATS systems effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white futuristic-button"
                  onClick={handleTransition}
                >
                  Build Your Resume <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <a href="#features">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white futuristic-button"
                  >
                    Explore Features <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
              <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                <div className="text-center animate-slide-up stat-card">
                  <p className="text-3xl font-bold text-purple-400 stat-number" data-value="95">0</p>
                  <p className="text-sm text-gray-300">ATS Success Rate</p>
                </div>
                <div className="text-center animate-slide-up stat-card" style={{ animationDelay: "0.1s" }}>
                  <p className="text-3xl font-bold text-purple-400 stat-number" data-value="5">0</p>
                  <p className="text-sm text-gray-300">Resume Templates</p>
                </div>
                <div className="text-center animate-slide-up stat-card" style={{ animationDelay: "0.2s" }}>
                  <p className="text-3xl font-bold text-purple-400 stat-number" data-value="10">0</p>
                  <p className="text-sm text-gray-300">Faster Creation</p>
                </div>
                <div className="text-center animate-slide-up stat-card" style={{ animationDelay: "0.3s" }}>
                  <p className="text-3xl font-bold text-purple-400 stat-number" data-value="100">0</p>
                  <p className="text-sm text-gray-300">Free to Use</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900 relative">
          {/* Floating Blobs */}
          <svg className="absolute inset-0 -z-10" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#gooey)">
              <circle className="gooey-blob" cx="20%" cy="30%" r="180" />
              <ellipse className="gooey-blob" cx="80%" cy="70%" rx="200" ry="150" />
            </g>
          </svg>

          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <Badge className="mb-4 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Features
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl section-title">Craft Your Perfect Resume</h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 animate-fade-in">
                Discover powerful AI tools designed to create professional resumes that shine.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-0 bg-gray-50 dark:bg-gray-800 features-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <BrainCircuit className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">AI Resume Generator</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Instantly create tailored resumes with AI that analyzes job descriptions.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gray-50 dark:bg-gray-800 features-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">ATS Optimization</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Pass ATS with ease using our keyword and format optimization tools.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gray-50 dark:bg-gray-800 features-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Achievement Enhancer</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Turn bullet points into impactful, metrics-driven achievements.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gray-50 dark:bg-gray-800 features-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                    <Palette className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Beautiful Templates</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Select from stunning, ATS-friendly templates to impress recruiters.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gray-50 dark:bg-gray-800 features-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                    <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Easy Customization</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Personalize your resume with an intuitive, user-friendly editor.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-gray-50 dark:bg-gray-800 features-card">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                    <BarChart className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Resume Analysis</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Receive detailed feedback to perfect your resume’s impact.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-100 dark:bg-gray-800 parallax-bg relative" style={{ backgroundImage: "url('/patterns/subtle-grid.png')" }}>
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                How It Works
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl section-title">Your Resume in 4 Easy Steps</h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 animate-fade-in">
                A seamless process to craft a professional resume in minutes.
              </p>
            </div>
            <div className="horizontal-scroll">
              <div className="relative how-it-works-card">
                <div className="card-content text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600 dark:bg-purple-900 dark:text-purple-400 mx-auto">
                    1
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Paste Job Description</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Input the job description, and our AI extracts key requirements.
                  </p>
                </div>
              </div>
              <div className="relative how-it-works-card">
                <div className="card-content text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-400 mx-auto">
                    2
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Generate Content</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    AI creates tailored summaries, skills, and experience bullets.
                  </p>
                </div>
              </div>
              <div className="relative how-it-works-card">
                <div className="card-content text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600 dark:bg-green-900 dark:text-green-400 mx-auto">
                    3
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Customize & Refine</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Edit templates, colors, and fonts with our intuitive editor.
                  </p>
                </div>
              </div>
              <div className="relative how-it-works-card">
                <div className="card-content text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-2xl font-bold text-amber-600 dark:bg-amber-900 dark:text-amber-400 mx-auto">
                    4
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Export & Apply</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Download your ATS-ready PDF and apply with confidence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Tools Section */}
        <section id="ai-tools" className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                AI Tools
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl section-title">Advanced AI Technology</h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 animate-fade-in">
                Harness cutting-edge AI to elevate your resume above the rest.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-blue-50 p-1 dark:from-purple-900/20 dark:to-blue-900/20 ai-tools-card">
                <div className="h-full rounded-lg bg-white p-6 dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <BrainCircuit className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">AI Resume Generator</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Tailored content crafted from job descriptions in seconds.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Professional summaries</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Skills extraction</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Achievement-focused bullets</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-green-50 p-1 dark:from-blue-900/20 dark:to-green-900/20 ai-tools-card">
                <div className="h-full rounded-lg bg-white p-6 dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Advanced ATS Checker</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Ensure ATS compatibility with precise keyword optimization.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Keyword suggestions</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Structure analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Compatibility score</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-amber-50 p-1 dark:from-green-900/20 dark:to-amber-900/20 ai-tools-card">
                <div className="h-full rounded-lg bg-white p-6 dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Achievement Enhancer</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Amplify your impact with metrics-driven achievements.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Action verbs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Quantifiable results</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Impactful language</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-amber-50 to-purple-50 p-1 dark:from-amber-900/20 dark:to-purple-900/20 ai-tools-card">
                <div className="h-full rounded-lg bg-white p-6 dark:bg-gray-800">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                    <Lightbulb className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Resume Analyzer</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-300">
                    Get actionable feedback to refine your resume’s strengths.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Quality assessment</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Section analysis</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-300">Improvement tips</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Resume Editor Section */}
        <section id="resume-editor" className="py-20 bg-gradient-to-br from-purple-900/20 to-blue-900/20">
          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Live Resume Editor
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl section-title">See Your Resume Come to Life</h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 animate-fade-in">
                Watch our AI craft a professional resume in real-time, tailored to your dream job.
              </p>
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="resume-editor rounded-xl p-6 text-gray-800 dark:text-gray-200">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="text-xl font-bold mb-2">Nikhil Jangid's Resume</h3>
                  <pre className="resume-text font-mono text-sm whitespace-pre-wrap"></pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold sm:text-4xl section-title">Launch Your Career Today</h2>
              <p className="mb-8 text-lg opacity-90 animate-fade-in">
                Join thousands who’ve landed dream jobs with ResumeRocket AI. Free, fast, and effortless.
              </p>
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 futuristic-button"
                onClick={handleTransition}
              >
                Build Your Resume Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-100 dark:bg-gray-800 parallax-bg relative" style={{ backgroundImage: "url('/patterns/soft-circles.png')" }}>
          {/* Floating Blobs */}
          <svg className="absolute inset-0 -z-10" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#gooey)">
              <circle className="gooey-blob" cx="30%" cy="20%" r="200" />
              <ellipse className="gooey-blob" cx="70%" cy="80%" rx="180" ry="220" />
            </g>
          </svg>

          <div className="container mx-auto px-4">
            <div className="mb-16 text-center">
              <Badge className="mb-4 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                About
              </Badge>
              <h2 className="mb-4 text-3xl font-bold sm:text-4xl section-title">Meet the Visionary</h2>
              <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300 animate-fade-in">
                ResumeRocket AI was created to empower job seekers worldwide.
              </p>
            </div>
            <div className="mx-auto max-w-3xl">
              <div className="about-card rounded-xl p-6 text-center">
                <div className="mb-6 h-32 w-32 mx-auto overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 about-image">
                  <img
                    src="https://media.licdn.com/dms/image/v2/D5603AQFNmeficTCeYg/profile-displayphoto-shrink_800_800/B56ZSt38T_HEAg-/0/1738083912231?e=1750291200&v=beta&t=5i95Jll2lLnb0Bl97AHisL0_lcr-O3dg2DBfCqnuJdM"
                    alt="Nikhil Jangid"
                    className="h-full w-full object-cover transition-transform duration-300 transform hover:scale-105"
                  />
                </div>
                <h3 className="mb-2 text-2xl font-bold">Nikhil Jangid</h3>
                <p className="mb-4 text-purple-600 dark:text-purple-400">Full Stack Developer</p>
                <p className="mb-6 max-w-2xl text-gray-600 dark:text-gray-300 typing-text">
                  A 20-year-old innovator from Jaipur, Rajasthan, dedicated to building tools that transform lives. ResumeRocket AI simplifies job applications for all.
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href="https://github.com/nikhiljangid120"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 social-icon"
                  >
                    <Github className="h-6 w-6" />
                  </a>
                  <a
                    href="https://linkedin.com/in/jangidnikhil"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 social-icon"
                  >
                    <Linkedin className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-purple-400 animate-pulse" />
                <span className="text-xl font-bold">ResumeRocket AI</span>
              </div>
              <p className="text-gray-400">
                Empowering job seekers with AI-powered tools to create professional, ATS-optimized resumes.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-purple-400 link-hover">
                    Features
		</a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-gray-400 hover:text-purple-400 link-hover">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#ai-tools" className="text-gray-400 hover:text-purple-400 link-hover">
                    AI Tools
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-purple-400 link-hover">
                    About
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Get Started</h4>
              <p className="text-gray-400 mb-4">
                Create your dream resume with ResumeRocket AI today.
              </p>
              <Button className="bg-purple-600 hover:bg-purple-700 futuristic-button" onClick={handleTransition}>
                Launch App
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} ResumeRocket AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}