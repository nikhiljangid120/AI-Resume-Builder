import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface ProfessionalTemplateProps {
    resumeData: ResumeData
}

export function ProfessionalTemplate({ resumeData }: ProfessionalTemplateProps) {
    const { personalInfo, skills, experience, education, projects } = resumeData
    const customization = resumeData.customization || defaultCustomization

    return (
        <div
            className="flex h-full flex-col bg-white"
            style={{
                fontFamily: customization.fontFamily,
                color: "#1e293b",
            }}
        >
            {/* Header Panel */}
            <header className="px-8 py-10 text-white" style={{ backgroundColor: customization.primaryColor }}>
                <h1 className="mb-1 text-4xl font-bold tracking-tight text-white">
                    {personalInfo.name}
                </h1>
                <h2 className="mb-6 text-xl font-medium text-white/90">{personalInfo.title}</h2>

                <div className="flex flex-wrap gap-6 text-sm text-white/80">
                    {personalInfo.email && (
                        <div className="flex items-center gap-2">
                            <span>Email: {personalInfo.email}</span>
                        </div>
                    )}
                    {personalInfo.phone && (
                        <div className="flex items-center gap-2">
                            <span>Phone: {personalInfo.phone}</span>
                        </div>
                    )}
                    {personalInfo.location && (
                        <div className="flex items-center gap-2">
                            <span>Loc: {personalInfo.location}</span>
                        </div>
                    )}
                    {personalInfo.website && (
                        <div className="flex items-center gap-2">
                            <span>Web: {personalInfo.website}</span>
                        </div>
                    )}
                </div>
            </header>

            <div className="flex flex-col md:flex-row flex-1">
                {/* Sidebar */}
                <aside className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-200">
                    {/* Skills */}
                    {skills.length > 0 && (
                        <section className="mb-8">
                            <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-slate-800 border-b-2 pb-1" style={{ borderColor: customization.primaryColor }}>Skills</h3>
                            <div className="space-y-4">
                                {skills.map((category, index) => (
                                    <div key={index}>
                                        <h4 className="mb-2 text-sm font-semibold text-slate-700">{category.name}</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {category.skills.map((skill, skillIndex) => (
                                                <span
                                                    key={skillIndex}
                                                    className="bg-white border rounded px-2 py-1 text-xs font-medium text-slate-600 shadow-sm"
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

                    {/* Education (Sidebar style) */}
                    {education.length > 0 && (
                        <section>
                            <h3 className="mb-4 text-base font-bold uppercase tracking-wider text-slate-800 border-b-2 pb-1" style={{ borderColor: customization.primaryColor }}>Education</h3>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index}>
                                        <h4 className="font-bold text-slate-800 leading-tight">{edu.degree}</h4>
                                        <div className="text-sm font-medium text-slate-600 mb-1">{edu.institution}</div>
                                        <div className="text-xs text-slate-500 mb-1">{edu.startDate} - {edu.endDate}</div>
                                        {edu.description && <p className="text-xs text-slate-500">{edu.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>

                {/* Main Content */}
                <main className="w-full md:w-2/3 p-8">
                    {/* Summary */}
                    {personalInfo.summary && (
                        <section className="mb-8">
                            <h3 className="mb-3 text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-8 rounded-sm" style={{ backgroundColor: customization.primaryColor }}></span>
                                Summary
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-justify">{personalInfo.summary}</p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <section className="mb-8">
                            <h3 className="mb-6 text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-8 rounded-sm" style={{ backgroundColor: customization.primaryColor }}></span>
                                Professional Experience
                            </h3>
                            <div className="space-y-8 relative">
                                <div className="absolute left-0 top-2 bottom-0 w-0.5 bg-slate-200 ml-1"></div>
                                {experience.map((exp, index) => (
                                    <div key={index} className="pl-6 relative">
                                        <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 bg-white" style={{ borderColor: customization.primaryColor, marginLeft: "-4px" }}></div>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="text-lg font-bold text-slate-800">{exp.position}</h4>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 whitespace-nowrap">{exp.startDate} - {exp.endDate}</span>
                                        </div>
                                        <div className="text-base font-medium mb-3" style={{ color: customization.primaryColor }}>{exp.company}, {exp.location}</div>

                                        {exp.description && <p className="mb-2 text-sm text-slate-600">{exp.description}</p>}
                                        {exp.achievements.length > 0 && (
                                            <ul className="text-sm text-slate-600 list-none space-y-1.5">
                                                {exp.achievements.map((achievement, achievementIndex) => (
                                                    <li key={achievementIndex} className="relative pl-3 before:content-[''] before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-slate-400">
                                                        {achievement}
                                                    </li>
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
                            <h3 className="mb-6 text-lg font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-2 h-8 rounded-sm" style={{ backgroundColor: customization.primaryColor }}></span>
                                Key Projects
                            </h3>
                            <div className="grid grid-cols-1 gap-6">
                                {projects.map((project, index) => (
                                    <div key={index} className="bg-slate-50 p-4 rounded border border-slate-100">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold text-slate-800">{project.name}</h4>
                                            {(project.startDate || project.endDate) && (
                                                <span className="text-xs text-slate-500">{project.startDate} - {project.endDate}</span>
                                            )}
                                        </div>
                                        {project.technologies && (
                                            <div className="text-xs font-medium text-slate-500 mb-2 font-mono">{project.technologies}</div>
                                        )}
                                        <p className="text-sm text-slate-600 mb-2">{project.description}</p>
                                        {project.link && (
                                            <a href={project.link} className="text-xs font-semibold hover:underline" style={{ color: customization.primaryColor }}>View Project &rarr;</a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                </main>
            </div>
        </div>
    )
}
