"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sparkles,
  FileText,
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
  Lightbulb,
  BrainCircuit,
  Rocket,
} from "lucide-react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : ""
        }`}
      >
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-purple-600" />
            <span className="text-xl font-bold">ResumeRocket AI</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex">
              <ul className="flex space-x-8">
                <li>
                  <a href="#features" className="text-sm font-medium hover:text-purple-600 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-sm font-medium hover:text-purple-600 transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="text-sm font-medium hover:text-purple-600 transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-sm font-medium hover:text-purple-600 transition-colors">
                    About
                  </a>
                </li>
              </ul>
            </nav>
            <ThemeToggle />
            <Link href="/resume-builder">
              <Button className="bg-purple-600 hover:bg-purple-700">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                AI-Powered Resume Builder
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Create an{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                  AI-Optimized
                </span>{" "}
                Resume in Minutes
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                ResumeRocket AI uses advanced artificial intelligence to create professional, ATS-friendly resumes that
                get you noticed by employers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/resume-builder">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Build Your Resume
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
                <span className="mx-2">•</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>ATS-optimized templates</span>
                <span className="mx-2">•</span>
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>AI-powered content</span>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-300 dark:bg-purple-900 rounded-full filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-300 dark:bg-blue-900 rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="relative">
                <div className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden bg-white dark:bg-gray-800">
                  <img
                    src="/placeholder.svg?height=600&width=500"
                    alt="ResumeRocket AI Interface"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">ATS Score</p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400">98% Match</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              Powerful Features
            </Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">Everything You Need to Land Your Dream Job</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI-powered platform offers a comprehensive suite of tools to create, optimize, and manage your
              professional resume.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BrainCircuit className="h-6 w-6 text-purple-600" />}
              title="AI Resume Generator"
              description="Generate a complete, tailored resume in seconds using our advanced AI technology that understands job requirements."
            />
            <FeatureCard
              icon={<Target className="h-6 w-6 text-blue-600" />}
              title="ATS Optimization"
              description="Ensure your resume passes through Applicant Tracking Systems with our advanced ATS checker and optimizer."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-amber-600" />}
              title="Achievement Enhancer"
              description="Transform basic bullet points into powerful, metrics-driven achievements that showcase your impact."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-green-600" />}
              title="Multiple Templates"
              description="Choose from a variety of professional, modern templates designed for different industries and career levels."
            />
            <FeatureCard
              icon={<Download className="h-6 w-6 text-red-600" />}
              title="Easy Export"
              description="Export your resume as a PDF with perfect formatting that maintains its professional appearance."
            />
            <FeatureCard
              icon={<Lightbulb className="h-6 w-6 text-yellow-600" />}
              title="Job Description Matcher"
              description="Tailor your resume to specific job descriptions to increase your chances of getting an interview."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
              Simple Process
            </Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">How ResumeRocket AI Works</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Create a professional, ATS-optimized resume in just a few simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Input Your Information"
              description="Enter your details or upload an existing resume to get started quickly."
              color="purple"
            />
            <StepCard
              number="2"
              title="AI Enhancement"
              description="Our AI analyzes and enhances your content, optimizing it for ATS systems."
              color="blue"
            />
            <StepCard
              number="3"
              title="Download & Apply"
              description="Choose a template, customize as needed, and export your ready-to-use resume."
              color="green"
            />
          </div>

          <div className="mt-16 text-center">
            <Link href="/resume-builder">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Try It Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <Badge className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
              Success Stories
            </Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Thousands of job seekers have used ResumeRocket AI to land their dream jobs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="ResumeRocket AI helped me transform my basic resume into a professional document that got me interviews at top tech companies."
              author="Priya S."
              role="Software Engineer"
              rating={5}
            />
            <TestimonialCard
              quote="The ATS checker was a game-changer. I went from getting no callbacks to landing multiple interviews within a week!"
              author="Rahul M."
              role="Marketing Specialist"
              rating={5}
            />
            <TestimonialCard
              quote="As someone switching careers, the AI generator gave me a resume that highlighted my transferable skills perfectly."
              author="Ananya K."
              role="Data Analyst"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="10,000+" label="Resumes Created" />
            <StatCard number="85%" label="Interview Rate" />
            <StatCard number="98%" label="ATS Pass Rate" />
            <StatCard number="4.9/5" label="User Rating" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/placeholder.svg?height=400&width=500"
                alt="Nikhil Jangid"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <Badge className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded-full">
                About the Creator
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">Meet Nikhil Jangid</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                A 20-year-old tech enthusiast and entrepreneur from Jaipur, Rajasthan. Nikhil created ResumeRocket AI to
                help job seekers stand out in competitive markets with AI-powered resume tools.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                With a passion for artificial intelligence and user experience design, Nikhil has developed a platform
                that combines cutting-edge technology with intuitive design to make professional resume creation
                accessible to everyone.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/nikhiljangid" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">GitHub</Button>
                </a>
                <a href="https://linkedin.com/in/nikhiljangid" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline">LinkedIn</Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Ready to Supercharge Your Job Search?</h2>
                <p className="text-lg text-purple-100">
                  Create an ATS-optimized, professionally designed resume in minutes with our AI-powered platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/resume-builder">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-purple-600 hover:bg-gray-100">
                      <Rocket className="mr-2 h-5 w-5" />
                      Build Your Resume Now
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <img
                  src="/placeholder.svg?height=300&width=400"
                  alt="Resume Builder Preview"
                  className="rounded-lg shadow-lg w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-purple-600" />
                <span className="text-xl font-bold">ResumeRocket AI</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                AI-powered resume builder to help you land your dream job.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#features" className="hover:text-purple-600 transition-colors">
                    AI Resume Generator
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-purple-600 transition-colors">
                    ATS Optimization
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-purple-600 transition-colors">
                    Achievement Enhancer
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-purple-600 transition-colors">
                    Multiple Templates
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <a href="#" className="hover:text-purple-600 transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-600 transition-colors">
                    Career Tips
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-600 transition-colors">
                    Resume Examples
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-purple-600 transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Email: contact@resumerocket.ai</li>
                <li>Jaipur, Rajasthan, India</li>
                <li className="pt-2">
                  <div className="flex gap-4">
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="hover:text-purple-600 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="https://github.com/nikhiljangid" className="hover:text-purple-600 transition-colors">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>© 2025 ResumeRocket AI. Created by Nikhil Jangid. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}

// Step Card Component
function StepCard({ number, title, description, color }) {
  const bgColor = {
    purple: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
    blue: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
    green: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
  }

  return (
    <div className="text-center">
      <div className={`h-16 w-16 rounded-full ${bgColor[color]} flex items-center justify-center mx-auto mb-4`}>
        <span className="text-2xl font-bold">{number}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  )
}

// Testimonial Card Component
function TestimonialCard({ quote, author, role, rating }) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <p className="text-gray-700 dark:text-gray-200 italic mb-4">"{quote}"</p>
        <div className="flex items-center gap-4">
          <div>
            <p className="font-semibold">{author}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
          </div>
          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: rating }, (_, i) => (
              <Star key={i} className="h-4 w-4" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Stat Card Component
function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold">{number}</p>
      <p className="text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  )
}
