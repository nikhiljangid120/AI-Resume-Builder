"use client"

import { useState } from "react"
import type { ResumeData } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PersonalInfoForm } from "./forms/personal-info-form"
import { SkillsForm } from "./forms/skills-form"
import { ExperienceForm } from "./forms/experience-form"
import { EducationForm } from "./forms/education-form"
import { ProjectsForm } from "./forms/projects-form"

interface ResumeEditorProps {
  resumeData: ResumeData
  onDataChange: (data: Partial<ResumeData>) => void
  onSectionReorder: (sections: string[]) => void
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
}

export function ResumeEditor({
  resumeData,
  onDataChange,
  onSectionReorder,
  jobDescription,
  onJobDescriptionChange,
}: ResumeEditorProps) {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-4">
          <PersonalInfoForm
            personalInfo={resumeData.personalInfo}
            onDataChange={(personalInfo) => onDataChange({ personalInfo })}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-4">
          <SkillsForm skills={resumeData.skills} onDataChange={(skills) => onDataChange({ skills })} />
        </TabsContent>

        <TabsContent value="experience" className="mt-4">
          <ExperienceForm
            experience={resumeData.experience}
            onDataChange={(experience) => onDataChange({ experience })}
          />
        </TabsContent>

        <TabsContent value="education" className="mt-4">
          <EducationForm education={resumeData.education} onDataChange={(education) => onDataChange({ education })} />
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <ProjectsForm projects={resumeData.projects} onDataChange={(projects) => onDataChange({ projects })} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
