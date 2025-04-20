import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface ModernTemplateProps {
  resumeData: ResumeData
}

export function ModernTemplate({ resumeData }: ModernTemplateProps) {
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
      <header className="mb-6 border-b-2 pb-4" style={{ borderColor: customization.primaryColor }}>
        <h1 className="mb-1 text-3xl font-bold" style={{ color: customization.primaryColor }}>
          {personalInfo.name}
        </h1>
        <h2 className="mb-3 text-xl font-medium">{personalInfo.title}</h2>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Email:</span> {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Phone:</span> {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Location:</span> {personalInfo.location}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Website:</span> {personalInfo.website}
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-6">
          <h3 className="mb-2 text-lg font-bold" style={{ color: customization.primaryColor }}>
            Professional Summary
          </h3>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      <div className={getSpacingClass()}>
        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3 className="mb-2 text-lg font-bold" style={{ color: customization.primaryColor }}>
              Skills
            </h3>
            <div className="space-y-2">
              {skills.map((category, index) => (
                <div key={index}>
                  <h4 className="mb-1 text-sm font-semibold" style={{ color: customization.primaryColor }}>
                    {category.name}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{
                          backgroundColor: `${customization.primaryColor}15`,
                          color: customization.primaryColor,
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h3 className="mb-2 text-lg font-bold" style={{ color: customization.primaryColor }}>
              Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 pl-4" style={{ borderColor: `${customization.primaryColor}40` }}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-semibold">{exp.position}</h4>
                    <span className="text-xs font-medium" style={{ color: customization.primaryColor }}>
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="mb-1 text-sm font-medium">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  {exp.description && <p className="mb-2 text-sm">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul
                      className={`ml-4 space-y-1 text-sm ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
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
            <h3 className="mb-2 text-lg font-bold" style={{ color: customization.primaryColor }}>
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="border-l-2 pl-4" style={{ borderColor: `${customization.primaryColor}40` }}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-semibold">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h4>
                    <span className="text-xs font-medium" style={{ color: customization.primaryColor }}>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="mb-1 text-sm font-medium">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  {edu.description && <p className="text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h3 className="mb-2 text-lg font-bold" style={{ color: customization.primaryColor }}>
              Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index} className="border-l-2 pl-4" style={{ borderColor: `${customization.primaryColor}40` }}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-semibold">{project.name}</h4>
                    {(project.startDate || project.endDate) && (
                      <span className="text-xs font-medium" style={{ color: customization.primaryColor }}>
                        {project.startDate}
                        {project.endDate && ` - ${project.endDate}`}
                      </span>
                    )}
                  </div>
                  {project.technologies && (
                    <div className="mb-1 text-sm font-medium" style={{ color: customization.primaryColor }}>
                      {project.technologies}
                    </div>
                  )}
                  {project.description && <p className="mb-2 text-sm">{project.description}</p>}
                  {project.achievements.length > 0 && (
                    <ul
                      className={`ml-4 space-y-1 text-sm ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
                    >
                      {project.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-medium hover:underline"
                      style={{ color: customization.primaryColor }}
                    >
                      View Project
                    </a>
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
