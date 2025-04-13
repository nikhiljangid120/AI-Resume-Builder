"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { enhanceAchievements } from "@/lib/ai-services/achievement-enhancer-service"
import {
  Sparkles,
  Loader2,
  ArrowRight,
  Copy,
  CheckCircle,
  AlertTriangle,
  Plus,
  Trash2,
  BarChart,
  Zap,
  Code,
  Users,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AchievementEnhancerProps {
  initialAchievements?: string[] | null
  context?: string
  onEnhanced: (enhancedAchievements: string[]) => void
}

export function AchievementEnhancer({
  initialAchievements = [""],
  context = "",
  onEnhanced,
}: AchievementEnhancerProps) {
  // Initialize with a default empty achievement if initialAchievements is undefined, null, or empty
  const [achievements, setAchievements] = useState<string[]>(
    Array.isArray(initialAchievements) && initialAchievements.length > 0
      ? initialAchievements.map((a) => a || "")
      : [""],
  )

  // Update achievements if initialAchievements prop changes
  useEffect(() => {
    if (Array.isArray(initialAchievements) && initialAchievements.length > 0) {
      setAchievements(initialAchievements.map((a) => a || ""))
    }
  }, [initialAchievements])

  const [enhancedAchievements, setEnhancedAchievements] = useState<string[]>([])
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [jobRole, setJobRole] = useState(context || "")
  const [error, setError] = useState<string | null>(null)
  const [enhancementStyle, setEnhancementStyle] = useState<"metrics" | "impact" | "technical" | "leadership">("metrics")
  const { toast } = useToast()

  const handleAddAchievement = () => {
    setAchievements([...achievements, ""])
  }

  const handleRemoveAchievement = (index: number) => {
    if (achievements.length <= 1) {
      setAchievements([""])
    } else {
      const newAchievements = [...achievements]
      newAchievements.splice(index, 1)
      setAchievements(newAchievements)
    }
  }

  const handleAchievementChange = (index: number, value: string) => {
    const newAchievements = [...achievements]
    newAchievements[index] = value
    setAchievements(newAchievements)
  }

  const handleEnhanceAchievements = async () => {
    // Validate inputs
    if (achievements.every((a) => !a || a.trim() === "")) {
      toast({
        title: "Missing Achievements",
        description: "Please enter at least one achievement to enhance.",
        variant: "destructive",
      })
      return
    }

    setIsEnhancing(true)
    setError(null)

    try {
      // Call the achievement enhancer service
      const enhanced = await enhanceAchievements(
        achievements.filter((a) => a && a.trim() !== ""),
        jobRole,
        enhancementStyle,
      )

      setEnhancedAchievements(enhanced)

      // Call the callback with enhanced achievements
      onEnhanced(enhanced)

      toast({
        title: "Achievements Enhanced",
        description: "Your achievements have been enhanced with AI.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error enhancing achievements:", error)
      setError("Failed to enhance achievements. Please try again.")

      toast({
        title: "Enhancement Failed",
        description: "There was an error enhancing your achievements. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleCopyAchievement = (achievement: string) => {
    navigator.clipboard.writeText(achievement)
    toast({
      title: "Copied to Clipboard",
      description: "Achievement copied to clipboard.",
      variant: "success",
    })
  }

  const handleApplyAll = () => {
    if (enhancedAchievements.length > 0) {
      onEnhanced(enhancedAchievements)
      toast({
        title: "Applied All Enhancements",
        description: "All enhanced achievements have been applied to your resume.",
        variant: "success",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            Achievement Enhancer
            <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">AI-Powered</Badge>
          </CardTitle>
          <CardDescription>Transform basic achievements into powerful, metrics-driven bullet points</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="job-role">Your Job Role/Title</Label>
            <Input
              id="job-role"
              placeholder="e.g. Software Engineer, Project Manager, Marketing Specialist"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={isEnhancing}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Providing your role helps the AI generate more relevant enhancements
            </p>
          </div>

          <div className="space-y-2">
            <Label>Enhancement Style</Label>
            <Tabs
              defaultValue="metrics"
              value={enhancementStyle}
              onValueChange={(value) => setEnhancementStyle(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="metrics" disabled={isEnhancing}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="impact" disabled={isEnhancing}>
                  <Zap className="mr-2 h-4 w-4" />
                  Impact
                </TabsTrigger>
                <TabsTrigger value="technical" disabled={isEnhancing}>
                  <Code className="mr-2 h-4 w-4" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="leadership" disabled={isEnhancing}>
                  <Users className="mr-2 h-4 w-4" />
                  Leadership
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select the style of enhancement that best fits your target role
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Your Achievements</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAchievement}
                disabled={isEnhancing}
                className="h-7 gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add
              </Button>
            </div>

            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-2">
                <Textarea
                  value={achievement || ""}
                  onChange={(e) => handleAchievementChange(index, e.target.value)}
                  placeholder="Enter an achievement or responsibility from your resume"
                  disabled={isEnhancing}
                  className="min-h-[60px] resize-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAchievement(index)}
                  disabled={achievements.length <= 1 || isEnhancing}
                  className="h-9 w-9 shrink-0 text-gray-500 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove achievement</span>
                </Button>
              </div>
            ))}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleEnhanceAchievements}
            disabled={isEnhancing || achievements.every((a) => !a || a.trim() === "")}
            className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enhancing with AI...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Enhance Achievements
              </>
            )}
          </Button>

          {enhancedAchievements.length > 0 && (
            <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-amber-800 dark:text-amber-300">Enhanced Achievements</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyAll}
                  className="gap-1 border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800"
                >
                  <CheckCircle className="h-3 w-3" />
                  Apply All
                </Button>
              </div>

              {enhancedAchievements.map((enhanced, index) => (
                <div key={index} className="space-y-2 rounded-md bg-white p-3 shadow-sm dark:bg-gray-800">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{achievements[index] || ""}</p>
                    <ArrowRight className="h-4 w-4 shrink-0 text-amber-500" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{enhanced}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyAchievement(enhanced)}
                      className="h-6 w-6 shrink-0 text-gray-500 hover:text-amber-500"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy enhanced achievement</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-3 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <p>Powered by Gemini AI</p>
          <p>Results may vary based on input quality</p>
        </CardFooter>
      </Card>

      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-700 dark:text-amber-200">
          The Achievement Enhancer uses AI to transform your basic achievements into powerful, metrics-driven bullet
          points that highlight your impact and value to potential employers.
        </AlertDescription>
      </Alert>
    </div>
  )
}
