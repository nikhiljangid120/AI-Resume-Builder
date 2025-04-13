"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { ResumeData } from "@/lib/types"
import { AchievementEnhancer } from "@/components/achievement-enhancer"
import { generateStructuredData } from "@/lib/ai-services/gemini-service"
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
        maxOutputTokens: 2048,
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
        variant: "success",
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-purple-500" />
          AI Resume Generator
          <Badge className="ml-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white">2025 Tech</Badge>
        </CardTitle>
        <CardDescription>
          Generate a complete, tailored resume in seconds using our advanced AI technology
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick-generate">
              <Zap className="mr-2 h-4 w-4" />
              Quick Generate
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Sparkles className="mr-2 h-4 w-4" />
              Advanced Options
            </TabsTrigger>
            <TabsTrigger value="enhancer">
              <Target className="mr-2 h-4 w-4" />
              Achievement Enhancer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quick-generate" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here to generate a tailored resume..."
                className="h-32 resize-none"
                value={jobDescription || ""}
                onChange={(e) => onJobDescriptionChange(e.target.value)}
                disabled={isGenerating}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Our AI will analyze the job requirements and create a perfectly tailored resume
              </p>
            </div>

            {isGenerating ? (
              <div className="space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">{currentStep}</span>
                  </div>
                  <span className="text-sm font-medium">{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-2" />
              </div>
            ) : generationCompleted ? (
              <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle className="text-green-800 dark:text-green-300">Resume Generated!</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-200">
                  Your AI-optimized resume has been created and is ready for review in the editor.
                </AlertDescription>
              </Alert>
            ) : null}

            <Button
              onClick={generateResume}
              disabled={isGenerating || (!jobDescription && !careerProfile)}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Complete Resume
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="career-profile">Career Profile</Label>
              <Textarea
                id="career-profile"
                placeholder="Describe your career background, goals, and target role..."
                className="h-24 resize-none"
                value={careerProfile}
                onChange={(e) => setCareerProfile(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill-keywords">Key Skills & Technologies</Label>
              <Input
                id="skill-keywords"
                placeholder="e.g. React, Project Management, Data Analysis"
                value={skillKeywords}
                onChange={(e) => setSkillKeywords(e.target.value)}
                disabled={isGenerating}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience Level</Label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
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
                <Label>Industry Focus</Label>
                <select
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
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
              <Label>Generation Focus</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={generationOptions.atsOptimized ? "default" : "outline"}
                  className="justify-start"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("atsOptimized", !generationOptions.atsOptimized)}
                >
                  <Target className="mr-2 h-4 w-4 text-purple-500" />
                  ATS Optimization
                </Button>
                <Button
                  variant={generationOptions.industrySpecific ? "default" : "outline"}
                  className="justify-start"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("industrySpecific", !generationOptions.industrySpecific)}
                >
                  <Briefcase className="mr-2 h-4 w-4 text-blue-500" />
                  Industry Relevance
                </Button>
                <Button
                  variant={generationOptions.creative ? "default" : "outline"}
                  className="justify-start"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("creative", !generationOptions.creative)}
                >
                  <Lightbulb className="mr-2 h-4 w-4 text-amber-500" />
                  Creative Approach
                </Button>
                <Button
                  variant={generationOptions.includeMetrics ? "default" : "outline"}
                  className="justify-start"
                  disabled={isGenerating}
                  onClick={() => handleOptionToggle("includeMetrics", !generationOptions.includeMetrics)}
                >
                  <FileText className="mr-2 h-4 w-4 text-green-500" />
                  Include Metrics
                </Button>
              </div>
            </div>

            <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
              <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-700 dark:text-blue-200">
                Advanced options allow our AI to create a more personalized resume tailored to your specific career path
                and goals.
              </AlertDescription>
            </Alert>

            <Button
              onClick={generateResume}
              disabled={isGenerating}
              className="w-full gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
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
                // Update the first experience with enhanced achievements
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
                    variant: "success",
                  })
                }
              }}
            />
          </TabsContent>
        </Tabs>

        {!isGenerating && !generationCompleted && activeTab !== "enhancer" && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-2 flex items-center gap-2">
                <User className="h-5 w-5 text-purple-500" />
                <h3 className="font-medium">Personal Info</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI generates a compelling professional summary and personal details optimized for your target role.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Skills Analysis</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Identifies and prioritizes the most relevant skills based on job market trends and requirements.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-2 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Experience</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Creates achievement-focused bullet points with metrics and results that highlight your impact.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
              <div className="mb-2 flex items-center gap-2">
                <Code className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Projects</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showcases your most relevant projects with technical details and business outcomes.
              </p>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <p>Powered by Gemini AI</p>
        <p>Using real-time ML for optimal results</p>
      </CardFooter>
    </Card>
  )
}
