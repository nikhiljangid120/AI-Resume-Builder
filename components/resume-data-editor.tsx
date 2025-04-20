"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X, Plus, Trash2, Info } from "lucide-react"
import type { ResumeData, PersonalInfo, SkillCategory } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface ResumeDataEditorProps {
  resumeData: ResumeData
  onDataChange: (data: Partial<ResumeData>) => void
  extractedText: string | null
}

export function ResumeDataEditor({ resumeData, onDataChange, extractedText }: ResumeDataEditorProps) {
  const [activeTab, setActiveTab] = useState("personal")
  const [editMode, setEditMode] = useState(true) // Start in edit mode by default

  // Ensure all properties exist with proper defaults
  const safeResumeData: ResumeData = {
    personalInfo: resumeData.personalInfo || {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      summary: "",
    },
    skills: Array.isArray(resumeData.skills) ? resumeData.skills : [],
    experience: Array.isArray(resumeData.experience) ? resumeData.experience : [],
    education: Array.isArray(resumeData.education) ? resumeData.education : [],
    projects: Array.isArray(resumeData.projects) ? resumeData.projects : [],
    customization: resumeData.customization,
  }

  const [tempPersonalInfo, setTempPersonalInfo] = useState<PersonalInfo>({ ...safeResumeData.personalInfo })
  const [tempSkills, setTempSkills] = useState<SkillCategory[]>([...safeResumeData.skills])
  const [newSkill, setNewSkill] = useState("")
  const [newSkillCategory, setNewSkillCategory] = useState("Technical")
  const { toast } = useToast()

  const handleSavePersonalInfo = () => {
    onDataChange({ personalInfo: tempPersonalInfo })
    setEditMode(false)
    toast({
      title: "Personal Info Updated",
      description: "Your personal information has been saved successfully.",
      variant: "success",
    })
  }

  const handleCancelEdit = () => {
    setTempPersonalInfo({ ...safeResumeData.personalInfo })
    setEditMode(false)
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) return

    const updatedSkills = [...tempSkills]
    const categoryIndex = updatedSkills.findIndex((category) => category.name === newSkillCategory)

    if (categoryIndex === -1) {
      // Create new category if it doesn't exist
      updatedSkills.push({
        name: newSkillCategory,
        skills: [{ name: newSkill }],
      })
    } else {
      // Add to existing category
      updatedSkills[categoryIndex].skills.push({ name: newSkill })
    }

    setTempSkills(updatedSkills)
    setNewSkill("")
  }

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedSkills = [...tempSkills]
    updatedSkills[categoryIndex].skills.splice(skillIndex, 1)

    // Remove category if empty
    if (updatedSkills[categoryIndex].skills.length === 0) {
      updatedSkills.splice(categoryIndex, 1)
    }

    setTempSkills(updatedSkills)
  }

  const handleSaveSkills = () => {
    onDataChange({ skills: tempSkills })
    toast({
      title: "Skills Updated",
      description: "Your skills have been saved successfully.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4 space-y-4">
          {!editMode ? (
            <>
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Personal Information</h3>
                <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
              <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                <dl className="space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Name:</dt>
                    <dd className="col-span-2">{safeResumeData.personalInfo.name || "Not provided"}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Title:</dt>
                    <dd className="col-span-2">{safeResumeData.personalInfo.title || "Not provided"}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Email:</dt>
                    <dd className="col-span-2">{safeResumeData.personalInfo.email || "Not provided"}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Phone:</dt>
                    <dd className="col-span-2">{safeResumeData.personalInfo.phone || "Not provided"}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Location:</dt>
                    <dd className="col-span-2">{safeResumeData.personalInfo.location || "Not provided"}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <dt className="font-medium text-gray-500 dark:text-gray-400">Website:</dt>
                    <dd className="col-span-2">{safeResumeData.personalInfo.website || "Not provided"}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                <h4 className="mb-2 font-medium">Professional Summary</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {safeResumeData.personalInfo.summary || "No summary provided"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <h3 className="text-lg font-medium">Edit Personal Information</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSavePersonalInfo}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={tempPersonalInfo.name}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={tempPersonalInfo.title}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, title: e.target.value })}
                      placeholder="e.g. Full Stack Developer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={tempPersonalInfo.email}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={tempPersonalInfo.phone}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, phone: e.target.value })}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={tempPersonalInfo.location}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, location: e.target.value })}
                      placeholder="City, State"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website/LinkedIn</Label>
                    <Input
                      id="website"
                      value={tempPersonalInfo.website}
                      onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, website: e.target.value })}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={tempPersonalInfo.summary}
                    onChange={(e) => setTempPersonalInfo({ ...tempPersonalInfo, summary: e.target.value })}
                    placeholder="Write a brief professional summary..."
                    className="h-32 resize-none"
                  />
                </div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Skills</h3>
            <Button variant="outline" size="sm" onClick={handleSaveSkills}>
              <Save className="mr-2 h-4 w-4" />
              Save Skills
            </Button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="skill">Add Skill</Label>
                <Input
                  id="skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Enter a skill (e.g. React.js)"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSkill()
                    }
                  }}
                />
              </div>
              <div className="w-40 space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <option value="Technical">Technical</option>
                  <option value="Programming Languages">Programming Languages</option>
                  <option value="Frameworks">Frameworks</option>
                  <option value="Tools">Tools</option>
                  <option value="Soft Skills">Soft Skills</option>
                </select>
              </div>
              <Button onClick={handleAddSkill} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {tempSkills.length > 0 ? (
              tempSkills.map((category, categoryIndex) => (
                <div key={categoryIndex} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                  <h4 className="mb-2 font-medium">{category.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="flex items-center gap-1 bg-gray-100 px-2 py-1 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                      >
                        {skill.name}
                        <button
                          onClick={() => handleRemoveSkill(categoryIndex, skillIndex)}
                          className="ml-1 rounded-full p-0.5 text-gray-500 hover:bg-gray-200 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {skill.name}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>No skills added yet. Add them using the form above.</AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Experience</h3>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {safeResumeData.experience.length > 0 ? (
              safeResumeData.experience.map((exp, index) => (
                <div key={index} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-medium">{exp.position || "Position not provided"}</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.startDate || "?"} - {exp.endDate || "?"}
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {exp.company || "Company not provided"}
                    {exp.location && `, ${exp.location}`}
                  </p>
                  {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && exp.achievements[0] && (
                    <div className="mt-2">
                      <h5 className="text-xs font-medium">Achievements:</h5>
                      <ul className="ml-5 mt-1 list-disc text-sm">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  No work experience added yet. Click "Add Experience" to get started.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        <TabsContent value="education" className="mt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Education</h3>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {safeResumeData.education.length > 0 ? (
              safeResumeData.education.map((edu, index) => (
                <div key={index} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-medium">
                      {edu.degree || "Degree not provided"}
                      {edu.field && ` in ${edu.field}`}
                    </h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.startDate || "?"} - {edu.endDate || "?"}
                    </span>
                  </div>
                  <p className="text-sm font-medium">
                    {edu.institution || "Institution not provided"}
                    {edu.location && `, ${edu.location}`}
                  </p>
                  {edu.description && <p className="mt-2 text-sm">{edu.description}</p>}
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>No education added yet. Click "Add Education" to get started.</AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Projects</h3>
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
          <div className="mt-4 space-y-4">
            {safeResumeData.projects.length > 0 ? (
              safeResumeData.projects.map((project, index) => (
                <div key={index} className="rounded-md border border-gray-200 p-4 dark:border-gray-700">
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="font-medium">{project.name || "Project name not provided"}</h4>
                    {(project.startDate || project.endDate) && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {project.startDate && project.startDate}
                        {project.startDate && project.endDate && " - "}
                        {project.endDate && project.endDate}
                      </span>
                    )}
                  </div>
                  {project.technologies && (
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{project.technologies}</p>
                  )}
                  {project.description && <p className="mt-2 text-sm">{project.description}</p>}
                  {project.achievements && project.achievements.length > 0 && project.achievements[0] && (
                    <div className="mt-2">
                      <h5 className="text-xs font-medium">Key Features:</h5>
                      <ul className="ml-5 mt-1 list-disc text-sm">
                        {project.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs font-medium text-purple-600 hover:underline dark:text-purple-400"
                    >
                      View Project
                    </a>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button variant="outline" size="sm" className="mr-2">
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-3 w-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>No projects added yet. Click "Add Project" to get started.</AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
