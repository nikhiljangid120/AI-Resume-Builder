import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface CreativeTemplateProps {
  resumeData: ResumeData
}

export function CreativeTemplate({ resumeData }: CreativeTemplateProps) {
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
          <section key="personalInfo" className="mb-8">
            <h3 className="mb-3 text-xl font-bold" style={{ color: customization.primaryColor }}>
              About Me
            </h3>
            <p className="leading-relaxed">{personalInfo.summary}</p>
          </section>
        )
      case "experience":
        return experience.length > 0 && (
          <section key="experience">
            <h3 className="mb-4 text-xl font-bold" style={{ color: customization.primaryColor }}>
              Experience
            </h3>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className="relative border-l-2 pl-6"
                  style={{ borderColor: `${customization.primaryColor}30` }}
                >
                  <div
                    className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full"
                    style={{ backgroundColor: customization.primaryColor }}
                  ></div>
                  <div className="mb-1">
                    <h4 className="text-base font-bold">{exp.position}</h4>
                    <p className="text-sm font-medium" style={{ color: customization.primaryColor }}>
                      {exp.company} | {exp.startDate} - {exp.endDate}
                    </p>
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
        )
      case "projects":
        return projects.length > 0 && (
          <section key="projects">
            <h3 className="mb-4 text-xl font-bold" style={{ color: customization.primaryColor }}>
              Projects
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4"
                  style={{ backgroundColor: `${customization.primaryColor}10` }}
                >
                  <h4 className="mb-1 text-base font-bold">{project.name}</h4>
                  {project.technologies && (
                    <p className="mb-2 text-xs font-medium" style={{ color: customization.primaryColor }}>
                      {project.technologies}
                    </p>
                  )}
                  {project.description && <p className="mb-2 text-sm">{project.description}</p>}
                  {project.achievements.length > 0 && project.achievements[0] && (
                    <p className="text-sm italic">
                      <span className="font-medium">Key feature:</span> {project.achievements[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
      default:
        // Skills and Education are in the sidebar, so we don't render them here
        return null
    }
  }

  return (
    <div
      className={`grid h-full grid-cols-3 gap-6 ${getFontSizeClass()}`}
      style={{
        fontFamily: customization.fontFamily,
        color: "#333333",
      }}
    >
      {/* Sidebar */}
      <div className="col-span-1 p-6 text-white" style={{ backgroundColor: customization.primaryColor }}>
        <div className="mb-8 text-center">
          <h1 className="mb-1 text-2xl font-bold">{personalInfo.name}</h1>
          <h2 className="text-sm font-medium opacity-80">{personalInfo.title}</h2>
        </div>

        <div className="mb-8 space-y-4">
          {personalInfo.email && (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-1 w-1 rounded-full bg-white opacity-70"></div>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-1 w-1 rounded-full bg-white opacity-70"></div>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-1 w-1 rounded-full bg-white opacity-70"></div>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-1 w-1 rounded-full bg-white opacity-70"></div>
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-4 border-b border-white border-opacity-20 pb-2 text-lg font-bold">Skills</h3>
            <div className="space-y-4">
              {skills.map((category, index) => (
                <div key={index}>
                  <h4 className="mb-2 text-sm font-semibold opacity-80">{category.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-full px-2 py-1 text-xs"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h3 className="mb-4 border-b border-white border-opacity-20 pb-2 text-lg font-bold">Education</h3>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <h4 className="text-sm font-semibold">{edu.degree}</h4>
                  <p className="text-xs opacity-80">{edu.institution}</p>
                  <p className="text-xs opacity-70">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="col-span-2 p-6">
        <div className={getSpacingClass()}>
          {customization.sectionOrder?.map((section) => renderSection(section))}
        </div>
      </div>
    </div>
  )
}
