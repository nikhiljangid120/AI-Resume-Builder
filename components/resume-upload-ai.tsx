"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import type { ResumeData } from "@/lib/types"
import { Upload, FileText, Loader2, AlertCircle, CheckCircle, Sparkles, FileUp, RefreshCw, Zap } from "lucide-react"

interface ResumeUploadAIProps {
  onResumeDataGenerated: (data: Partial<ResumeData>) => void
}

export function ResumeUploadAI({ onResumeDataGenerated }: ResumeUploadAIProps) {
  const [activeTab, setActiveTab] = useState("upload")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState("")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check if file is PDF or DOCX
      if (
        selectedFile.type === "application/pdf" ||
        selectedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        setFile(selectedFile)
        setError(null)
      } else {
        setFile(null)
        setError("Please upload a PDF or DOCX file")
        toast({
          title: "Invalid file format",
          description: "Please upload a PDF or DOCX file",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    // Simulate file upload with progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    setIsUploading(false)
    setIsProcessing(true)
    setProcessingProgress(0)

    try {
      // Simulate AI processing steps
      await simulateProcessingStep("Extracting text from document...", 0, 20)
      await simulateProcessingStep("Analyzing content structure...", 20, 40)
      await simulateProcessingStep("Identifying sections and categories...", 40, 60)
      await simulateProcessingStep("Generating structured resume data...", 60, 80)
      await simulateProcessingStep("Finalizing and optimizing content...", 80, 100)

      // Generate mock resume data
      const mockResumeData = generateMockResumeData(file.name)

      // Call the callback with the generated data
      onResumeDataGenerated(mockResumeData)

      setSuccess("Resume successfully processed and data extracted!")
      toast({
        title: "Resume processed successfully",
        description: "Your resume data has been extracted and is ready for editing.",
        variant: "default",
      })
    } catch (err) {
      setError("Error processing resume. Please try again.")
      toast({
        title: "Processing failed",
        description: "There was an error processing your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Helper function to simulate processing steps
  const simulateProcessingStep = async (step: string, startProgress: number, endProgress: number) => {
    setProcessingStep(step)

    // Simulate progress
    for (let i = startProgress; i <= endProgress; i++) {
      setProcessingProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }

  // Generate mock resume data based on filename
  const generateMockResumeData = (filename: string): Partial<ResumeData> => {
    // This would be replaced with actual AI-generated data in a real implementation
    return {
      personalInfo: {
        name: filename.split(".")[0].replace(/_/g, " "),
        title: "Software Developer",
        email: "example@email.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        website: "linkedin.com/in/example",
        summary:
          "Experienced software developer with a passion for creating efficient, scalable applications. Skilled in JavaScript, React, and Node.js with a focus on delivering high-quality user experiences.",
      },
      skills: [
        {
          name: "Programming Languages",
          skills: [{ name: "JavaScript" }, { name: "TypeScript" }, { name: "Python" }],
        },
        {
          name: "Frameworks & Libraries",
          skills: [{ name: "React" }, { name: "Next.js" }, { name: "Node.js" }],
        },
      ],
      experience: [
        {
          company: "Tech Solutions Inc.",
          position: "Senior Developer",
          startDate: "Jan 2021",
          endDate: "Present",
          location: "San Francisco, CA",
          description: "Lead developer for web applications and services.",
          achievements: [
            "Developed and maintained multiple React applications with 99.9% uptime",
            "Reduced application load time by 40% through code optimization",
            "Mentored junior developers and conducted code reviews",
          ],
        },
      ],
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-purple-500" />
          Resume Upload & AI Processing
          <Badge
            variant="outline"
            className="ml-2 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
          >
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Upload your existing resume and let our AI extract and enhance your information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">
              <FileUp className="mr-2 h-4 w-4" />
              Upload Resume
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4 space-y-4">
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 dark:border-gray-700">
                <div className="mb-4 rounded-full bg-purple-100 p-3 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="mb-1 text-sm font-medium">Upload your resume</h3>
                <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">PDF or DOCX format, max 5MB</p>
                <Label htmlFor="resume-upload" className="w-full">
                  <div className="flex w-full cursor-pointer items-center justify-center">
                    <Button className="gap-2">
                      <Upload className="h-4 w-4" />
                      Select File
                    </Button>
                  </div>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </Label>
              </div>

              {file && (
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setFile(null)} className="h-8 text-xs">
                      Remove
                    </Button>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uploading...</span>
                    <span className="text-sm font-medium">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}

              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{processingStep}</span>
                    <span className="text-sm font-medium">{processingProgress}%</span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-200">{success}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleUpload}
                disabled={!file || isUploading || isProcessing}
                className="w-full gap-2 bg-purple-600 hover:bg-purple-700"
              >
                {isUploading || isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Processing..."}
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Process with AI
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-4 space-y-4">
            <div className="space-y-4">
              <Alert className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <AlertDescription className="text-purple-700 dark:text-purple-200">
                  Our AI can generate a complete resume from scratch based on your career details.
                </AlertDescription>
              </Alert>

              <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                <h3 className="mb-3 text-sm font-medium">Generate Resume with AI</h3>
                <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
                  Let our AI create a professional resume based on your career information. Just provide some basic
                  details and we'll do the rest.
                </p>
                <Button className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  <Sparkles className="h-4 w-4" />
                  Start AI Generation
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-medium">AI Content Enhancement</h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Improve existing content with AI suggestions and optimizations
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-medium">ATS Optimization</h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Optimize your resume for Applicant Tracking Systems
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        <p>Powered by Gemini AI</p>
        <p>Your data is processed securely</p>
      </CardFooter>
    </Card>
  )
}
