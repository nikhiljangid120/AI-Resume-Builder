"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import type { ResumeData } from "@/lib/types"
import { defaultResumeData } from "@/lib/default-data"
import { templates } from "@/lib/templates"
import { ResumeEditor } from "@/components/resume-editor"
import { ResumePreview } from "@/components/resume-preview"
import { ResumePreviewModal } from "@/components/resume-preview-modal"
import { TemplateSelector } from "@/components/template-selector"
import { CustomizationPanel } from "@/components/customization-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Download, RefreshCw, Sparkles, FileText, Palette, CheckCircle, Zap, Maximize2, Menu } from "lucide-react"
import { exportResumeToPDF } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIFeatures } from "@/components/ai-features"
import { ResumeUpload } from "@/components/resume-upload"
import useResumeBuilder from "@/hooks/use-resume-builder"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EnhancedATSChecker } from "@/components/enhanced-ats-checker"
import { motion } from "framer-motion"

// Custom Typewriter Effect Component
const Typewriter = ({ strings }: { strings: string[] }) => {
  const [currentStringIndex, setCurrentStringIndex] = useState(0)
  const [currentText, setCurrentText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    const currentString = strings[currentStringIndex]
    const typeSpeed = isDeleting ? 30 : 50
    const delay = isDeleting ? 50 : charIndex === currentString.length ? 1000 : 0

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentString.length) {
        setCurrentText(currentString.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else if (isDeleting && charIndex > 0) {
        setCurrentText(currentString.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      } else if (!isDeleting && charIndex === currentString.length) {
        setIsDeleting(true)
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false)
        setCurrentStringIndex((prev) => (prev + 1) % strings.length)
      }
    }, typeSpeed + delay)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, currentStringIndex, strings])

  return (
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
      {currentText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-1 h-6 sm:h-8 ml-1 bg-purple-400"
      />
    </span>
  )
}

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const defaultData = { ...defaultResumeData }
    if (typeof window !== "undefined") {
      try {
        const storedData = localStorage.getItem("resumeData")
        if (storedData) {
          const parsedData = JSON.parse(storedData)
          return {
            personalInfo: { ...defaultData.personalInfo, ...parsedData.personalInfo },
            skills: Array.isArray(parsedData.skills) ? parsedData.skills : defaultData.skills,
            experience: Array.isArray(parsedData.experience) ? parsedData.experience : defaultData.experience,
            education: Array.isArray(parsedData.education) ? parsedData.education : defaultData.education,
            projects: Array.isArray(parsedData.projects) ? parsedData.projects : defaultData.projects,
            customization: { ...defaultData.customization, ...parsedData.customization },
          }
        }
      } catch (error) {
        console.error("Error loading resume data from localStorage:", error)
      }
    }
    return defaultData
  })

  const [selectedTemplate, setSelectedTemplate] = useState(templates[0])
  const [jobDescription, setJobDescription] = useState("")
  const [resumeText, setResumeText] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Use custom hook
  const { handleResumeDataExtracted, handleDataAlignment } = useResumeBuilder({ resumeData, setResumeData })

  // Spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        containerRef.current.style.setProperty("--mouse-x", `${x}px`)
        containerRef.current.style.setProperty("--mouse-y", `${y}px`)
      }
    }

    containerRef.current?.addEventListener("mousemove", handleMouseMove)
    return () => containerRef.current?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Simulate loading
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoading(false), 500)
          return 100
        }
        return newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  const handleDataChange = (data: Partial<ResumeData>) => {
    setResumeData((prev) => {
      const updated = { ...prev }
      if (data.personalInfo) updated.personalInfo = { ...updated.personalInfo, ...data.personalInfo }
      if (data.skills) updated.skills = Array.isArray(data.skills) ? data.skills : []
      if (data.experience) {
        updated.experience = Array.isArray(data.experience)
          ? data.experience.map((exp) => ({
              company: exp.company ?? "",
              position: exp.position ?? "",
              startDate: exp.startDate ?? "",
              endDate: exp.endDate ?? "Present",
              location: exp.location ?? "",
              description: exp.description ?? "",
              achievements: Array.isArray(exp.achievements) ? exp.achievements.map((a) => a ?? "") : [""],
            }))
          : []
      }
      if (data.education) {
        updated.education = Array.isArray(data.education)
          ? data.education.map((edu) => ({
              institution: edu.institution ?? "",
              degree: edu.degree ?? "",
              field: edu.field ?? "",
              startDate: edu.startDate ?? "",
              endDate: edu.endDate ?? "",
              location: edu.location ?? "",
              description: edu.description ?? "",
            }))
          : []
      }
      if (data.projects) {
        updated.projects = Array.isArray(data.projects)
          ? data.projects.map((proj) => ({
              name: proj.name ?? "",
              description: proj.description ?? "",
              technologies: proj.technologies ?? "",
              link: proj.link ?? "",
              startDate: proj.startDate ?? "",
              endDate: proj.endDate ?? "",
              achievements: Array.isArray(proj.achievements) ? proj.achievements.map((a) => a ?? "") : [""],
            }))
          : []
      }
      if (data.customization) updated.customization = { ...updated.customization, ...data.customization }
      localStorage.setItem("resumeData", JSON.stringify(updated))
      return updated
    })
  }

  const handleExportToPDF = async () => {
    setIsExporting(true)
    try {
      await exportResumeToPDF(resumeData, selectedTemplate)
      toast({
        title: "Export Successful",
        description: "Your resume has been exported to PDF successfully!",
        variant: "success",
      })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      toast({
        title: "Export Failed",
        description: "There was an error exporting your resume to PDF. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  const handleJobDescriptionChange = (value: string) => setJobDescription(value)
  const handleResumeTextExtracted = (text: string) => setResumeText(text)

  if (isLoading) {
    return (
      <motion.div
        className="flex h-screen flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-purple-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md space-y-4 text-center px-4">
          <motion.div
            className="flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-16 w-16 text-purple-400" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">ResumeRocket AI</h1>
          <p className="text-purple-200 text-sm sm:text-base">Crafting your career masterpiece...</p>
          <Progress value={loadingProgress} className="h-2 bg-purple-200" />
        </div>
      </motion.div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-gray-900 to-purple-900 text-white overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.1) 0%, transparent 30%)",
      }}
    >
      {/* Animated Gradient Waves */}
      <div className="absolute inset-0 opacity-20">
        <div className="wave bg-gradient-to-r from-purple-500 to-blue-500"></div>
        <div className="wave bg-gradient-to-r from-blue-500 to-purple-500" style={{ animationDelay: "-5s" }}></div>
      </div>

      {/* Floating Blobs */}
      <motion.div
        className="absolute top-10 left-10 w-48 sm:w-64 h-48 sm:h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
        animate={{ y: [-20, 20], x: [-10, 10] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30"
        animate={{ y: [20, -20], x: [10, -10] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      />

      <div className="container mx-auto py-6 sm:py-12 px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            <h1
              className="text-2xl sm:text-3xl font-bold cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400"
              onClick={() => router.push("/")}
            >
              ResumeRocket AI
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("edit")}
                className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
              >
                <FileText className="mr-2 h-4 w-4" />
                Editor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("customize")}
                className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
              >
                <Palette className="mr-2 h-4 w-4" />
                Customize
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("ai")}
                className="border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                AI Tools
              </Button>
            </div>
            <ThemeToggle />
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden border-purple-500/50 text-purple-200 hover:bg-purple-500/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            className="sm:hidden bg-gray-800/90 backdrop-blur-md rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-200 hover:bg-purple-500/20"
              onClick={() => {
                setActiveTab("edit")
                setIsMenuOpen(false)
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              Editor
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-200 hover:bg-purple-500/20"
              onClick={() => {
                setActiveTab("customize")
                setIsMenuOpen(false)
              }}
            >
              <Palette className="mr-2 h-4 w-4" />
              Customize
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-200 hover:bg-purple-500/20"
              onClick={() => {
                setActiveTab("ai")
                setIsMenuOpen(false)
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              AI Tools
            </Button>
          </motion.div>
        )}

        {/* Hero Section */}
        <motion.div
          className="mb-8 sm:mb-12 text-center relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
            <Typewriter strings={["Craft Stellar Resumes", "Boost Your Career", "ATS-Optimized Excellence"]} />
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
            Build professional, ATS-friendly resumes with AI-powered precision in minutes.
          </p>
          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.1, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 text-base sm:text-lg"
              onClick={() => setActiveTab("edit")}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Launch Your Resume
            </Button>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Main Content Area */}
          <motion.div
            className="lg:col-span-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="hidden sm:grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-md rounded-xl p-1 mb-6">
                {["edit", "customize", "ai"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all hover:bg-gray-700/50 text-purple-200"
                  >
                    {tab === "edit" && <FileText className="mr-2 h-4 w-4" />}
                    {tab === "customize" && <Palette className="mr-2 h-4 w-4" />}
                    {tab === "ai" && <Sparkles className="mr-2 h-4 w-4" />}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="edit" className="space-y-6">
                <ResumeUpload
                  resumeData={resumeData}
                  onResumeDataExtracted={handleResumeDataExtracted}
                  onResumeTextExtracted={handleResumeTextExtracted}
                  onDataChange={handleDataAlignment}
                />
                <ResumeEditor
                  resumeData={resumeData}
                  onDataChange={handleDataChange}
                  onSectionReorder={(sections) =>
                    handleDataChange({
                      customization: { ...resumeData.customization, sectionOrder: sections },
                    })
                  }
                  jobDescription={jobDescription}
                  onJobDescriptionChange={handleJobDescriptionChange}
                />
              </TabsContent>

              <TabsContent value="customize" className="space-y-6">
                <TemplateSelector
                  templates={templates}
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                />
                <CustomizationPanel resumeData={resumeData} onDataChange={handleDataChange} />
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <Card className="bg-gray-800/50 backdrop-blur-md border border-purple-500/30 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                      <Zap className="h-6 w-6 text-purple-400" />
                      AI Resume Supercharger
                    </CardTitle>
                    <CardDescription className="text-purple-200 text-sm sm:text-base">
                      Amplify your resume with cutting-edge AI tools
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          icon: Sparkles,
                          title: "Generate Professional Summary",
                          desc: "Craft a compelling summary tailored to your experience",
                          bg: "bg-purple-100",
                          color: "text-purple-600",
                        },
                        {
                          icon: Zap,
                          title: "Enhance Achievements",
                          desc: "Power up your bullet points with impactful language",
                          bg: "bg-blue-100",
                          color: "text-blue-600",
                        },
                        {
                          icon: CheckCircle,
                          title: "ATS Optimization",
                          desc: "Ensure your resume sails through ATS systems",
                          bg: "bg-green-100",
                          color: "text-green-600",
                        },
                        {
                          icon: Palette,
                          title: "Job Description Matcher",
                          desc: "Align your resume with specific job requirements",
                          bg: "bg-amber-100",
                          color: "text-amber-600",
                        },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05, rotate: 1, boxShadow: "0 0 20px rgba(0,0,0,0.3)" }}
                          className="relative"
                        >
                          <Button
                            className="flex h-auto flex-col items-center gap-2 p-4 sm:p-6 text-left bg-gray-800/50 border border-purple-500/30 hover:bg-gray-700/50 w-full"
                            variant="outline"
                          >
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${item.bg} ${item.color}`}
                            >
                              <item.icon className="h-5 w-5" />
                            </div>
                            <div className="text-center">
                              <p className="font-medium text-white text-sm sm:text-base">{item.title}</p>
                              <p className="text-xs text-purple-200">{item.desc}</p>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <AIFeatures resumeData={resumeData} onDataChange={handleDataChange} jobDescription={jobDescription} />
                <EnhancedATSChecker
                  resumeData={resumeData}
                  resumeText={resumeText}
                  jobDescription={jobDescription}
                  onJobDescriptionChange={handleJobDescriptionChange}
                />
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Preview and Export */}
          <motion.div
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6 lg:sticky lg:top-6">
              <Card className="bg-gray-800/50 backdrop-blur-md border border-purple-500/30 shadow-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg sm:text-xl text-white">Resume Preview</CardTitle>
                  <CardDescription className="text-purple-200 text-sm sm:text-base">
                    Your masterpiece in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <motion.div
                    className="h-[400px] sm:h-[600px] overflow-auto rounded-md border border-purple-500/30 touch-auto"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ResumePreview resumeData={resumeData} template={selectedTemplate} />
                  </motion.div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
                  <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
                    <Button
                      className="w-full sm:flex-1 gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      onClick={handleExportToPDF}
                      disabled={isExporting}
                    >
                      {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      {isExporting ? "Exporting..." : "Export PDF"}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} className="w-full sm:w-auto">
                    <Button
                      className="w-full sm:flex-1 gap-2 bg-gray-800 hover:bg-gray-700 border-purple-500/50 text-purple-200"
                      variant="outline"
                      onClick={() => setIsPreviewModalOpen(true)}
                    >
                      <Maximize2 className="h-4 w-4" />
                      Full Preview
                    </Button>
                  </motion.div>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* Full-screen preview modal */}
        <ResumePreviewModal
          resumeData={resumeData}
          template={selectedTemplate}
          open={isPreviewModalOpen}
          onOpenChange={setIsPreviewModalOpen}
        />
      </div>

      <style jsx>{`
        .container {
          position: relative;
          z-index: 10;
        }
        .wave {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: 1000px 100px;
          animation: wave 10s infinite linear;
          opacity: 0.5;
        }
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1000px);
          }
        }
      `}</style>
    </div>
  )
}