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

      <div className="space-y-8 px-8">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="h-px w-16 bg-gray-300"></span>
              <span className="mx-4 text-xs uppercase tracking-widest font-semibold" style={{ color: customization.primaryColor }}>Profile</span>
              <span className="h-px w-16 bg-gray-300"></span>
            </div>
            <p className="leading-relaxed text-center px-8 italic">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <div className="flex items-center mb-6">
              <h3 className="text-lg uppercase tracking-widest font-semibold border-b-2 pb-1 pr-6" style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}>Experience</h3>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 text-right">
                    <span className="block text-sm font-bold text-gray-700">{exp.startDate}</span>
                    <span className="block text-sm text-gray-500">{exp.endDate}</span>
                    <span className="block text-xs italic mt-1 text-gray-400">{exp.location}</span>
                  </div>
                  <div className="md:col-span-3 border-l pl-6 border-gray-200" style={{ borderColor: `${customization.primaryColor}30` }}>
                    <h4 className="text-lg font-bold text-gray-800">{exp.position}</h4>
                    <div className="text-base font-serif italic mb-2" style={{ color: customization.primaryColor }}>{exp.company}</div>
                    {exp.description && <p className="mb-2 text-sm text-gray-600">{exp.description}</p>}
                    {exp.achievements.length > 0 && (
                      <ul className={`space-y-1 text-sm text-gray-700 ${customization.showBulletPoints ? "list-disc pl-4" : ""}`}>
                        {exp.achievements.map((achievement, achievementIndex) => (
                          <li key={achievementIndex}>{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <div className="flex items-center mb-6">
              <h3 className="text-lg uppercase tracking-widest font-semibold border-b-2 pb-1 pr-6" style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}>Education</h3>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 text-right">
                    <span className="block text-sm font-bold text-gray-700">{edu.startDate}</span>
                    <span className="block text-sm text-gray-500">{edu.endDate}</span>
                  </div>
                  <div className="md:col-span-3 border-l pl-6 border-gray-200" style={{ borderColor: `${customization.primaryColor}30` }}>
                    <h4 className="text-lg font-bold text-gray-800">{edu.degree} {edu.field && `in ${edu.field}`}</h4>
                    <div className="text-base italic" style={{ color: customization.primaryColor }}>{edu.institution}, {edu.location}</div>
                    {edu.description && <p className="mt-1 text-sm text-gray-600">{edu.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section>
            <div className="flex items-center mb-6">
              <h3 className="text-lg uppercase tracking-widest font-semibold border-b-2 pb-1 pr-6" style={{ borderColor: customization.primaryColor, color: customization.primaryColor }}>Expertise</h3>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              {skills.map((category, index) => (
                <div key={index}>
                  <h4 className="mb-2 text-sm uppercase tracking-wider font-bold text-gray-700 border-b pb-1 inline-block">{category.name}</h4>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span key={skillIndex} className="text-sm border-r pr-2 last:border-0 last:pr-0 border-gray-300 text-gray-600">
                        {skill.name}
                      </span>
                    ))}
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