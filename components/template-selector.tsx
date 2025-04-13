"use client"

import type { Template } from "@/lib/types"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface TemplateSelectorProps {
  templates: Template[]
  selectedTemplate: Template
  onSelectTemplate: (template: Template) => void
}

export function TemplateSelector({ templates, selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Template</h3>
      <RadioGroup
        defaultValue={selectedTemplate.id}
        className="grid grid-cols-4 gap-4"
        onValueChange={(value) => {
          const template = templates.find((t) => t.id === value)
          if (template) onSelectTemplate(template)
        }}
      >
        {templates.map((template) => (
          <div key={template.id} className="relative">
            <RadioGroupItem value={template.id} id={template.id} className="peer sr-only" />
            <Label
              htmlFor={template.id}
              className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-gray-200 bg-white p-2 text-center hover:border-purple-500 peer-data-[state=checked]:border-purple-600 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-500 dark:peer-data-[state=checked]:border-purple-600"
            >
              <div className="mb-2 h-24 w-full overflow-hidden rounded border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage: `url(${template.thumbnail || "/placeholder.svg?height=96&width=120"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
              <span className="text-xs font-medium">{template.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
