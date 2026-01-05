import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"
import { useState, useEffect } from "react"

interface MinimalTemplateProps {
  resumeData: ResumeData
}

export function MinimalTemplate({ resumeData }: MinimalTemplateProps) {
  const { personalInfo, skills, experience, education, projects } = resumeData
  const customization = resumeData.customization || defaultCustomization
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const getSpacingClass = () => {
    switch (customization.spacing) {
      case "very-compact": return "space-y-2"
      case "compact": return "space-y-3"
      case "relaxed": return "space-y-5"
      case "spacious": return "space-y-7"
      case "very-spacious": return "space-y-9"
      default: return "space-y-4"
    }
  }

  const getFontSizeClass = () => {
    switch (customization.fontSize) {
      case "xs": return "text-xs"
      case "small": return "text-sm"
      case "large": return "text-lg"
      case "xl": return "text-xl"
      default: return "text-base"
    }
  }

  const renderSection = (section: string) => {
    switch (section) {
      case "personalInfo":
        return personalInfo.summary && (
          <section key="personalInfo">
            <h3 className="text-lg font-semibold mb-2" style={{ color: customization.primaryColor }}>
              Profile
            </h3>
            <p className="text-gray-600 leading-relaxed">{personalInfo.summary}</p>
          </section>
        )
      case "experience":
        return experience.length > 0 && (
          <section key="experience">
            <h3 className="text-lg font-semibold mb-2" style={{ color: customization.primaryColor }}>
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{exp.position}</h4>
                    <span className="text-xs text-gray-500">{exp.startDate} - {exp.endDate}</span>
                  </div>
                  <div className="text-xs font-medium text-gray-600 mb-2">
                    {exp.company}{exp.location && `, ${exp.location}`}
                  </div>
                  {exp.description && <p className="text-xs text-gray-600 mb-2">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul className={`ml-4 space-y-1 text-xs ${customization.showBulletPoints ? "list-disc" : "list-none"}`}>
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      case "education":
        return education.length > 0 && (
          <section key="education">
            <h3 className="text-lg font-semibold mb-2" style={{ color: customization.primaryColor }}>
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold">
                      {edu.degree}{edu.field && ` in ${edu.field}`}
                    </h4>
                    <span className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</span>
                  </div>
                  <div className="text-xs font-medium text-gray-600">
                    {edu.institution}{edu.location && `, ${edu.location}`}
                  </div>
                  {edu.description && <p className="text-xs text-gray-600">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )
      case "skills":
        return skills.length > 0 && (
          <section key="skills">
            <h3 className="text-lg font-semibold mb-2" style={{ color: customization.primaryColor }}>
              Skills
            </h3>
            <div className="space-y-2">
              {skills.map((category, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{category.name}: </span>
                  <span>{category.skills.map(skill => skill.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )
      case "projects":
        return projects.length > 0 && (
          <section key="projects">
            <h3 className="text-lg font-semibold mb-2" style={{ color: customization.primaryColor }}>
              Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-1">
                    <h4 className="text-sm font-semibold">{project.name}</h4>
                    <span className="text-xs text-gray-500">
                      {project.startDate}{project.endDate && ` - ${project.endDate}`}
                    </span>
                  </div>
                  {project.technologies && (
                    <div className="text-xs font-medium text-gray-600 mb-2">{project.technologies}</div>
                  )}
                  {project.description && <p className="text-xs text-gray-600">{project.description}</p>}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                      style={{ color: customization.primaryColor }}
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={`min-h-screen bg-white p-4 sm:p-6 md:p-8 print:p-0 mx-auto max-w-3xl ${getFontSizeClass()} transition-all duration-300`}
      style={{ fontFamily: customization.fontFamily, color: "#1F2937" }}
    >
      {/* Header */}
      <header className="mb-6 border-b border-gray-200 pb-4 print:border-none">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight"
          style={{ color: customization.primaryColor }}
        >
          {personalInfo.name}
        </h1>
        <h2 className="text-lg sm:text-xl font-medium mb-3 text-gray-600">
          {personalInfo.title}
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.website && (
            <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">{personalInfo.website}</a>
          )}
        </div>
      </header>

      <div className={getSpacingClass()}>
        {customization.sectionOrder.map((section) => renderSection(section))}
      </div>

      <style jsx>{`
        @media print {
          .border-b {
            border-bottom: none !important;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
      `}</style>
    </div>
  )
}