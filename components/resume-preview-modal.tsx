"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ResumePreview } from "@/components/resume-preview"
import {
  Download,
  Maximize2,
  Minimize2,
  Printer,
  Loader2,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Copy
} from "lucide-react"
import type { ResumeData, Template } from "@/lib/types"
import { exportResumeToPDF } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"

interface ResumePreviewModalProps {
  resumeData: ResumeData
  template: Template
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResumePreviewModal({ resumeData, template, open, onOpenChange }: ResumePreviewModalProps) {
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isPrinting, setIsPrinting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [activeTab, setActiveTab] = useState("preview")
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait")
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Handle fullscreen mode
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
        toast({
          title: "Fullscreen Failed",
          description: "Unable to enter fullscreen mode. Your browser may not support this feature.",
          variant: "destructive",
        })
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

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50))
  }

  const handleZoomReset = () => {
    setZoomLevel(100)
  }

  // Toggle orientation
  const toggleOrientation = () => {
    setOrientation((prev) => (prev === "portrait" ? "landscape" : "portrait"))
  }

  // Handle PDF export
  const handleExportToPDF = async () => {
    setIsExporting(true)
    try {
      await exportResumeToPDF(resumeData, template, orientation)
      toast({
        title: "Export Successful",
        description: "Your resume has been exported to PDF successfully!",
        variant: "default",
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

  // Share resume (using Web Share API if available)
  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${resumeData.personalInfo.name || "Resume"}`,
          text: "Check out my resume!",
          url: window.location.href,
        })
        toast({
          title: "Shared Successfully",
          description: "Your resume link has been shared!",
          variant: "default",
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Resume link copied to clipboard. You can now share it manually.",
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Sharing failed:", error)
      toast({
        title: "Sharing Failed",
        description: "Unable to share your resume. Please try copying the link manually.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  // Copy resume link to clipboard
  const handleCopyLink = async () => {
    setIsCopying(true)
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Resume link copied to clipboard!",
        variant: "default",
      })
    } catch (error) {
      console.error("Copy failed:", error)
      toast({
        title: "Copy Failed",
        description: "Unable to copy resume link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCopying(false)
    }
  }

  // Improved print function with better loading and error handling
  const handlePrint = () => {
    setIsPrinting(true)
    try {
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        throw new Error("Unable to open print window. Please check your browser settings.")
      }

      const resumeElement = document.getElementById("resume-preview-container")
      if (!resumeElement) {
        throw new Error("Resume preview element not found.")
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${resumeData.personalInfo.name || "Resume"} - Resume</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @page {
                size: ${orientation === "portrait" ? "A4" : "A4 landscape"};
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
                background: white;
                font-family: system-ui, -apple-system, sans-serif;
              }
              .loading {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.9);
                z-index: 9999;
              }
              .spinner {
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: #9333ea;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin-bottom: 16px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              .resume-container {
                width: ${orientation === "portrait" ? "210mm" : "297mm"};
                min-height: ${orientation === "portrait" ? "297mm" : "210mm"};
                padding: 10mm;
                margin: 0 auto;
                background: white;
                box-sizing: border-box;
                page-break-after: always;
                position: relative;
              }
              @media print {
                body {
                  width: ${orientation === "portrait" ? "210mm" : "297mm"};
                  height: ${orientation === "portrait" ? "297mm" : "210mm"};
                }
                .loading {
                  display: none !important;
                }
                .resume-container {
                  padding: 10mm;
                  page-break-after: always;
                  box-shadow: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="loading" id="loading-indicator">
              <div class="spinner"></div>
              <p>Preparing to print...</p>
            </div>
            <div class="resume-container" id="print-container">
              ${resumeElement.outerHTML}
            </div>
            <script>
              window.onload = function() {
                const resumeContent = document.getElementById('print-container');
                const loadingIndicator = document.getElementById('loading-indicator');
                if (resumeContent && resumeContent.children.length > 0) {
                  setTimeout(function() {
                    loadingIndicator.style.display = 'none';
                    window.print();
                    setTimeout(() => window.close(), 1000);
                  }, 1000);
                } else {
                  loadingIndicator.innerHTML = '<p style="color: red;">Error loading resume content. Please try again.</p>';
                  setTimeout(() => window.close(), 3000);
                }
              };
            </script>
          </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.onerror = () => {
        printWindow.close()
        throw new Error("Error preparing print preview")
      }
    } catch (error) {
      console.error("Print error:", error)
      toast({
        title: "Print Failed",
        description: error instanceof Error ? error.message : "Failed to print resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPrinting(false)
    }
  }

  // Save current view preferences to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "resume-preview-preferences",
        JSON.stringify({
          zoomLevel,
          orientation,
          activeTab,
        })
      )
    }
  }, [zoomLevel, orientation, activeTab])

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedPreferences = localStorage.getItem("resume-preview-preferences")
        if (savedPreferences) {
          const { zoomLevel: savedZoom, orientation: savedOrientation, activeTab: savedTab } =
            JSON.parse(savedPreferences)
          setZoomLevel(savedZoom || 100)
          setOrientation(savedOrientation || "portrait")
          setActiveTab(savedTab || "preview")
        }
      } catch (error) {
        console.error("Error loading saved preferences:", error)
      }
    }
  }, [])

  // Keyboard shortcuts for zoom and other controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "=") {
          e.preventDefault()
          handleZoomIn()
        } else if (e.key === "-") {
          e.preventDefault()
          handleZoomOut()
        } else if (e.key === "0") {
          e.preventDefault()
          handleZoomReset()
        } else if (e.key === "p") {
          e.preventDefault()
          handlePrint()
        } else if (e.key === "s") {
          e.preventDefault()
          handleExportToPDF()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  // Render action buttons conditionally based on screen size
  const renderActionButtons = () => {
    const commonButtons = (
      <>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={toggleOrientation}
                className={`bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20 transition-all duration-200 ${isMobile ? "text-xs px-2" : ""
                  }`}
              >
                <RotateCw className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
                {isMobile && "Rotate"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Rotate Orientation</TooltipContent>
          </Tooltip>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={handlePrint}
                disabled={isPrinting}
                className={`bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20 transition-all duration-200 ${isMobile ? "text-xs px-2" : ""
                  }`}
              >
                {isPrinting ? (
                  <Loader2 className={isMobile ? "h-3 w-3 mr-1 animate-spin" : "h-4 w-4 animate-spin"} />
                ) : (
                  <Printer className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
                )}
                {isMobile && "Print"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print Resume</TooltipContent>
          </Tooltip>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size={isMobile ? "sm" : "icon"}
                onClick={handleExportToPDF}
                disabled={isExporting}
                className={`bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20 transition-all duration-200 ${isMobile ? "text-xs px-2" : ""
                  }`}
              >
                {isExporting ? (
                  <Loader2 className={isMobile ? "h-3 w-3 mr-1 animate-spin" : "h-4 w-4 animate-spin"} />
                ) : (
                  <Download className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
                )}
                {isMobile && "PDF"}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Export to PDF</TooltipContent>
          </Tooltip>
        </motion.div>
      </>
    )

    const extendedButtons = (
      <>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFullScreen}
                className="bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20 transition-all duration-200"
              >
                {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
          </Tooltip>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                disabled={isSharing}
                className="bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20 transition-all duration-200"
              >
                {isSharing ? <Loader2 className="h bered-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share Resume</TooltipContent>
          </Tooltip>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                disabled={isCopying}
                className="bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20 transition-all duration-200"
              >
                {isCopying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Link</TooltipContent>
          </Tooltip>
        </motion.div>
      </>
    )

    return (
      <div className="flex items-center gap-2">
        {commonButtons}
        {!isMobile && extendedButtons}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={`max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden bg-gray-900/95 backdrop-blur-xl border border-purple-400/30 ${isMobile ? "w-[95vw]" : ""
            }`}
        >
          <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-purple-400/30">
            <DialogTitle className={`text-purple-200 ${isMobile ? "text-sm" : ""}`}>
              Resume Preview
            </DialogTitle>
            <DialogDescription className="sr-only">Resume preview and actions</DialogDescription>
            {renderActionButtons()}
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 min-h-0">
            <div className="flex items-center justify-between border-b border-purple-400/30 px-4 py-2 bg-gray-800/80">
              <TabsList className="grid grid-cols-2 w-[200px] bg-gray-900/80 border border-purple-400/50 rounded-lg">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-purple-200"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-purple-200"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 50}
                        className="text-purple-200 hover:bg-purple-500/20"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom Out</TooltipContent>
                  </Tooltip>
                </motion.div>

                <span className="text-xs font-medium w-12 text-center text-purple-200">{zoomLevel}%</span>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 200}
                        className="text-purple-200 hover:bg-purple-500/20"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom In</TooltipContent>
                  </Tooltip>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleZoomReset}
                        className={`text-purple-200 hover:bg-purple-500/20 ${isMobile ? "hidden" : ""}`}
                      >
                        <span className="text-xs">Reset</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reset Zoom</TooltipContent>
                  </Tooltip>
                </motion.div>
              </div>
            </div>

            <TabsContent
              value="preview"
              className="flex-1 overflow-auto bg-gray-800/50 p-2 md:p-8 min-h-0 fancy-scrollbar"
            >
              <motion.div
                ref={previewContainerRef}
                className={`mx-auto bg-white shadow-lg rounded-lg transition-all duration-300 ease-in-out ${orientation === "landscape" ? "max-w-[1000px]" : "max-w-[800px]"
                  }`}
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: "top center",
                }}
                id="resume-preview-container"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ResumePreview resumeData={resumeData} template={template} />
              </motion.div>
            </TabsContent>

            <TabsContent
              value="settings"
              className="flex-1 overflow-auto bg-gray-800/50 p-4"
            >
              <motion.div
                className="bg-gray-900/80 rounded-lg p-6 shadow-lg max-w-lg mx-auto border border-purple-400/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold text-lg text-purple-200 mb-4">Preview Settings</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-sm text-gray-200 mb-2">Page Orientation</h4>
                    <div className="flex gap-2">
                      <Button
                        variant={orientation === "portrait" ? "default" : "outline"}
                        onClick={() => setOrientation("portrait")}
                        className={`flex-1 ${orientation === "portrait"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20"
                          }`}
                      >
                        Portrait
                      </Button>
                      <Button
                        variant={orientation === "landscape" ? "default" : "outline"}
                        onClick={() => setOrientation("landscape")}
                        className={`flex-1 ${orientation === "landscape"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                          : "bg-gray-800/80 border-purple-400/50 text-purple-200 hover:bg-purple-500/20"
                          }`}
                      >
                        Landscape
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm text-gray-200 mb-2">Zoom Level: {zoomLevel}%</h4>
                    <div className="flex items-center gap-4">
                      <ZoomOut className="h-4 w-4 text-gray-400" />
                      <Slider
                        value={[zoomLevel]}
                        min={50}
                        max={200}
                        step={5}
                        onValueChange={(values) => setZoomLevel(values[0])}
                        className="flex-1"
                      />
                      <ZoomIn className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-400/30">
                    <h4 className="font-medium text-sm text-gray-200 mb-2">Keyboard Shortcuts</h4>
                    <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-200">
                      <span className="text-gray-400">Zoom In:</span>
                      <span>Ctrl/⌘ + =</span>
                      <span className="text-gray-400">Zoom Out:</span>
                      <span>Ctrl/⌘ + -</span>
                      <span className="text-gray-400">Reset Zoom:</span>
                      <span>Ctrl/⌘ + 0</span>
                      <span className="text-gray-400">Print:</span>
                      <span>Ctrl/⌘ + P</span>
                      <span className="text-gray-400">Save as PDF:</span>
                      <span>Ctrl/⌘ + S</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}