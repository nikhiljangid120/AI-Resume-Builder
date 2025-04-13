import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface TechTemplateProps {
  resumeData: ResumeData
}

export function TechTemplate({ resumeData }: TechTemplateProps) {
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
      <header className="mb-6 flex flex-col rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="mb-1 text-3xl font-bold" style={{ color: customization.primaryColor }}>
              {personalInfo.name}
            </h1>
            <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300">{personalInfo.title}</h2>
          </div>
          <div className="flex flex-col gap-1 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {personalInfo.location}
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                {personalInfo.website}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mt-4">
            <p className="leading-relaxed text-gray-700 dark:text-gray-300">{personalInfo.summary}</p>
          </div>
        )}
      </header>

      <div className={getSpacingClass()}>
        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <h3
              className="mb-4 inline-block border-b-2 pb-1 text-lg font-bold"
              style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}
            >
              Technical Skills
            </h3>
            <div className="space-y-3">
              {skills.map((category, index) => (
                <div key={index}>
                  <h4 className="mb-2 text-sm font-semibold">{category.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-full px-3 py-1 text-sm"
                        style={{
                          backgroundColor: `${customization.primaryColor}20`,
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
            <h3
              className="mb-4 inline-block border-b-2 pb-1 text-lg font-bold"
              style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}
            >
              Work Experience
            </h3>
            <div className="space-y-5">
              {experience.map((exp, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-base font-bold">{exp.position}</h4>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: `${customization.primaryColor}20`,
                        color: customization.primaryColor,
                      }}
                    >
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="mb-2 text-sm font-medium">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                  )}
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

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h3
              className="mb-4 inline-block border-b-2 pb-1 text-lg font-bold"
              style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}
            >
              Projects
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.map((project, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2">
                    <h4 className="text-base font-bold">{project.name}</h4>
                    {project.technologies && (
                      <div className="mt-1 text-xs font-medium" style={{ color: customization.primaryColor }}>
                        {project.technologies}
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{project.description}</p>
                  )}
                  {project.achievements.length > 0 && project.achievements[0] && (
                    <div className="mt-2">
                      <span className="text-xs font-medium">Key features:</span>
                      <ul
                        className={`ml-5 mt-1 space-y-1 text-sm ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
                      >
                        {project.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-medium hover:underline"
                      style={{ color: customization.primaryColor }}
                    >
                      View Project →
                    </a>
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
              className="mb-4 inline-block border-b-2 pb-1 text-lg font-bold"
              style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}
            >
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h4 className="text-base font-bold">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h4>
                    <div className="text-sm">
                      {edu.institution}
                      {edu.location && `, ${edu.location}`}
                    </div>
                  </div>
                  <div className="mt-1 text-sm font-medium sm:mt-0">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
