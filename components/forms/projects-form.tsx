"use client"

import { useState } from "react"
import type { Project } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ProjectsFormProps {
  projects: Project[]
  onDataChange: (projects: Project[]) => void
}

export function ProjectsForm({ projects, onDataChange }: ProjectsFormProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(projects.length > 0 ? `item-0` : null)

  const handleAddProject = () => {
    const newProject = {
      name: "",
      description: "",
      technologies: "",
      link: "",
      startDate: "",
      endDate: "",
      achievements: [""],
    }

    const updatedProjects = [...projects, newProject]
    onDataChange(updatedProjects)
    setExpandedItem(`item-${updatedProjects.length - 1}`)
  }

  const handleRemoveProject = (index: number) => {
    const updatedProjects = [...projects]
    updatedProjects.splice(index, 1)
    onDataChange(updatedProjects)
  }

  const handleProjectChange = (index: number, field: keyof Project, value: string | string[]) => {
    const updatedProjects = [...projects]
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    }
    onDataChange(updatedProjects)
  }

  const handleAddAchievement = (projectIndex: number) => {
    const updatedProjects = [...projects]
    updatedProjects[projectIndex].achievements.push("")
    onDataChange(updatedProjects)
  }

  const handleRemoveAchievement = (projectIndex: number, achievementIndex: number) => {
    const updatedProjects = [...projects]
    updatedProjects[projectIndex].achievements.splice(achievementIndex, 1)
    onDataChange(updatedProjects)
  }

  const handleAchievementChange = (projectIndex: number, achievementIndex: number, value: string) => {
    const updatedProjects = [...projects]
    updatedProjects[projectIndex].achievements[achievementIndex] = value
    onDataChange(updatedProjects)
  }

  return (
    <div className="space-y-4">
      <Accordion
        type="single"
        collapsible
        value={expandedItem || undefined}
        onValueChange={(value) => setExpandedItem(value)}
        className="space-y-4"
      >
        {projects.map((project, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between">
                <div className="text-left">
                  <h3 className="font-medium">{project.name || `Project ${index + 1}`}</h3>
                  {project.technologies && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{project.technologies}</p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`project-name-${index}`}>Project Name</Label>
                    <Input
                      id={`project-name-${index}`}
                      value={project.name}
                      onChange={(e) => handleProjectChange(index, "name", e.target.value)}
                      placeholder="Project name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`technologies-${index}`}>Technologies Used</Label>
                    <Input
                      id={`technologies-${index}`}
                      value={project.technologies}
                      onChange={(e) => handleProjectChange(index, "technologies", e.target.value)}
                      placeholder="e.g. React, Node.js, MongoDB"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`project-link-${index}`}>Project Link</Label>
                    <Input
                      id={`project-link-${index}`}
                      value={project.link}
                      onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                      placeholder="e.g. https://github.com/username/project"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                    <Input
                      id={`start-date-${index}`}
                      value={project.startDate}
                      onChange={(e) => handleProjectChange(index, "startDate", e.target.value)}
                      placeholder="e.g. June 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`end-date-${index}`}>End Date</Label>
                    <Input
                      id={`end-date-${index}`}
                      value={project.endDate}
                      onChange={(e) => handleProjectChange(index, "endDate", e.target.value)}
                      placeholder="e.g. Ongoing"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                    placeholder="Brief description of your project"
                    className="h-20 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Key Features/Achievements</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddAchievement(index)}
                      className="h-7 gap-1 text-xs"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  </div>

                  {project.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-start gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, achievementIndex, e.target.value)}
                        placeholder="e.g. Implemented real-time data visualization"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAchievement(index, achievementIndex)}
                        disabled={project.achievements.length <= 1}
                        className="h-9 w-9 shrink-0 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove achievement</span>
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveProject(index)}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Project
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button type="button" variant="outline" onClick={handleAddProject} className="w-full gap-1">
        <Plus className="h-4 w-4" />
        Add Project
      </Button>

      {projects.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No projects added yet. Add your first project above.</p>
        </div>
      )}
    </div>
  )
}
