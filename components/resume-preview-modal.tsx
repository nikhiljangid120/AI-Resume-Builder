"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ResumePreview } from "@/components/resume-preview"
import { Download, Maximize2, Minimize2, Printer } from "lucide-react"
import type { ResumeData, Template } from "@/lib/types"
import { exportResumeToPDF } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"

interface ResumePreviewModalProps {
  resumeData: ResumeData
  template: Template
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResumePreviewModal({ resumeData, template, open, onOpenChange }: ResumePreviewModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  // Handle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullScreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange)
    }
  }, [])

  // Handle PDF export
  const handleExportToPDF = async () => {
    setIsExporting(true)
    try {
      await exportResumeToPDF(resumeData, template)
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

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Resume Preview</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleExportToPDF} disabled={isExporting}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-auto bg-gray-100 p-8 rounded-md">
          <div className="mx-auto max-w-[800px] bg-white shadow-lg">
            <ResumePreview resumeData={resumeData} template={template} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
