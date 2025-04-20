"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useMediaQuery } from "@/hooks/use-media-query"

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
  
  // Responsive layout detection
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
    setZoomLevel(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50))
  }

  const handleZoomReset = () => {
    setZoomLevel(100)
  }

  // Toggle orientation
  const toggleOrientation = () => {
    setOrientation(prev => prev === "portrait" ? "landscape" : "portrait")
  }

  // Handle PDF export
  const handleExportToPDF = async () => {
    setIsExporting(true)
    try {
      await exportResumeToPDF(resumeData, template, orientation)
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

  // Share resume (using Web Share API if available)
  const handleShare = async () => {
    setIsSharing(true)
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${resumeData.personalInfo.name || "Resume"}`,
          text: "Check out my resume!",
          // This would be a URL to a shareable version of the resume
          url: window.location.href,
        })
        toast({
          title: "Shared Successfully",
          description: "Your resume link has been shared!",
          variant: "success",
        })
      } else {
        // Fallback if Web Share API is not available
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link Copied",
          description: "Resume link copied to clipboard. You can now share it manually.",
          variant: "success",
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
        variant: "success",
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
      // Create a new window for printing
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        throw new Error("Unable to open print window. Please check your browser settings.")
      }

      // Get the resume preview element
      const resumeElement = document.getElementById("resume-preview-container")
      if (!resumeElement) {
        throw new Error("Resume preview element not found.")
      }

      // Write the HTML to the new window with improved styling and loading
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
             // Wait for all content and styles to load
             window.onload = function() {
               // Check if resume content has loaded properly
               const resumeContent = document.getElementById('print-container');
               const loadingIndicator = document.getElementById('loading-indicator');
               
               if (resumeContent && resumeContent.children.length > 0) {
                 // Give extra time for fonts and styles to render fully
                 setTimeout(function() {
                   // Hide loading indicator
                   loadingIndicator.style.display = 'none';
                   // Trigger print dialog
                   window.print();
                   // Close window after print dialog closes or is canceled
                   setTimeout(() => window.close(), 1000);
                 }, 1000);
               } else {
                 // Show error if content didn't load properly
                 loadingIndicator.innerHTML = '<p style="color: red;">Error loading resume content. Please try again.</p>';
                 setTimeout(() => window.close(), 3000);
               }
             };
           </script>
         </body>
       </html>
     `)

      printWindow.document.close()

      // Handle errors that might occur after window creation
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
      localStorage.setItem("resume-preview-preferences", JSON.stringify({
        zoomLevel,
        orientation,
        activeTab
      }))
    }
  }, [zoomLevel, orientation, activeTab])

  // Load saved preferences on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedPreferences = localStorage.getItem("resume-preview-preferences")
        if (savedPreferences) {
          const { zoomLevel: savedZoom, orientation: savedOrientation, activeTab: savedTab } = JSON.parse(savedPreferences)
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
    // Common buttons for all screen sizes
    const commonButtons = (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              onClick={toggleOrientation}
              className={isMobile ? "text-xs px-2" : ""}
            >
              <RotateCw className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
              {!isMobile ? null : "Rotate"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rotate Orientation</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              onClick={handlePrint}
              disabled={isPrinting}
              className={isMobile ? "text-xs px-2" : ""}
            >
              {isPrinting ? (
                <Loader2 className={isMobile ? "h-3 w-3 mr-1 animate-spin" : "h-4 w-4 animate-spin"} />
              ) : (
                <Printer className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
              )}
              {!isMobile ? null : "Print"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print Resume</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size={isMobile ? "sm" : "icon"}
              onClick={handleExportToPDF}
              disabled={isExporting}
              className={isMobile ? "text-xs px-2" : ""}
            >
              {isExporting ? (
                <Loader2 className={isMobile ? "h-3 w-3 mr-1 animate-spin" : "h-4 w-4 animate-spin"} />
              ) : (
                <Download className={isMobile ? "h-3 w-3 mr-1" : "h-4 w-4"} />
              )}
              {!isMobile ? null : "PDF"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Export to PDF</TooltipContent>
        </Tooltip>
      </>
    )

    // Additional buttons for tablet and desktop
    const extendedButtons = (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={toggleFullScreen}>
              {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isFullScreen ? "Exit Fullscreen" : "Fullscreen"}</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleShare} disabled={isSharing}>
              {isSharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share Resume</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleCopyLink} disabled={isCopying}>
              {isCopying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy Link</TooltipContent>
        </Tooltip>
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden ${isMobile ? "w-[95vw]" : ""}`}>
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
          <DialogTitle className={isMobile ? "text-sm" : ""}>Resume Preview</DialogTitle>
          {renderActionButtons()}
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1">
          <div className="flex items-center justify-between border-b px-4 py-2 bg-gray-50">
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 50}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom Out</TooltipContent>
              </Tooltip>
              
              <span className="text-xs font-medium w-12 text-center">{zoomLevel}%</span>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 200}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Zoom In</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleZoomReset} 
                    className={isMobile ? "hidden" : ""}>
                    <span className="text-xs">Reset</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Reset Zoom</TooltipContent>
              </Tooltip>
            </div>
          </div>
            
          <TabsContent value="preview" className="flex-1 overflow-auto bg-gray-100 p-2 md:p-8">
            <div 
              ref={previewContainerRef}
              className={`mx-auto bg-white shadow-lg transition-all duration-300 ease-in-out ${
                orientation === "landscape" ? "max-w-[1000px]" : "max-w-[800px]"
              }`}
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transformOrigin: 'top center'
              }}
              id="resume-preview-container"
            >
              <ResumePreview 
                resumeData={resumeData} 
                template={template} 
                orientation={orientation} 
              />
            </div>
          </TabsContent>
            
          <TabsContent value="settings" className="flex-1 overflow-auto bg-gray-100 p-4">
            <div className="bg-white rounded-lg p-6 shadow-md max-w-lg mx-auto">
              <h3 className="font-semibold text-lg mb-4">Preview Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-sm mb-2">Page Orientation</h4>
                  <div className="flex gap-2">
                    <Button 
                      variant={orientation === "portrait" ? "default" : "outline"}
                      onClick={() => setOrientation("portrait")}
                      className="flex-1"
                    >
                      Portrait
                    </Button>
                    <Button 
                      variant={orientation === "landscape" ? "default" : "outline"}
                      onClick={() => setOrientation("landscape")}
                      className="flex-1"
                    >
                      Landscape
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Zoom Level: {zoomLevel}%</h4>
                  <div className="flex items-center gap-4">
                    <ZoomOut className="h-4 w-4 text-gray-500" />
                    <Slider
                      value={[zoomLevel]}
                      min={50}
                      max={200}
                      step={5}
                      onValueChange={(values) => setZoomLevel(values[0])}
                      className="flex-1"
                    />
                    <ZoomIn className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-sm mb-2">Keyboard Shortcuts</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-600">Zoom In:</span>
                    <span>Ctrl/⌘ + =</span>
                    <span className="text-gray-600">Zoom Out:</span>
                    <span>Ctrl/⌘ + -</span>
                    <span className="text-gray-600">Reset Zoom:</span>
                    <span>Ctrl/⌘ + 0</span>
                    <span className="text-gray-600">Print:</span>
                    <span>Ctrl/⌘ + P</span>
                    <span className="text-gray-600">Save as PDF:</span>
                    <span>Ctrl/⌘ + S</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}