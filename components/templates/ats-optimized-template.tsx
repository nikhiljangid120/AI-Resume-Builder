import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface ATSOptimizedTemplateProps {
  resumeData: ResumeData
}

export function ATSOptimizedTemplate({ resumeData }: ATSOptimizedTemplateProps) {
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

  const renderSection = (section: string) => {
    switch (section) {
      case "personalInfo":
        return personalInfo.summary && (
          <section key="personalInfo">
            <h3 className="mb-2 text-lg font-bold">Professional Summary</h3>
            <p className="text-sm">{personalInfo.summary}</p>
          </section>
        )
      case "skills":
        return skills.length > 0 && (
          <section key="skills">
            <h3 className="mb-2 text-lg font-bold">Skills</h3>
            <div className="space-y-2">
              {skills.map((category, index) => (
                <div key={index}>
                  <h4 className="mb-1 text-sm font-bold">{category.name}</h4>
                  <p className="text-sm">{category.skills.map((skill) => skill.name).join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        )
      case "experience":
        return experience.length > 0 && (
          <section key="experience">
            <h3 className="mb-2 text-lg font-bold">Professional Experience</h3>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index}>
                  <h4 className="text-base font-bold">{exp.position}</h4>
                  <p className="mb-1 text-sm font-medium">
                    {exp.company}, {exp.location} | {exp.startDate} - {exp.endDate}
                  </p>
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
        )
      case "education":
        return education.length > 0 && (
          <section key="education">
            <h3 className="mb-2 text-lg font-bold">Education</h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <h4 className="text-base font-bold">
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </h4>
                  <p className="mb-1 text-sm font-medium">
                    {edu.institution}, {edu.location} | {edu.startDate} - {edu.endDate}
                  </p>
                  {edu.description && <p className="text-sm">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )
      case "projects":
        return projects.length > 0 && (
          <section key="projects">
            <h3 className="mb-2 text-lg font-bold">Projects</h3>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <h4 className="text-base font-bold">{project.name}</h4>
                  {(project.startDate || project.endDate) && (
                    <p className="mb-1 text-sm font-medium">
                      {project.startDate}
                      {project.endDate && ` - ${project.endDate}`}
                    </p>
                  )}
                  {project.technologies && <p className="mb-1 text-sm">Technologies: {project.technologies}</p>}
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
                  {project.link && <p className="text-sm">Link: {project.link}</p>}
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
      className={`flex h-full flex-col ${getFontSizeClass()}`}
      style={{
        fontFamily: customization.fontFamily,
        color: "#000000",
      }}
    >
      {/* Header - Simple and clear for ATS */}
      <header className="mb-6">
        <h1 className="mb-1 text-2xl font-bold">{personalInfo.name}</h1>
        <h2 className="mb-3 text-lg font-medium">{personalInfo.title}</h2>

        <div className="space-y-1 text-sm">
          {personalInfo.email && <div>Email: {personalInfo.email}</div>}
          {personalInfo.phone && <div>Phone: {personalInfo.phone}</div>}
          {personalInfo.location && <div>Location: {personalInfo.location}</div>}
          {personalInfo.website && <div>Website: {personalInfo.website}</div>}
        </div>
      </header>

      <div className={getSpacingClass()}>
        {customization.sectionOrder.map((section) => renderSection(section))}
      </div>
    </div>
  )
}
