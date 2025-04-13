import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface MinimalTemplateProps {
  resumeData: ResumeData
}

export function MinimalTemplate({ resumeData }: MinimalTemplateProps) {
  const { personalInfo, skills, experience, education, projects } = resumeData
  const customization = resumeData.customization || defaultCustomization

  const getSpacingClass = () => {
    switch (customization.spacing) {
      case "compact":
        return "space-y-3"
      case "relaxed":
        return "space-y-6"
      case "spacious":
        return "space-y-8"
      default:
        return "space-y-5"
    }
  }

  const getFontSizeClass = () => {
    switch (customization.fontSize) {
      case "small":
        return "text-sm"
      case "large":
        return "text-lg"
      default:
        return "text-base"
    }
  }

  return (
    <div
      className={`flex h-full flex-col ${getFontSizeClass()}`}
      style={{
        fontFamily: customization.fontFamily,
        color: "#333333",
      }}
    >
      {/* Header */}
      <header className="mb-6 text-center">
        <h1 className="mb-1 text-2xl font-bold" style={{ color: customization.primaryColor }}>
          {personalInfo.name}
        </h1>
        <h2 className="mb-3 text-lg font-medium text-gray-600">{personalInfo.title}</h2>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm text-gray-600">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {personalInfo.website && <div>{personalInfo.website}</div>}
        </div>
      </header>

      <div className={getSpacingClass()}>
        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h3
              className="mb-2 border-b border-gray-200 text-base font-semibold uppercase"
              style={{ color: customization.primaryColor }}
            >
              Profile
            </h3>
            <p className="leading-relaxed text-gray-600">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h3
              className="mb-3 border-b border-gray-200 text-base font-semibold uppercase"
              style={{ color: customization.primaryColor }}
            >
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold">{exp.position}</h4>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="mb-1 text-xs font-medium text-gray-600">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  {exp.description && <p className="mb-2 text-xs text-gray-600">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul
                      className={`ml-4 space-y-1 text-xs text-gray-600 ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
                    >
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h3
              className="mb-3 border-b border-gray-200 text-base font-semibold uppercase"
              style={{ color: customization.primaryColor }}
            >
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="mb-1 text-xs font-medium text-gray-600">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  {edu.description && <p className="text-xs text-gray-600">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3
              className="mb-3 border-b border-gray-200 text-base font-semibold uppercase"
              style={{ color: customization.primaryColor }}
            >
              Skills
            </h3>
            <div className="space-y-2">
              {skills.map((category, index) => (
                <div key={index} className="flex flex-wrap gap-x-1 text-xs">
                  <span className="font-medium text-gray-700">{category.name}:</span>
                  <span className="text-gray-600">{category.skills.map((skill) => skill.name).join(", ")}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h3
              className="mb-3 border-b border-gray-200 text-base font-semibold uppercase"
              style={{ color: customization.primaryColor }}
            >
              Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-semibold">{project.name}</h4>
                    {(project.startDate || project.endDate) && (
                      <span className="text-xs text-gray-500">
                        {project.startDate}
                        {project.endDate && ` - ${project.endDate}`}
                      </span>
                    )}
                  </div>
                  {project.technologies && (
                    <div className="mb-1 text-xs font-medium text-gray-600">{project.technologies}</div>
                  )}
                  {project.description && <p className="mb-2 text-xs text-gray-600">{project.description}</p>}
                  {project.achievements.length > 0 && (
                    <ul
                      className={`ml-4 space-y-1 text-xs text-gray-600 ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
                    >
                      {project.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
