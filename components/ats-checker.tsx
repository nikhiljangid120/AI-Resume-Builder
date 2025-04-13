import { AlertCircle, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ATSCheckerProps {
  score: number
  feedback: string[]
  missingKeywords?: string[]
  tailoringTips?: string[]
  isLoading?: boolean
}

export function ATSChecker({
  score,
  feedback,
  missingKeywords = [],
  tailoringTips = [],
  isLoading = false,
}: ATSCheckerProps) {
  const getScoreColor = () => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getProgressColor = () => {
    if (score >= 90) return "bg-green-600"
    if (score >= 70) return "bg-yellow-600"
    return "bg-red-600"
  }

  const getScoreLabel = () => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
          <div className="h-24 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">ATS Compatibility Score</h3>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${getScoreColor()}`}>{score}%</span>
                <Badge
                  variant={score >= 80 ? "default" : "outline"}
                  className={
                    score >= 90
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : score >= 70
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }
                >
                  {getScoreLabel()}
                </Badge>
              </div>
            </div>
            <Progress value={score} className="h-2" indicatorClassName={getProgressColor()} />
          </div>

          <Tabs defaultValue="feedback" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="tips">Tailoring Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="feedback" className="mt-4 space-y-3">
              {feedback.length > 0 ? (
                feedback.map((item, index) => (
                  <Alert
                    key={index}
                    variant="default"
                    className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950"
                  >
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription className="text-yellow-700 dark:text-yellow-200">{item}</AlertDescription>
                  </Alert>
                ))
              ) : (
                <Alert
                  variant="default"
                  className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950"
                >
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertTitle className="text-green-800 dark:text-green-300">Great Job!</AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-200">
                    Your resume is well-optimized for ATS systems. Add a job description to get specific
                    recommendations.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="keywords" className="mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Missing Keywords</CardTitle>
                  <CardDescription>Consider adding these keywords from the job description</CardDescription>
                </CardHeader>
                <CardContent>
                  {missingKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {missingKeywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>No missing keywords detected or no job description provided.</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="mt-4 space-y-3">
              {tailoringTips.length > 0 ? (
                tailoringTips.map((tip, index) => (
                  <Alert
                    key={index}
                    variant="default"
                    className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                  >
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-700 dark:text-blue-200">{tip}</AlertDescription>
                  </Alert>
                ))
              ) : (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Add a job description to get tailored recommendations for this position.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
