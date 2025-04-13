import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface ExecutiveTemplateProps {
  resumeData: ResumeData
}

export function ExecutiveTemplate({ resumeData }: ExecutiveTemplateProps) {
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
        <h1 className="mb-1 text-3xl font-bold uppercase tracking-wide" style={{ color: customization.primaryColor }}>
          {personalInfo.name}
        </h1>
        <h2 className="mb-3 text-xl font-medium">{personalInfo.title}</h2>

        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
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
          <h3 className="mb-3 text-lg font-bold uppercase tracking-wide" style={{ color: customization.primaryColor }}>
            Executive Summary
          </h3>
          <p className="leading-relaxed">{personalInfo.summary}</p>
        </section>
      )}

      <div className={getSpacingClass()}>
        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h3
              className="mb-4 text-lg font-bold uppercase tracking-wide"
              style={{ color: customization.primaryColor }}
            >
              Professional Experience
            </h3>
            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-bold">{exp.position}</h4>
                    <span className="text-sm font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="mb-2 text-sm font-semibold">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  {exp.description && <p className="mb-2 text-sm">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul
                      className={`ml-5 space-y-1 text-sm ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
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

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3
              className="mb-4 text-lg font-bold uppercase tracking-wide"
              style={{ color: customization.primaryColor }}
            >
              Areas of Expertise
            </h3>
            <div className="space-y-3">
              {skills.map((category, index) => (
                <div key={index}>
                  <h4 className="mb-2 text-sm font-semibold">{category.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-md px-2 py-1 text-sm"
                        style={{
                          backgroundColor: `${customization.secondaryColor}40`,
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

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h3
              className="mb-4 text-lg font-bold uppercase tracking-wide"
              style={{ color: customization.primaryColor }}
            >
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-bold">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h4>
                    <span className="text-sm font-medium">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  {edu.description && <p className="mt-1 text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h3
              className="mb-4 text-lg font-bold uppercase tracking-wide"
              style={{ color: customization.primaryColor }}
            >
              Key Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-bold">{project.name}</h4>
                    {(project.startDate || project.endDate) && (
                      <span className="text-sm font-medium">
                        {project.startDate}
                        {project.endDate && ` - ${project.endDate}`}
                      </span>
                    )}
                  </div>
                  {project.technologies && <div className="mb-1 text-sm font-medium">{project.technologies}</div>}
                  {project.description && <p className="mb-2 text-sm">{project.description}</p>}
                  {project.achievements.length > 0 && (
                    <ul
                      className={`ml-5 space-y-1 text-sm ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
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
