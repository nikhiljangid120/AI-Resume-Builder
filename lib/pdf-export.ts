import type { ResumeData, Template } from "./types"

export async function exportResumeToPDF(resumeData: ResumeData, template: Template, orientation: "portrait" | "landscape" = "portrait"): Promise<string> {
  try {
    // Dynamically import html2canvas and jsPDF to avoid SSR issues
    const [html2canvasModule, jsPDFModule] = await Promise.all([import("html2canvas"), import("jspdf")])

    const html2canvas = html2canvasModule.default
    const jsPDF = jsPDFModule.default

    // Wait for the next render cycle to ensure the DOM is updated
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const resumeElement = document.getElementById("resume-preview-container")

        if (!resumeElement) {
          reject(new Error("Resume preview element not found"))
          return
        }

        try {
          // Create a canvas from the resume element with improved settings
          const canvas = await html2canvas(resumeElement, {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            logging: false,
            backgroundColor: "#ffffff",
            allowTaint: true,
            windowWidth: 800, // Fixed width to ensure consistent rendering
            windowHeight: 1131, // A4 height ratio
            onclone: (clonedDoc) => {
              // Apply specific styles to the cloned document for better PDF rendering
              const clonedElement = clonedDoc.getElementById("resume-preview-container")
              if (clonedElement) {
                clonedElement.style.width = "800px"
                clonedElement.style.height = "auto"
                clonedElement.style.overflow = "hidden"
                clonedElement.style.position = "relative"
                clonedElement.style.pageBreakInside = "avoid"
              }
            },
          })

          // Calculate dimensions (A4 size)
          const imgWidth = 210 // A4 width in mm
          const pageHeight = 297 // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width

          // Create PDF with proper orientation
          const pdf = new jsPDF({
            orientation: orientation,
            unit: "mm",
            format: "a4",
          })

          // Add the canvas as an image
          const imgData = canvas.toDataURL("image/jpeg", 1.0)
          pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight, undefined, "FAST")

          // Save the PDF
          const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, "_")}_Resume.pdf`
          pdf.save(fileName)

          resolve(fileName)
        } catch (error) {
          console.error("Error creating PDF:", error)
          reject(error)
        }
      }, 500)
    })
  } catch (error) {
    console.error("Error exporting PDF:", error)
    throw error
  }
}
