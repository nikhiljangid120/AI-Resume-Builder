import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface GradientTemplateProps {
  resumeData: ResumeData
}

export function ElegantTemplate({ resumeData }: GradientTemplateProps) {
  const { personalInfo, skills, experience, education, projects } = resumeData
  const customization = resumeData.customization || defaultCustomization

  const getSpacingClass = () => {
    switch (customization.spacing) {
      case "very-compact": return "space-y-2"
      case "compact": return "space-y-4"
      case "relaxed": return "space-y-6"
      case "spacious": return "space-y-8"
      case "very-spacious": return "space-y-10"
      default: return "space-y-5"
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

  const gradientStyle = {
    background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}40)`,
  }

  return (
    <div
      className={`min-h-screen bg-white p-4 sm:p-8 md:p-12 print:p-0 mx-auto max-w-4xl shadow-lg print:shadow-none ${getFontSizeClass()} transition-all duration-300`}
      style={{
        fontFamily: customization.fontFamily,
        color: "#333333",
      }}
    >
      {/* Header */}
      <header 
        className="mb-8 rounded-xl p-6 sm:p-8 transform hover:scale-[1.01] transition-transform duration-300 print:transform-none" 
        style={gradientStyle}
      >
        <h1 
          className="text-3xl sm:text-4xl font-bold mb-2 tracking-tight" 
          style={{ color: customization.primaryColor }}
        >
          {personalInfo.name}
        </h1>
        <h2 className="text-xl sm:text-2xl font-medium mb-4 text-gray-700">
          {personalInfo.title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {personalInfo.email && (
            <div className="flex items-center gap-2 hover:text-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 hover:text-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2 hover:text-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 hover:text-gray-800 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">{personalInfo.website}</a>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-8">
          <h3
            className="text-xl font-bold mb-3 relative inline-block"
            style={{
              color: customization.primaryColor,
              borderBottom:
                customization.headerStyle === "underlined" ? `2px solid ${customization.primaryColor}` : "none",
              padding: customization.headerStyle === "boxed" ? "0.5rem 1rem" : "0",
              background: customization.headerStyle === "boxed" ? `${customization.primaryColor}10` : "none",
              borderRadius: customization.headerStyle === "boxed" ? "0.5rem" : "0",
            }}
          >
            Professional Summary
            <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gray-200 print:bg-transparent" />
          </h3>
          <p className="leading-relaxed text-gray-700">{personalInfo.summary}</p>
        </section>
      )}

      <div className={getSpacingClass()}>
        {/* Skills */}
        {skills.length > 0 && (
          <section className={`transition-all duration-300 ${customization.sectionStyle === "bordered" ? "border border-gray-200 rounded-xl p-6" : ""}`}>
            <h3
              className="text-xl font-bold mb-4 relative inline-block"
              style={{
                color: customization.primaryColor,
                borderBottom:
                  customization.headerStyle === "underlined" ? `2px solid ${customization.primaryColor}` : "none",
                padding: customization.headerStyle === "boxed" ? "0.5rem 1rem" : "0",
                background: customization.headerStyle === "boxed" ? `${customization.primaryColor}10` : "none",
                borderRadius: customization.headerStyle === "boxed" ? "0.5rem" : "0",
                fontWeight: customization.headerStyle === "bold" ? "800" : "700",
              }}
            >
              Skills
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gray-200 print:bg-transparent" />
            </h3>
            <div className="space-y-4">
              {skills.map((category, index) => (
                <div key={index}>
                  <h4 className="text-sm font-semibold mb-2" style={{ color: customization.primaryColor }}>
                    {category.name}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="rounded-full px-3 py-1 text-xs font-medium transform hover:scale-105 transition-transform duration-200"
                        style={{
                          background: `linear-gradient(135deg, ${customization.primaryColor}20, ${customization.secondaryColor}40)`,
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
          <section className={`transition-all duration-300 ${customization.sectionStyle === "bordered" ? "border border-gray-200 rounded-xl p-6" : ""}`}>
            <h3
              className="text-xl font-bold mb-4 relative inline-block"
              style={{
                color: customization.primaryColor,
                borderBottom:
                  customization.headerStyle === "underlined" ? `2px solid ${customization.primaryColor}` : "none",
                padding: customization.headerStyle === "boxed" ? "0.5rem 1rem" : "0",
                background: customization.headerStyle === "boxed" ? `${customization.primaryColor}10` : "none",
                borderRadius: customization.headerStyle === "boxed" ? "0.5rem" : "0",
              }}
            >
              Experience
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gray-200 print:bg-transparent" />
            </h3>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div
                  key={index}
                  className={`transform hover:scale-[1.01] transition-transform duration-200 print:transform-none ${
                    customization.sectionStyle === "card" ? "border border-gray-200 rounded-xl p-5" : "border-l-2 pl-5"
                  }`}
                  style={{
                    borderColor: customization.sectionStyle === "card" ? "#e5e7eb" : `${customization.primaryColor}40`,
                    background:
                      customization.sectionStyle === "card" ? `${customization.primaryColor}05` : "transparent",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                    <h4 className="text-base font-semibold">{exp.position}</h4>
                    <span className="text-xs font-medium" style={{ color: customization.primaryColor }}>
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </div>
                  {exp.description && <p className="text-sm text-gray-600 mb-3">{exp.description}</p>}
                  {exp.achievements.length > 0 && (
                    <ul
                      className={`ml-4 space-y-2 text-sm ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
                    >
                      {exp.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="text-gray-600">{achievement}</li>
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
          <section className={`transition-all duration-300 ${customization.sectionStyle === "bordered" ? "border border-gray-200 rounded-xl p-6" : ""}`}>
            <h3
              className="text-xl font-bold mb-4 relative inline-block"
              style={{
                color: customization.primaryColor,
                borderBottom:
                  customization.headerStyle === "underlined" ? `2px solid ${customization.primaryColor}` : "none",
                padding: customization.headerStyle === "boxed" ? "0.5rem 1rem" : "0",
                background: customization.headerStyle === "boxed" ? `${customization.primaryColor}10` : "none",
                borderRadius: customization.headerStyle === "boxed" ? "0.5rem" : "0",
              }}
            >
              Education
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gray-200 print:bg-transparent" />
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className={`transform hover:scale-[1.01] transition-transform duration-200 print:transform-none ${
                    customization.sectionStyle === "card" ? "border border-gray-200 rounded-xl p-5" : "border-l-2 pl-5"
                  }`}
                  style={{
                    borderColor: customization.sectionStyle === "card" ? "#e5e7eb" : `${customization.primaryColor}40`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                    <h4 className="text-base font-semibold">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h4>
                    <span className="text-xs font-medium" style={{ color: customization.primaryColor }}>
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    {edu.institution}
                    {edu.location && `, ${edu.location}`}
                  </div>
                  {edu.description && <p className="text-sm text-gray-600">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className={`transition-all duration-300 ${customization.sectionStyle === "bordered" ? "border border-gray-200 rounded-xl p-6" : ""}`}>
            <h3
              className="text-xl font-bold mb-4 relative inline-block"
              style={{
                color: customization.primaryColor,
                borderBottom:
                  customization.headerStyle === "underlined" ? `2px solid ${customization.primaryColor}` : "none",
                padding: customization.headerStyle === "boxed" ? "0.5rem 1rem" : "0",
                background: customization.headerStyle === "boxed" ? `${customization.primaryColor}10` : "none",
                borderRadius: customization.headerStyle === "boxed" ? "0.5rem" : "0",
              }}
            >
              Projects
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gray-200 print:bg-transparent" />
            </h3>
            <div className="space-y-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className={`transform hover:scale-[1.01] transition-transform duration-200 print:transform-none ${
                    customization.sectionStyle === "card" ? "border border-gray-200 rounded-xl p-5" : "border-l-2 pl-5"
                  }`}
                  style={{
                    borderColor: customization.sectionStyle === "card" ? "#e5e7eb" : `${customization.primaryColor}40`,
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-2">
                    <h4 className="text-base font-semibold">{project.name}</h4>
                    {(project.startDate || project.endDate) && (
                      <span className="text-xs font-medium" style={{ color: customization.primaryColor }}>
                        {project.startDate}
                        {project.endDate && ` - ${project.endDate}`}
                      </span>
                    )}
                  </div>
                  {project.technologies && (
                    <div className="text-sm font-medium mb-2" style={{ color: customization.primaryColor }}>
                      {project.technologies}
                    </div>
                  )}
                  {project.description && <p className="text-sm text-gray-600 mb-3">{project.description}</p>}
                  {project.achievements.length > 0 && (
                    <ul
                      className={`ml-4 space-y-2 text-sm ${customization.showBulletPoints ? "list-disc" : "list-none"}`}
                    >
                      {project.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="text-gray-600">{achievement}</li>
                      ))}
                    </ul>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-xs font-medium hover:underline transform hover:scale-105 transition-all duration-200"
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
      </div>

      {/* Print-specific styles */}
      <style jsx>{`
        @media print {
          .shadow-lg {
            box-shadow: none !important;
          }
          .hover\\:scale-105:hover,
          .hover\\:scale-\\[1\\.01\\]:hover {
            transform: none !important;
          }
          .transition-all,
          .transition-transform,
          .transition-colors {
            transition: none !important;
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