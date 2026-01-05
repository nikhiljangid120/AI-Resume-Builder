"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { ResumeData } from "@/lib/types"
import { AchievementEnhancer } from "@/components/achievement-enhancer"
import { generateWithGroq, generateStructuredData } from "@/lib/ai-services/groq-service"
import {
  Sparkles,
  Loader2,
  FileText,
  BrainCircuit,
  Zap,
  CheckCircle,
  Lightbulb,
  Target,
  Briefcase,
  Code,
  User,
} from "lucide-react"

interface AIResumeGeneratorProps {
  resumeData: ResumeData
  onResumeDataGenerated: (data: Partial<ResumeData>) => void
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
}

export function AIResumeGenerator({
  resumeData,
  onResumeDataGenerated,
  jobDescription,
  onJobDescriptionChange,
}: AIResumeGeneratorProps) {
  // State for generation process
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [generationCompleted, setGenerationCompleted] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)

  // State for tabs
  const [activeTab, setActiveTab] = useState("quick-generate")
  const [activeEnhancerSection, setActiveEnhancerSection] = useState<string | null>(null)

  // State for advanced options - ensure all have default values
  const [careerProfile, setCareerProfile] = useState("")
  const [skillKeywords, setSkillKeywords] = useState("")
  const [experienceLevel, setExperienceLevel] = useState("mid")
  const [industryFocus, setIndustryFocus] = useState("tech")
  const [yearsOfExperience, setYearsOfExperience] = useState("3-5")

  // State for generation options
  const [generationOptions, setGenerationOptions] = useState({
    atsOptimized: true,
    industrySpecific: true,
    creative: false,
    comprehensive: true,
    includeMetrics: true,
    focusOnSkills: true,
    tailoredToJob: true,
  })

  // State for achievement enhancer
  const [selectedExperienceIndex, setSelectedExperienceIndex] = useState(0)
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)

  const { toast } = useToast()

  // Function to handle option toggle
  const handleOptionToggle = (option: string, value: boolean) => {
    setGenerationOptions((prev) => ({
      ...prev,
      [option]: value,
    }))
  }

  // Function to generate resume with progress updates
  const generateResume = async () => {
    if (!jobDescription && !careerProfile) {
      toast({
        title: "Missing Information",
        description: "Please provide either a job description or career profile to generate a resume.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationCompleted(false)
    setGenerationError(null)
    setCurrentStep("Initializing AI models")

    try {
      // Step 1: Initialize
      await updateProgress("Analyzing job requirements", 0, 10)

      // Step 2: Generate resume data using Gemini API
      const input = jobDescription || careerProfile
      const additionalContext = {
        experienceLevel,
        industryFocus,
        skillKeywords: skillKeywords || "Not specified",
        options: generationOptions,
      }

      await updateProgress("Extracting key skills and qualifications", 10, 30)

      // System prompt for the AI
      const systemPrompt = `
      You are an expert resume writer with years of experience crafting ATS-optimized resumes.
      Your task is to generate a professional resume based on the provided job description or career profile.
      Focus on creating content that is tailored, relevant, and optimized for applicant tracking systems.
      `

      // Main prompt for resume generation
      const prompt = `
      Generate a professional resume based on the following information:
      
      ${jobDescription ? `Job Description: ${jobDescription}` : `Career Profile: ${careerProfile}`}
      
      Additional Context:
      - Experience Level: ${additionalContext.experienceLevel}
      - Industry Focus: ${additionalContext.industryFocus}
      - Key Skills/Technologies: ${additionalContext.skillKeywords}
      - ATS Optimized: ${additionalContext.options.atsOptimized ? "Yes" : "No"}
      - Industry Specific: ${additionalContext.options.industrySpecific ? "Yes" : "No"}
      - Creative Approach: ${additionalContext.options.creative ? "Yes" : "No"}
      - Include Metrics: ${additionalContext.options.includeMetrics ? "Yes" : "No"}
      
      Generate a complete resume with the following sections:
      1. Professional Summary
      2. Skills (organized by category)
      3. Work Experience (with achievements)
      4. Projects (with descriptions and technologies)
      
      For each work experience and project, include 3-4 achievement bullet points that are specific, measurable, and impactful.
      
      Return the resume as a structured JSON object matching the ResumeData type with the following structure:
      {
        "personalInfo": {
          "summary": "Professional summary here"
        },
        "skills": [
          {
            "name": "Category Name",
            "skills": [
              { "name": "Skill 1" },
              { "name": "Skill 2" }
            ]
          }
        ],
        "experience": [
          {
            "company": "Company Name",
            "position": "Position Title",
            "startDate": "Start Date",
            "endDate": "End Date",
            "location": "Location",
            "description": "Brief description",
            "achievements": ["Achievement 1", "Achievement 2"]
          }
        ],
        "projects": [
          {
            "name": "Project Name",
            "description": "Project description",
            "technologies": "Technologies used",
            "link": "",
            "startDate": "Start Date",
            "endDate": "End Date",
            "achievements": ["Achievement 1", "Achievement 2"]
          }
        ]
      }
      `

      await updateProgress("Generating professional content", 30, 70)

      // Generate resume data using Gemini API
      const generatedData = await generateStructuredData<Partial<ResumeData>>(prompt, systemPrompt, {
        temperature: 0.7,
      })

      // Step 3: Finalize
      await updateProgress("Finalizing resume content", 70, 100)

      // Merge with existing personal info
      if (generatedData.personalInfo && resumeData.personalInfo) {
        generatedData.personalInfo = {
          ...resumeData.personalInfo,
          summary: generatedData.personalInfo.summary || resumeData.personalInfo.summary || "",
        }
      }

      onResumeDataGenerated(generatedData)
      setGenerationCompleted(true)

      toast({
        title: "Resume Generated Successfully",
        description: "Your AI-optimized resume has been created and is ready for review.",
        variant: "default",
      })
    } catch (error: any) {
      console.error("Generation failed:", error)
      setGenerationError(error.message || "An unexpected error occurred.")

      toast({
        title: "Generation Failed",
        description: "There was an error generating your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Function to update progress
  const updateProgress = async (step: string, start: number, end: number) => {
    setCurrentStep(step)
    for (let i = start; i <= end; i++) {
      setGenerationProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
  }

  return (
    <Card className="w-full max-w-full bg-gray-800/50 backdrop-blur-md border border-purple-500/30 shadow-xl">
      <CardHeader className="px-3 sm:px-4 md:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl text-white">
            <BrainCircuit className="h-4 w-4 sm:h-5 sm:w-5 text-purple-400" />
            AI Resume Generator
            <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
              2025 Tech
            </Badge>
          </CardTitle>
        </div>
        <CardDescription className="text-purple-200 text-xs sm:text-sm mt-1">
          Generate a complete, tailored resume in seconds using our advanced AI technology
        </CardDescription>
      </CardHeader>
      <CardContent className="px-3 sm:px-4 md:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700/50 rounded-lg p-1 mb-4">
            <TabsTrigger
              value="quick-generate"
              className="text-xs sm:text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md"
            >
              <Zap className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xxs:inline">Quick</span> Generate
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="text-xs sm:text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md"
            >
              <Sparkles className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xxs:inline">Advanced</span> Options
            </TabsTrigger>
            <TabsTrigger
              value="enhancer"
              className="text-xs sm:text-sm data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-md"
            >
              <Target className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
              Enhancer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick-generate" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description" className="text-sm sm:text-base text-white">
                Job Description
              </Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here to generate a tailored resume..."
                className="h-24 sm:h-32 text-xs sm:text-sm md:text-base bg-gray-900/50 text-white border-purple-500/30 resize-none"
                value={jobDescription || ""}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                disabled={isGenerating}
              />
              <p className="text-xs text-purple-200">
                Our AI will analyze the job requirements and create a perfectly tailored resume
              </p>
            </div>

            {isGenerating ? (
              <div className="space-y-4 rounded-lg border border-purple-500/30 p-3 sm:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-xs sm:text-sm text-white">{currentStep}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-purple-200">{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-1.5 sm:h-2 bg-purple-200" />
              </div>
            ) : generationCompleted ? (
              <Alert className="border-green-500/30 bg-green-900/50">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertTitle className="text-green-300 text-xs sm:text-sm">Resume Generated!</AlertTitle>
                <AlertDescription className="text-green-200 text-xs">
                  Your AI-optimized resume has been created and is ready for review in the editor.
                </AlertDescription>
              </Alert>
            ) : null}

            <Button
              onClick={generateResume}
              disabled={isGenerating || (!jobDescription && !careerProfile)}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs sm:text-sm py-2 sm:py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Generate Complete Resume
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="career-profile" className="text-sm sm:text-base text-white">
                Career Profile
              </Label>
              <Textarea
                id="career-profile"
                placeholder="Describe your career background, goals, and target role..."
                className="h-20 sm:h-24 text-xs sm:text-sm md:text-base bg-gray-900/50 text-white border-purple-500/30 resize-none"
                value={careerProfile}
                onChange={(e) => setCareerProfile(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-keywords" className="text-sm sm:text-base text-white">
                Key Skills & Technologies
              </Label>
              <Input
                id="skill-keywords"
                placeholder="e.g. React, Project Management, Data Analysis"
                className="text-xs sm:text-sm md:text-base bg-gray-900/50 text-white border-purple-500/30"
                value={skillKeywords}
                onChange={(e) => setSkillKeywords(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-white">Experience Level</Label>
                <select
                  className="w-full rounded-md border border-purple-500/30 bg-gray-900/50 text-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base"
                  disabled={isGenerating}
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="entry">Entry Level (0-2 years)</option>
                  <option value="mid">Mid Level (3-5 years)</option>
                  <option value="senior">Senior Level (6+ years)</option>
                  <option value="executive">Executive Level</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base text-white">Industry Focus</Label>
                <select
                  className="w-full rounded-md border border-purple-500/30 bg-gray-900/50 text-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base"
                  disabled={isGenerating}
                  value={industryFocus}
                  onChange={(e) => setIndustryFocus(e.target.value)}
                >
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="marketing">Marketing</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base text-white">Generation Focus</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={generationOptions.atsOptimized ? "default" : "outline"}
                  className="justify-start text-xs border-purple-500/50 text-purple-200 hover:bg-purple-500/20 px-2 h-auto py-1.5"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("atsOptimized", !generationOptions.atsOptimized)}
                >
                  <Target className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                  <span className="truncate">ATS Optimization</span>
                </Button>
                <Button
                  variant={generationOptions.industrySpecific ? "default" : "outline"}
                  className="justify-start text-xs border-purple-500/50 text-purple-200 hover:bg-purple-500/20 px-2 h-auto py-1.5"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("industrySpecific", !generationOptions.industrySpecific)}
                >
                  <Briefcase className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                  <span className="truncate">Industry Relevance</span>
                </Button>
                <Button
                  variant={generationOptions.creative ? "default" : "outline"}
                  className="justify-start text-xs border-purple-500/50 text-purple-200 hover:bg-purple-500/20 px-2 h-auto py-1.5"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("creative", !generationOptions.creative)}
                >
                  <Lightbulb className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                  <span className="truncate">Creative Approach</span>
                </Button>
                <Button
                  variant={generationOptions.includeMetrics ? "default" : "outline"}
                  className="justify-start text-xs border-purple-500/50 text-purple-200 hover:bg-purple-500/20 px-2 h-auto py-1.5"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("includeMetrics", !generationOptions.includeMetrics)}
                >
                  <FileText className="mr-1 h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                  <span className="truncate">Include Metrics</span>
                </Button>
              </div>
            </div>

            <Alert className="border-blue-500/30 bg-blue-900/50">
              <Lightbulb className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-200 text-xs">
                Advanced options allow our AI to create a more personalized resume tailored to your specific career path
                and goals.
              </AlertDescription>
            </Alert>

            <Button
              onClick={generateResume}
              disabled={isGenerating}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-xs sm:text-sm py-2 sm:py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                  Generate Custom Resume
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="enhancer" className="mt-4">
            <AchievementEnhancer
              initialAchievements={
                resumeData?.experience &&
                  Array.isArray(resumeData.experience) &&
                  resumeData.experience.length > 0 &&
                  resumeData.experience[0]?.achievements
                  ? resumeData.experience[0].achievements
                  : [""]
              }
              context={resumeData?.personalInfo?.title || ""}
              onEnhanced={(enhancedAchievements) => {
                if (
                  resumeData?.experience &&
                  Array.isArray(resumeData.experience) &&
                  resumeData.experience.length > 0
                ) {
                  const updatedExperience = [...resumeData.experience]
                  updatedExperience[0] = {
                    ...updatedExperience[0],
                    achievements: enhancedAchievements,
                  }

                  onResumeDataGenerated({
                    experience: updatedExperience,
                  })

                  toast({
                    title: "Achievements Enhanced",
                    description: "Your achievements have been enhanced and added to your resume.",
                    variant: "default",
                  })
                }
              }}
            />
          </TabsContent>
        </Tabs>

        {!isGenerating && !generationCompleted && activeTab !== "enhancer" && (
          <div className="mt-4 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            <div className="rounded-lg border border-purple-500/30 p-2 sm:p-3 bg-gray-900/50">
              <div className="mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                <h3 className="font-medium text-xs sm:text-sm text-white">Personal Info</h3>
              </div>
              <p className="text-xs text-purple-200">
                AI generates a compelling summary optimized for your role.
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/30 p-2 sm:p-3 bg-gray-900/50">
              <div className="mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400" />
                <h3 className="font-medium text-xs sm:text-sm text-white">Skills Analysis</h3>
              </div>
              <p className="text-xs text-purple-200">
                Identifies relevant skills based on job market trends.
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/30 p-2 sm:p-3 bg-gray-900/50">
              <div className="mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-amber-400" />
                <h3 className="font-medium text-xs sm:text-sm text-white">Experience</h3>
              </div>
              <p className="text-xs text-purple-200">
                Creates achievement bullets with metrics that highlight impact.
              </p>
            </div>
            <div className="rounded-lg border border-purple-500/30 p-2 sm:p-3 bg-gray-900/50">
              <div className="mb-1 sm:mb-2 flex items-center gap-1 sm:gap-2">
                <Code className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                <h3 className="font-medium text-xs sm:text-sm text-white">Projects</h3>
              </div>
              <p className="text-xs text-purple-200">
                Showcases relevant projects with technical details.
              </p>
            </div>
          </div>
        )}
      </CardContent>

    </Card>
  )
}