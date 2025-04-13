"use client"

import { useState } from "react"
import type { Experience } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ExperienceFormProps {
  experience: Experience[]
  onDataChange: (experience: Experience[]) => void
}

export function ExperienceForm({ experience, onDataChange }: ExperienceFormProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(experience.length > 0 ? `item-0` : null)

  const handleAddExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      startDate: "",
      endDate: "Present",
      location: "",
      description: "",
      achievements: [""],
    }

    const updatedExperience = [...experience, newExperience]
    onDataChange(updatedExperience)
    setExpandedItem(`item-${updatedExperience.length - 1}`)
  }

  const handleRemoveExperience = (index: number) => {
    const updatedExperience = [...experience]
    updatedExperience.splice(index, 1)
    onDataChange(updatedExperience)
  }

  const handleExperienceChange = (index: number, field: keyof Experience, value: string | string[]) => {
    const updatedExperience = [...experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    onDataChange(updatedExperience)
  }

  const handleAddAchievement = (experienceIndex: number) => {
    const updatedExperience = [...experience]
    updatedExperience[experienceIndex].achievements.push("")
    onDataChange(updatedExperience)
  }

  const handleRemoveAchievement = (experienceIndex: number, achievementIndex: number) => {
    const updatedExperience = [...experience]
    updatedExperience[experienceIndex].achievements.splice(achievementIndex, 1)
    onDataChange(updatedExperience)
  }

  const handleAchievementChange = (experienceIndex: number, achievementIndex: number, value: string) => {
    const updatedExperience = [...experience]
    updatedExperience[experienceIndex].achievements[achievementIndex] = value
    onDataChange(updatedExperience)
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
        {experience.map((exp, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between">
                <div className="text-left">
                  <h3 className="font-medium">{exp.position || exp.company || `Experience ${index + 1}`}</h3>
                  {exp.company && exp.position && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {exp.company} • {exp.startDate} - {exp.endDate}
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`company-${index}`}>Company</Label>
                    <Input
                      id={`company-${index}`}
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`position-${index}`}>Position</Label>
                    <Input
                      id={`position-${index}`}
                      value={exp.position}
                      onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                      placeholder="Your job title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      value={exp.startDate}
                      onChange={(e) => handleExperienceChange(index, "startDate", e.target.value)}
                      placeholder="e.g. June 2024"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      value={exp.endDate}
                      onChange={(e) => handleExperienceChange(index, "endDate", e.target.value)}
                      placeholder="e.g. Present"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`location-${index}`}>Location</Label>
                    <Input
                      id={`location-${index}`}
                      value={exp.location}
                      onChange={(e) => handleExperienceChange(index, "location", e.target.value)}
                      placeholder="e.g. Remote, New York, NY"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={exp.description}
                    onChange={(e) => handleExperienceChange(index, "description", e.target.value)}
                    placeholder="Brief description of your role"
                    className="h-20 resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Key Achievements</Label>
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

                  {exp.achievements.map((achievement, achievementIndex) => (
                    <div key={achievementIndex} className="flex items-start gap-2">
                      <Input
                        value={achievement}
                        onChange={(e) => handleAchievementChange(index, achievementIndex, e.target.value)}
                        placeholder="e.g. Increased sales by 20% through..."
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveAchievement(index, achievementIndex)}
                        disabled={exp.achievements.length <= 1}
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
                    onClick={() => handleRemoveExperience(index)}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Experience
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button type="button" variant="outline" onClick={handleAddExperience} className="w-full gap-1">
        <Plus className="h-4 w-4" />
        Add Experience
      </Button>

      {experience.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No experience added yet. Add your first job experience above.
          </p>
        </div>
      )}
    </div>
  )
}
