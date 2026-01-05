import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface AcademicTemplateProps {
    resumeData: ResumeData
}

export function AcademicTemplate({ resumeData }: AcademicTemplateProps) {
    const { personalInfo, skills, experience, education, projects } = resumeData
    const customization = resumeData.customization || defaultCustomization

    return (
        <div
            className="flex h-full flex-col text-sm"
            style={{
                fontFamily: "'Times New Roman', Times, serif",
                color: "#000000",
                lineHeight: "1.6"
            }}
        >
            {/* Header */}
            <header className="mb-6 text-center">
                <h1 className="mb-2 text-2xl font-bold uppercase tracking-wider">{personalInfo.name}</h1>
                <div className="mb-2 text-base">{personalInfo.title}</div>
                <div className="flex flex-wrap justify-center gap-x-4 text-sm">
                    {personalInfo.location && <span>{personalInfo.location}</span>}
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo.website && <span>{personalInfo.website}</span>}
                </div>
                <div className="mt-4 border-b-2 border-black w-1/12 mx-auto"></div>
            </header>

            <div className="px-8 space-y-6">
                {/* Education (First priority in Academic) */}
                {education.length > 0 && (
                    <section>
                        <h3 className="mb-3 text-base font-bold uppercase border-b border-gray-400 pb-1">Education</h3>
                        <div className="space-y-3">
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <div className="flex justify-between font-bold">
                                        <span>{edu.institution}, {edu.location}</span>
                                        <span>{edu.endDate}</span>
                                    </div>
                                    <div className="italic">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                                    {edu.description && <div className="mt-1 pl-4 text-xs">{edu.description}</div>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Research/Experience */}
                {experience.length > 0 && (
                    <section>
                        <h3 className="mb-3 text-base font-bold uppercase border-b border-gray-400 pb-1">Professional Experience</h3>
                        <div className="space-y-4">
                            {experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between font-bold">
                                        <span>{exp.position}</span>
                                        <span>{exp.startDate} – {exp.endDate}</span>
                                    </div>
                                    <div className="italic mb-1">{exp.company}, {exp.location}</div>
                                    {exp.description && <div className="mb-1">{exp.description}</div>}
                                    {exp.achievements.length > 0 && (
                                        <ul className="list-disc pl-5">
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

                {/* Projects (framed as Research or Significant Work) */}
                {projects.length > 0 && (
                    <section>
                        <h3 className="mb-3 text-base font-bold uppercase border-b border-gray-400 pb-1">Research & Projects</h3>
                        <div className="space-y-3">
                            {projects.map((project, index) => (
                                <div key={index}>
                                    <div className="font-bold">{project.name} <span className="font-normal italic text-xs ml-2">({project.startDate} - {project.endDate})</span></div>
                                    <div className="pl-4">
                                        <p>{project.description}</p>
                                        {project.technologies && <div className="text-xs italic mt-1">Tools: {project.technologies}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Skills */}
                {skills.length > 0 && (
                    <section>
                        <h3 className="mb-3 text-base font-bold uppercase border-b border-gray-400 pb-1">Skills</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {skills.map((category, index) => (
                                <div key={index} className="flex">
                                    <span className="font-bold w-32 flex-shrink-0">{category.name}:</span>
                                    <span>{category.skills.map(s => s.name).join(", ")}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    )
}
