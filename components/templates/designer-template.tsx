import type { ResumeData } from "@/lib/types"
import { defaultCustomization } from "@/lib/templates"

interface DesignerTemplateProps {
    resumeData: ResumeData
}

export function DesignerTemplate({ resumeData }: DesignerTemplateProps) {
    const { personalInfo, skills, experience, education, projects } = resumeData
    const customization = resumeData.customization || defaultCustomization

    return (
        <div
            className="flex h-full flex-col bg-stone-50"
            style={{
                fontFamily: customization.fontFamily,
                color: "#1c1917",
            }}
        >
            <div className="grid grid-cols-12 h-full min-h-[1000px]">
                {/* Left Column (Brand) */}
                <div className="col-span-12 md:col-span-4 bg-black text-white p-8 flex flex-col justify-between" style={{ backgroundColor: "#1e1e1e" }}>
                    <div>
                        <div className="mb-12">
                            <h1 className="text-5xl font-black leading-tight mb-4 tracking-tighter" style={{ color: customization.primaryColor }}>
                                {personalInfo.name.split(" ").map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </h1>
                            <h2 className="text-xl font-light tracking-widest uppercase opacity-80">{personalInfo.title}</h2>
                        </div>

                        <div className="space-y-8">
                            {/* Contact */}
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Contact</h3>
                                <div className="space-y-2 text-sm font-light opacity-90">
                                    {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
                                    {personalInfo.phone && <div>{personalInfo.phone}</div>}
                                    {personalInfo.location && <div>{personalInfo.location}</div>}
                                    {personalInfo.website && <div className="break-all text-xs underline decoration-1 underline-offset-4 decoration-white/30">{personalInfo.website}</div>}
                                </div>
                            </div>

                            {/* Education */}
                            {education.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Education</h3>
                                    <div className="space-y-4">
                                        {education.map((edu, index) => (
                                            <div key={index}>
                                                <div className="font-bold text-sm leading-tight mb-1">{edu.degree}</div>
                                                <div className="text-xs opacity-70 mb-1">{edu.institution}</div>
                                                <div className="text-[10px] uppercase opacity-50">{edu.startDate} - {edu.endDate}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Skills */}
                            {skills.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold uppercase tracking-widest mb-4 opacity-50">Skills</h3>
                                    <div className="space-y-4">
                                        {skills.slice(0, 3).map((category, index) => (
                                            <div key={index}>
                                                <div className="text-xs font-bold mb-2 opacity-80">{category.name}</div>
                                                <div className="flex flex-wrap gap-1">
                                                    {category.skills.map((s, si) => (
                                                        <span key={si} className="text-[10px] px-1.5 py-0.5 border border-white/20 rounded-sm opacity-70">{s.name}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column (Content) */}
                <div className="col-span-12 md:col-span-8 p-8 md:p-12 bg-white">
                    {/* Summary */}
                    {personalInfo.summary && (
                        <section className="mb-12">
                            <p className="text-xl md:text-2xl font-light leading-relaxed opacity-80">
                                {personalInfo.summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience.length > 0 && (
                        <section className="mb-12">
                            <h3 className="text-4xl font-black tracking-tighter mb-8 opacity-10 flex items-center gap-4">
                                EXPERIENCE
                                <span className="h-px w-full bg-black flex-1"></span>
                            </h3>
                            <div className="space-y-10">
                                {experience.map((exp, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-4">
                                        <div className="col-span-3">
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-40">{exp.startDate}</div>
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-40">{exp.endDate}</div>
                                        </div>
                                        <div className="col-span-9 border-l-2 pl-6" style={{ borderColor: customization.primaryColor }}>
                                            <h4 className="text-xl font-bold mb-1">{exp.position}</h4>
                                            <div className="text-sm font-bold uppercase tracking-wide opacity-50 mb-3">{exp.company}, {exp.location}</div>
                                            <p className="text-sm opacity-70 leading-relaxed max-w-lg mb-3">{exp.description}</p>
                                            {exp.achievements.length > 0 && (
                                                <ul className="text-sm opacity-70 list-none space-y-1">
                                                    {exp.achievements.map((achievement, ai) => (
                                                        <li key={ai} className="before:content-['-'] before:mr-2">{achievement}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects.length > 0 && (
                        <section>
                            <h3 className="text-4xl font-black tracking-tighter mb-8 opacity-10 flex items-center gap-4">
                                PROJECTS
                                <span className="h-px w-full bg-black flex-1"></span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {projects.map((project, index) => (
                                    <div key={index} className="bg-stone-50 p-6 hover:bg-stone-100 transition-colors">
                                        <h4 className="font-bold text-lg mb-1">{project.name}</h4>
                                        {project.technologies && <div className="text-xs font-mono opacity-50 mb-3 pb-3 border-b border-stone-200">{project.technologies}</div>}
                                        <p className="text-sm opacity-70 mb-4 h-16 overflow-hidden text-ellipsis">{project.description}</p>
                                        {project.link && (
                                            <a href={project.link} className="text-xs font-bold uppercase tracking-widest border-b-2 pb-0.5 hover:opacity-50 transition-opacity" style={{ borderColor: customization.primaryColor }}>View Work</a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    )
}
