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
    <div className="space-y-4 p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
        Choose Your Template
      </h3>
      <RadioGroup
        defaultValue={selectedTemplate.id}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        onValueChange={(value) => {
          const template = templates.find((t) => t.id === value)
          if (template) onSelectTemplate(template)
        }}
      >
        {templates.map((template) => (
          <div
            key={template.id}
            className="relative group animate-fade-in"
          >
            <RadioGroupItem value={template.id} id={template.id} className="peer sr-only" />
            <Label
              htmlFor={template.id}
              className="flex flex-col items-center justify-between cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-3 text-center transition-all duration-300 ease-in-out hover:border-purple-500 hover:shadow-xl peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:shadow-md peer-data-[state=checked]:scale-105 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-purple-400 dark:peer-data-[state=checked]:border-purple-400"
            >
              <div className="mb-3 w-full h-28 sm:h-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-900 transform group-hover:scale-105 transition-transform duration-300">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${template.thumbnail || "/placeholder.svg?height=128&width=160"})`,
                  }}
                ></div>
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                {template.name}
              </span>
            </Label>
            {/* Optional badge for selected template */}
            <div className="absolute -top-2 -right-2 hidden peer-data-[state=checked]:block">
              <span className="bg-purple-600 text-white text-xs font-semibold rounded-full px-2 py-1 shadow-md">
                Selected
              </span>
            </div>
          </div>
        ))}
      </RadioGroup>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}