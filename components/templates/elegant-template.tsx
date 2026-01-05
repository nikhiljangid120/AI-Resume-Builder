import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface ElegantTemplateProps {
  resumeData: ResumeData
}

export function ElegantTemplate({ resumeData }: ElegantTemplateProps) {
  const { personalInfo, skills, experience, education, projects } = resumeData
  const customization = resumeData.customization || defaultCustomization

  return (
    <div
      className="flex h-full flex-col text-base"
      style={{
        fontFamily: customization.fontFamily.includes("serif") ? customization.fontFamily : "Georgia, serif",
        color: "#1a1a1a",
      }}
    >
      {/* Header */}
      <header className="mb-8 text-center border-b pb-6" style={{ borderColor: customization.primaryColor }}>
        <h1 className="mb-2 text-4xl font-serif tracking-wide" style={{ color: customization.primaryColor }}>
          {personalInfo.name}
        </h1>
        <h2 className="mb-4 text-xl font-light italic text-gray-600">{personalInfo.title}</h2>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {customization.sectionOrder.map((section) => renderSection(section))}
    </div>
    </div >
  )
}
    </div >
  )
}