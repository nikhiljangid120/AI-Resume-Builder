"use client"

import { useState } from "react"
import type { Education } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface EducationFormProps {
  education: Education[]
  onDataChange: (education: Education[]) => void
}

export function EducationForm({ education, onDataChange }: EducationFormProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(education.length > 0 ? `item-0` : null)

  const handleAddEducation = () => {
    const newEducation = {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      location: "",
      description: "",
    }

    const updatedEducation = [...education, newEducation]
    onDataChange(updatedEducation)
    setExpandedItem(`item-${updatedEducation.length - 1}`)
  }

  const handleRemoveEducation = (index: number) => {
    const updatedEducation = [...education]
    updatedEducation.splice(index, 1)
    onDataChange(updatedEducation)
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const updatedEducation = [...education]
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    }
    onDataChange(updatedEducation)
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
        {education.map((edu, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex flex-1 items-center justify-between">
                <div className="text-left">
                  <h3 className="font-medium">{edu.institution || edu.degree || `Education ${index + 1}`}</h3>
                  {edu.institution && edu.degree && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {edu.degree} • {edu.startDate} - {edu.endDate}
                    </p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-2">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                    <Input
                      id={`institution-${index}`}
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                      placeholder="University or school name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${index}`}>Degree</Label>
                    <Input
                      id={`degree-${index}`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                      placeholder="e.g. Bachelor of Technology"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}`}>Field of Study</Label>
                    <Input
                      id={`field-${index}`}
                      value={edu.field}
                      onChange={(e) => handleEducationChange(index, "field", e.target.value)}
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(index, "startDate", e.target.value)}
                      placeholder="e.g. 2022"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(index, "endDate", e.target.value)}
                      placeholder="e.g. 2026 or Expected 2026"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`location-${index}`}>Location</Label>
                  <Input
                    id={`location-${index}`}
                    value={edu.location}
                    onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                    placeholder="e.g. Jaipur, India"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Additional Information</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={edu.description}
                    onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                    placeholder="Relevant coursework, achievements, etc."
                    className="h-20 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveEducation(index)}
                    className="gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove Education
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button type="button" variant="outline" onClick={handleAddEducation} className="w-full gap-1">
        <Plus className="h-4 w-4" />
        Add Education
      </Button>

      {education.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No education added yet. Add your first education above.</p>
        </div>
      )}
    </div>
  )
}
