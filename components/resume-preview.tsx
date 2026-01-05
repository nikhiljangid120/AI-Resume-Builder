import { ElegantTemplate } from "./templates/elegant-template"
import { ProfessionalTemplate } from "./templates/professional-template"
import { AcademicTemplate } from "./templates/academic-template"
import { DesignerTemplate } from "./templates/designer-template"

// ... imports remain the same

export function ResumePreview({ resumeData, template }: ResumePreviewProps) {
  // Ensure customization exists
  const resumeDataWithCustomization = {
    ...resumeData,
    customization: resumeData.customization || defaultCustomization,
  }

  // Update the renderTemplate function to include our new template
  const renderTemplate = () => {
    switch (template.id) {
      case "modern":
        return <ModernTemplate resumeData={resumeDataWithCustomization} />
      case "minimal":
        return <MinimalTemplate resumeData={resumeDataWithCustomization} />
      case "ats-optimized":
        return <ATSOptimizedTemplate resumeData={resumeDataWithCustomization} />
      case "creative":
        return <CreativeTemplate resumeData={resumeDataWithCustomization} />
      case "executive":
        return <ExecutiveTemplate resumeData={resumeDataWithCustomization} />
      case "tech":
        return <TechTemplate resumeData={resumeDataWithCustomization} />
      case "elegant":
        return <ElegantTemplate resumeData={resumeDataWithCustomization} />
      case "professional":
        return <ProfessionalTemplate resumeData={resumeDataWithCustomization} />
      case "academic":
        return <AcademicTemplate resumeData={resumeDataWithCustomization} />
      case "designer":
        return <DesignerTemplate resumeData={resumeDataWithCustomization} />
      default:
        return <ModernTemplate resumeData={resumeDataWithCustomization} />
    }
  }

  return (
    <div id="resume-preview-container" className="h-[842px] w-full overflow-auto bg-white p-8 text-black">
      {renderTemplate()}
    </div>
  )
}
