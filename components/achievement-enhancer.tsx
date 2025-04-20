"use client"

import { useState, useEffect, useRef } from "react"
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

// Custom useMediaQuery hook defined inline instead of imported
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener("change", handler);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, [query]);

  return matches;
}

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
  // Media queries for responsive design
  const isMobile = useMediaQuery("(max-width: 480px)")
  const isTablet = useMediaQuery("(min-width: 481px) and (max-width: 768px)")
  
  // Initialize with a default empty achievement
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
  
  // Ref for scrolling to results
  const resultsSectionRef = useRef<HTMLDivElement>(null)

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
      
      // Scroll to results after a short delay to ensure they're rendered
      setTimeout(() => {
        if (resultsSectionRef.current) {
          resultsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 300);
      
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
    <div className="space-y-4 sm:space-y-6 w-full max-w-full">
      <Card className="w-full overflow-hidden">
        <CardHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-5 space-y-1 sm:space-y-2">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 sm:gap-2">
            <CardTitle className="flex flex-wrap items-center gap-1 sm:gap-2 text-base sm:text-lg md:text-xl">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-amber-500" />
              <span className="text-sm sm:text-base md:text-lg">Achievement Enhancer</span>
              <Badge className="ml-0 sm:ml-1 md:ml-2 text-xs py-0 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white whitespace-nowrap">
                <span className="hidden xs:inline">AI-Powered</span>
                <span className="xs:hidden">AI</span>
              </Badge>
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
            Transform basic achievements into powerful, metrics-driven bullet points
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-4 md:px-6">
          <div className="space-y-1 sm:space-y-2">
            <Label 
              htmlFor="job-role" 
              className="text-xs sm:text-sm md:text-base font-medium block"
            >
              Your Job Role/Title
            </Label>
            <Input
              id="job-role"
              placeholder={isMobile ? "e.g. Software Engineer" : "e.g. Software Engineer, Project Manager, Marketing Specialist"}
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              disabled={isEnhancing}
              className="w-full text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10"
            />
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Providing your role helps the AI generate more relevant enhancements
            </p>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label className="text-xs sm:text-sm md:text-base font-medium block">Enhancement Style</Label>
            <Tabs
              defaultValue="metrics"
              value={enhancementStyle}
              onValueChange={(value) => setEnhancementStyle(value as any)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 p-1 h-auto min-h-8 sm:min-h-9 md:min-h-10">
                <TabsTrigger 
                  value="metrics" 
                  disabled={isEnhancing} 
                  className="text-xs sm:text-sm h-7 sm:h-8 md:h-9 py-0 px-1 sm:px-2 flex items-center justify-center"
                >
                  <BarChart className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1" />
                  <span className={isMobile ? "hidden sm:inline" : ""}>Metrics</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="impact" 
                  disabled={isEnhancing} 
                  className="text-xs sm:text-sm h-7 sm:h-8 md:h-9 py-0 px-1 sm:px-2 flex items-center justify-center"
                >
                  <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1" />
                  <span className={isMobile ? "hidden sm:inline" : ""}>Impact</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="technical" 
                  disabled={isEnhancing} 
                  className="text-xs sm:text-sm h-7 sm:h-8 md:h-9 py-0 px-1 sm:px-2 flex items-center justify-center"
                >
                  <Code className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1" />
                  <span className={isMobile ? "hidden sm:inline" : ""}>Technical</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="leadership" 
                  disabled={isEnhancing} 
                  className="text-xs sm:text-sm h-7 sm:h-8 md:h-9 py-0 px-1 sm:px-2 flex items-center justify-center"
                >
                  <Users className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1" />
                  <span className={isMobile ? "hidden sm:inline" : ""}>Leadership</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Select the style of enhancement that best fits your target role
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs sm:text-sm md:text-base font-medium">Your Achievements</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAchievement}
                disabled={isEnhancing}
                className="h-6 sm:h-7 md:h-8 text-xs sm:text-sm px-1.5 sm:px-2 md:px-3 gap-1"
              >
                <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
                Add
              </Button>
            </div>

            <div className="space-y-2 max-h-60 sm:max-h-72 md:max-h-96 overflow-y-auto p-0.5 rounded-md">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-1 sm:gap-2">
                  <Textarea
                    value={achievement || ""}
                    onChange={(e) => handleAchievementChange(index, e.target.value)}
                    placeholder={isMobile ? "Enter an achievement" : "Enter an achievement or responsibility from your resume"}
                    disabled={isEnhancing}
                    className="min-h-[40px] xs:min-h-[50px] sm:min-h-[60px] w-full resize-none text-xs sm:text-sm md:text-base py-1 px-2 sm:py-2 sm:px-3"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAchievement(index)}
                    disabled={achievements.length <= 1 || isEnhancing}
                    className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 shrink-0 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4" />
                    <span className="sr-only">Remove achievement</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="text-xs sm:text-sm md:text-base py-2 px-3">
              <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleEnhanceAchievements}
            disabled={isEnhancing || achievements.every((a) => !a || a.trim() === "")}
            className="w-full gap-1 sm:gap-2 text-xs sm:text-sm md:text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 py-1 sm:py-1.5 md:py-2 h-8 sm:h-9 md:h-10"
          >
            {isEnhancing ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 animate-spin" />
                <span className={isMobile ? "hidden sm:inline" : ""}>Enhancing with AI...</span>
                <span className={isMobile ? "" : "hidden"}>Enhancing...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                <span className={isMobile ? "hidden sm:inline" : ""}>Enhance Achievements</span>
                <span className={isMobile ? "" : "hidden"}>Enhance</span>
              </>
            )}
          </Button>

          {enhancedAchievements.length > 0 && (
            <div 
              ref={resultsSectionRef}
              className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-2 sm:p-3 md:p-4 dark:border-amber-900 dark:bg-amber-950"
            >
              <div className="flex items-center justify-between flex-wrap gap-1 sm:gap-2">
                <h3 className="font-medium text-amber-800 dark:text-amber-300 text-xs sm:text-sm md:text-base">Enhanced Achievements</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleApplyAll}
                  className="h-6 sm:h-7 md:h-8 gap-1 text-xs sm:text-sm border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900 dark:text-amber-300 dark:hover:bg-amber-800 px-1.5 sm:px-2 md:px-3"
                >
                  <CheckCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-3.5 md:w-3.5" />
                  Apply All
                </Button>
              </div>

              <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto p-0.5 rounded-md">
                {enhancedAchievements.map((enhanced, index) => (
                  <div key={index} className="space-y-1 sm:space-y-2 rounded-md bg-white p-1.5 sm:p-2 md:p-3 shadow-sm dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 break-words flex-grow">{achievements[index] || ""}</p>
                      <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 shrink-0 text-amber-500 mt-0.5" />
                    </div>
                    <div className="flex items-start justify-between gap-1 sm:gap-2">
                      <p className="text-xs sm:text-sm font-medium break-words flex-grow">{enhanced}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopyAchievement(enhanced)}
                        className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 text-gray-500 hover:text-amber-500"
                      >
                        <Copy className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span className="sr-only">Copy enhanced achievement</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-1 border-t bg-gray-50 px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-3 text-xs sm:text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <p className="text-center sm:text-left">Powered by Gemini AI</p>
          <p className="text-center sm:text-right">Results may vary based on input quality</p>
        </CardFooter>
      </Card>

      <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950 text-xs sm:text-sm p-2 sm:p-3 md:p-4">
        <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
        <AlertDescription className="text-amber-700 dark:text-amber-200 ml-2">
          {isMobile ? (
            "Transform your achievements into powerful, metrics-driven bullet points."
          ) : (
            "The Achievement Enhancer uses AI to transform your basic achievements into powerful, metrics-driven bullet points that highlight your impact and value to potential employers."
          )}
        </AlertDescription>
      </Alert>
    </div>
  )
}