"use client"

import { useState, useEffect } from "react"
import type { ResumeData } from "@/lib/types"
import { defaultResumeData } from "@/lib/default-data"
import { templates } from "@/lib/templates"
import { ResumeEditor } from "@/components/resume-editor"
import { ResumePreview } from "@/components/resume-preview"
import { ResumePreviewModal } from "@/components/resume-preview-modal"
import { TemplateSelector } from "@/components/template-selector"
import { CustomizationPanel } from "@/components/customization-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, RefreshCw, Sparkles, FileText, Settings, Palette, CheckCircle, Zap, Maximize2 } from "lucide-react"
import { exportResumeToPDF } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"
import { ThemeToggle } from "@/components/theme-toggle"
import { AIFeatures } from "@/components/ai-features"
import { ResumeUpload } from "@/components/resume-upload"
import useResumeBuilder from "@/hooks/use-resume-builder"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { EnhancedATSChecker } from "@/components/enhanced-ats-checker"

export function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    // Initialize with default data to ensure all fields exist
    const defaultData = { ...defaultResumeData }

    if (typeof window !== "undefined") {
      try {
        const storedData = localStorage.getItem("resumeData")
        if (storedData) {
          // Merge stored data with default data to ensure all fields exist
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
  const { toast } = useToast()

  // Use our custom hook
  const { handleResumeDataExtracted, handleDataAlignment } = useResumeBuilder({ resumeData, setResumeData })

  // Simulate loading for a smoother experience
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
      const updated = { ...prev, ...data }

      // Ensure all fields exist and are properly initialized
      if (data.personalInfo) {
        updated.personalInfo = {
          name: data.personalInfo.name ?? prev.personalInfo.name ?? "",
          title: data.personalInfo.title ?? prev.personalInfo.title ?? "",
          email: data.personalInfo.email ?? prev.personalInfo.email ?? "",
          phone: data.personalInfo.phone ?? prev.personalInfo.phone ?? "",
          location: data.personalInfo.location ?? prev.personalInfo.location ?? "",
          website: data.personalInfo.website ?? prev.personalInfo.website ?? "",
          summary: data.personalInfo.summary ?? prev.personalInfo.summary ?? "",
        }
      }

      // Ensure arrays are properly initialized
      if (data.skills) {
        updated.skills = Array.isArray(data.skills) ? data.skills : []
      }

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

  const handleJobDescriptionChange = (value: string) => {
    setJobDescription(value)
  }

  const handleResumeTextExtracted = (text: string) => {
    setResumeText(text)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center justify-center">
            <Sparkles className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-center text-2xl font-bold">ResumeRocket AI</h1>
          <p className="text-center text-gray-500">Loading your unstoppable AI resume builder...</p>
          <Progress value={loadingProgress} className="h-2" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          <h1 className="text-2xl font-bold">ResumeRocket AI</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setActiveTab("edit")}>
            <FileText className="mr-2 h-4 w-4" />
            Editor
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("customize")}>
            <Palette className="mr-2 h-4 w-4" />
            Customize
          </Button>
          <Button variant="outline" size="sm" onClick={() => setActiveTab("ai")}>
            <Sparkles className="mr-2 h-4 w-4" />
            AI Tools
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main Content Area */}
        <div className="lg:col-span-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="edit">
                <FileText className="mr-2 h-4 w-4" />
                Edit Resume
              </TabsTrigger>
              <TabsTrigger value="customize">
                <Palette className="mr-2 h-4 w-4" />
                Customize
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Sparkles className="mr-2 h-4 w-4" />
                AI Tools
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit" className="space-y-6 pt-4">
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

            <TabsContent value="customize" className="space-y-6 pt-4">
              <TemplateSelector
                templates={templates}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
              <CustomizationPanel resumeData={resumeData} onDataChange={handleDataChange} />
            </TabsContent>

            <TabsContent value="ai" className="space-y-6 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    AI Resume Supercharger
                  </CardTitle>
                  <CardDescription>
                    Use our advanced AI tools to optimize your resume and stand out from the competition
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Button className="flex h-auto flex-col items-center gap-2 p-6 text-left" variant="outline">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Generate Professional Summary</p>
                        <p className="text-xs text-gray-500">Create a compelling summary based on your experience</p>
                      </div>
                    </Button>
                    <Button className="flex h-auto flex-col items-center gap-2 p-6 text-left" variant="outline">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Enhance Achievements</p>
                        <p className="text-xs text-gray-500">Improve your bullet points with powerful language</p>
                      </div>
                    </Button>
                    <Button className="flex h-auto flex-col items-center gap-2 p-6 text-left" variant="outline">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">ATS Optimization</p>
                        <p className="text-xs text-gray-500">Ensure your resume passes ATS systems</p>
                      </div>
                    </Button>
                    <Button className="flex h-auto flex-col items-center gap-2 p-6 text-left" variant="outline">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <Settings className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Job Description Matcher</p>
                        <p className="text-xs text-gray-500">Tailor your resume to specific job descriptions</p>
                      </div>
                    </Button>
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
        </div>

        {/* Preview and Export */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resume Preview</CardTitle>
                <CardDescription>See how your resume will look</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] overflow-hidden rounded-md border">
                  <ResumePreview resumeData={resumeData} template={selectedTemplate} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-4">
                <Button
                  className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                  onClick={handleExportToPDF}
                  disabled={isExporting}
                >
                  {isExporting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  {isExporting ? "Exporting..." : "Export PDF"}
                </Button>
                <Button className="flex-1 gap-2" variant="outline" onClick={() => setIsPreviewModalOpen(true)}>
                  <Maximize2 className="h-4 w-4" />
                  Full Preview
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Full-screen preview modal */}
      <ResumePreviewModal
        resumeData={resumeData}
        template={selectedTemplate}
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
      />
    </div>
  )
}
