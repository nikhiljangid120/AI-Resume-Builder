"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, ArrowRight, FileText, BarChart, Lightbulb, Copy } from "lucide-react"

interface AIFeedbackDisplayProps {
  title: string
  description: string
  beforeContent?: string | string[]
  afterContent?: string | string[]
  score?: number
  feedback?: string[]
  suggestions?: string[]
  metrics?: {
    label: string
    value: number
    color: string
  }[]
  isSuccess: boolean
  errorMessage?: string
  onApply?: () => void
  onCopy?: (content: string) => void
}

export function AIFeedbackDisplay({
  title,
  description,
  beforeContent,
  afterContent,
  score,
  feedback,
  suggestions,
  metrics,
  isSuccess,
  errorMessage,
  onApply,
  onCopy,
}: AIFeedbackDisplayProps) {
  const [activeTab, setActiveTab] = useState("comparison")

  // Helper function to format content for display
  const formatContent = (content: string | string[] | undefined): string[] => {
    if (!content) return []
    return Array.isArray(content) ? content : [content]
  }

  const beforeItems = formatContent(beforeContent)
  const afterItems = formatContent(afterContent)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent"
    if (score >= 80) return "Very Good"
    if (score >= 70) return "Good"
    if (score >= 60) return "Fair"
    return "Needs Improvement"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-500" />
          )}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : (
          <>
            {score !== undefined && (
              <div className="mb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${getScoreColor(score)}`}>{score}%</span>
                    <Badge className={getScoreBadge(score)}>{getScoreLabel(score)}</Badge>
                  </div>
                </div>
                <Progress
                  value={score}
                  className="h-2"
                  indicatorClassName={score >= 80 ? "bg-green-600" : score >= 60 ? "bg-yellow-600" : "bg-red-600"}
                />
              </div>
            )}

            {(beforeItems.length > 0 || afterItems.length > 0 || feedback?.length || suggestions?.length) && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="comparison">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Before/After
                  </TabsTrigger>
                  <TabsTrigger value="feedback">
                    <FileText className="mr-2 h-4 w-4" />
                    Feedback
                  </TabsTrigger>
                  <TabsTrigger value="metrics">
                    <BarChart className="mr-2 h-4 w-4" />
                    Metrics
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comparison" className="mt-4 space-y-4">
                  {beforeItems.length > 0 && afterItems.length > 0 ? (
                    beforeItems.map((before, index) => {
                      const after = afterItems[index] || ""
                      return (
                        <div
                          key={index}
                          className="space-y-2 rounded-md border border-gray-200 p-4 dark:border-gray-700"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">Before:</h4>
                              <p className="text-sm">{before}</p>
                            </div>
                            <ArrowRight className="mt-4 h-5 w-5 flex-shrink-0 text-gray-400" />
                            <div className="flex-1">
                              <h4 className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">After:</h4>
                              <p className="text-sm font-medium">{after}</p>
                              {onCopy && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onCopy(after)}
                                  className="mt-1 h-7 gap-1 text-xs"
                                >
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>No comparison data available.</AlertDescription>
                    </Alert>
                  )}

                  {onApply && afterItems.length > 0 && (
                    <Button onClick={onApply} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4" />
                      Apply Changes
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="feedback" className="mt-4 space-y-4">
                  {feedback && feedback.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Analysis Feedback</h4>
                      {feedback.map((item, index) => (
                        <Alert
                          key={index}
                          variant="default"
                          className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950"
                        >
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <AlertDescription className="text-blue-700 dark:text-blue-200">{item}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : null}

                  {suggestions && suggestions.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Improvement Suggestions</h4>
                      {suggestions.map((item, index) => (
                        <Alert
                          key={index}
                          variant="default"
                          className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950"
                        >
                          <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <AlertDescription className="text-amber-700 dark:text-amber-200">{item}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  ) : null}

                  {(!feedback || feedback.length === 0) && (!suggestions || suggestions.length === 0) && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>No feedback or suggestions available.</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="metrics" className="mt-4">
                  {metrics && metrics.length > 0 ? (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Performance Metrics</h4>
                      {metrics.map((metric, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{metric.label}</span>
                            <span className="text-sm font-medium" style={{ color: metric.color }}>
                              {metric.value}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className="h-full"
                              style={{
                                width: `${metric.value}%`,
                                backgroundColor: metric.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>No metrics data available.</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
