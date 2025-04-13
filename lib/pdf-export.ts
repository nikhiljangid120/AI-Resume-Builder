import type { ResumeData, Template } from "./types"

export async function exportResumeToPDF(resumeData: ResumeData, template: Template): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Dynamically import html2canvas and jsPDF to avoid SSR issues
      Promise.all([import("html2canvas"), import("jspdf")])
        .then(([html2canvasModule, jsPDFModule]) => {
          const html2canvas = html2canvasModule.default
          const jsPDF = jsPDFModule.default

          // Wait for the next render cycle to ensure the DOM is updated
          setTimeout(async () => {
            const resumeElement = document.getElementById("resume-preview-container")

            if (!resumeElement) {
              reject(new Error("Resume preview element not found"))
              return
            }

            try {
              // Create a canvas from the resume element
              const canvas = await html2canvas(resumeElement, {
                scale: 2, // Higher scale for better quality
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
              })

              // Calculate dimensions (A4 size)
              const imgWidth = 210 // A4 width in mm
              const imgHeight = (canvas.height * imgWidth) / canvas.width

              // Create PDF
              const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
              })

              // Add the canvas as an image
              const imgData = canvas.toDataURL("image/png")
              pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

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
        .catch((error) => {
          console.error("Error loading PDF libraries:", error)
          reject(error)
        })
    } catch (error) {
      console.error("Error exporting PDF:", error)
      reject(error)
    }
  })
}
