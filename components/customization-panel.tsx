// @ts-nocheck
"use client"
import type { ResumeData, ResumeCustomization } from "@/lib/types"
import { themeOptions, fontOptions, spacingOptions, fontSizeOptions, defaultCustomization } from "@/lib/templates"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Palette, Type, Maximize, MinusSquare, List, RotateCcw, LayoutGrid } from "lucide-react"
import { layoutOptions, headerStyleOptions, sectionStyleOptions } from "@/lib/templates-enhanced"
import { useToast } from "@/hooks/use-toast"

interface CustomizationPanelProps {
  resumeData: ResumeData
  onDataChange: (data: Partial<ResumeData>) => void
}

export function CustomizationPanel({ resumeData, onDataChange }: CustomizationPanelProps) {
  // Ensure customization exists
  const customization = resumeData.customization || defaultCustomization
  const { toast } = useToast()

  const handleCustomizationChange = (updates: Partial<ResumeCustomization>) => {
    onDataChange({
      customization: {
        ...customization,
        ...updates,
      },
    })
  }

  const handleResetCustomization = () => {
    // Create a deep copy of default customization to avoid reference issues
    const resetCustomization = JSON.parse(JSON.stringify(defaultCustomization))

    onDataChange({
      customization: resetCustomization,
    })

    toast({
      title: "Customization Reset",
      description: "Your customization settings have been reset to default.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customize Resume</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetCustomization}
          className="flex items-center gap-1 text-xs"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="colors">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-500" />
              <span>Colors</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <Label className="text-xs">Color Theme</Label>
              <RadioGroup
                value={themeOptions.find((t) => t.primaryColor === customization.primaryColor)?.name || "Purple"}
                onValueChange={(value) => {
                  const theme = themeOptions.find((t) => t.name === value)
                  if (theme) {
                    handleCustomizationChange({
                      primaryColor: theme.primaryColor,
                      secondaryColor: theme.secondaryColor,
                    })
                  }
                }}
                className="grid grid-cols-4 gap-2"
              >
                {themeOptions.map((theme) => (
                  <div key={theme.name} className="relative">
                    <RadioGroupItem value={theme.name} id={`theme-${theme.name}`} className="peer sr-only" />
                    <Label
                      htmlFor={`theme-${theme.name}`}
                      className="flex cursor-pointer flex-col items-center rounded-md border-2 border-gray-200 p-2 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 dark:border-gray-700 dark:hover:border-gray-600 dark:peer-data-[state=checked]:border-purple-500"
                    >
                      <div className="h-6 w-6 rounded-full" style={{ backgroundColor: theme.primaryColor }}></div>
                      <span className="mt-1 text-xs">{theme.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="typography">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-purple-500" />
              <span>Typography</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <RadioGroup
                  value={customization.fontFamily}
                  onValueChange={(value) => handleCustomizationChange({ fontFamily: value })}
                  className="space-y-2"
                >
                  {fontOptions.map((font) => (
                    <div key={font.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={font.value} id={`font-${font.name}`} />
                      <Label
                        htmlFor={`font-${font.name}`}
                        className="cursor-pointer"
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <RadioGroup
                  value={customization.fontSize}
                  onValueChange={(value) => handleCustomizationChange({ fontSize: value })}
                  className="grid grid-cols-3 gap-2"
                >
                  {fontSizeOptions.map((size) => (
                    <div key={size.name} className="relative">
                      <RadioGroupItem value={size.value} id={`size-${size.name}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size.name}`}
                        className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-2 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 dark:border-gray-700 dark:hover:border-gray-600 dark:peer-data-[state=checked]:border-purple-500"
                      >
                        <span className="text-xs">{size.name}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="spacing">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-purple-500" />
              <span>Spacing</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <Label className="text-xs">Layout Spacing</Label>
              <RadioGroup
                value={customization.spacing}
                onValueChange={(value) => handleCustomizationChange({ spacing: value })}
                className="grid grid-cols-2 gap-2"
              >
                {spacingOptions.map((spacing) => (
                  <div key={spacing.name} className="relative">
                    <RadioGroupItem value={spacing.value} id={`spacing-${spacing.name}`} className="peer sr-only" />
                    <Label
                      htmlFor={`spacing-${spacing.name}`}
                      className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-2 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 dark:border-gray-700 dark:hover:border-gray-600 dark:peer-data-[state=checked]:border-purple-500"
                    >
                      <span className="text-xs">{spacing.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="elements">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <MinusSquare className="h-4 w-4 text-purple-500" />
              <span>Elements</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-bullets" className="text-xs">
                  Show Bullet Points
                </Label>
                <Switch
                  id="show-bullets"
                  checked={customization.showBulletPoints}
                  onCheckedChange={(checked) => handleCustomizationChange({ showBulletPoints: checked })}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="layout">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <Maximize className="h-4 w-4 text-purple-500" />
              <span>Layout</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <Label className="text-xs">Resume Layout</Label>
              <RadioGroup
                value={customization.layout || "standard"}
                onValueChange={(value) => handleCustomizationChange({ layout: value })}
                className="grid grid-cols-2 gap-2"
              >
                {layoutOptions.map((layout) => (
                  <div key={layout.name} className="relative">
                    <RadioGroupItem value={layout.value} id={`layout-${layout.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`layout-${layout.value}`}
                      className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-2 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 dark:border-gray-700 dark:hover:border-gray-600 dark:peer-data-[state=checked]:border-purple-500"
                    >
                      <span className="text-xs">{layout.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="headers">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4 text-purple-500" />
              <span>Header Style</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <Label className="text-xs">Section Header Style</Label>
              <RadioGroup
                value={customization.headerStyle || "classic"}
                onValueChange={(value) => handleCustomizationChange({ headerStyle: value })}
                className="grid grid-cols-2 gap-2"
              >
                {headerStyleOptions.map((style) => (
                  <div key={style.name} className="relative">
                    <RadioGroupItem value={style.value} id={`header-${style.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`header-${style.value}`}
                      className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-2 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 dark:border-gray-700 dark:hover:border-gray-600 dark:peer-data-[state=checked]:border-purple-500"
                    >
                      <span className="text-xs">{style.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sectionStyle">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-purple-500" />
              <span>Section Style</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <Label className="text-xs">Content Section Style</Label>
              <RadioGroup
                value={customization.sectionStyle || "standard"}
                onValueChange={(value) => handleCustomizationChange({ sectionStyle: value })}
                className="grid grid-cols-2 gap-2"
              >
                {sectionStyleOptions.map((style) => (
                  <div key={style.name} className="relative">
                    <RadioGroupItem value={style.value} id={`section-${style.value}`} className="peer sr-only" />
                    <Label
                      htmlFor={`section-${style.value}`}
                      className="flex cursor-pointer items-center justify-center rounded-md border border-gray-200 p-2 hover:border-gray-300 peer-data-[state=checked]:border-purple-600 dark:border-gray-700 dark:hover:border-gray-600 dark:peer-data-[state=checked]:border-purple-500"
                    >
                      <span className="text-xs">{style.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sections">
          <AccordionTrigger className="py-3 text-sm">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-purple-500" />
              <span>Section Order</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Drag and drop sections to reorder them on your resume
              </p>
              <div className="space-y-2 rounded-md border border-gray-200 p-3 dark:border-gray-700">
                {customization.sectionOrder.map((section, index) => (
                  <div
                    key={section}
                    className="flex cursor-move items-center justify-between rounded-md bg-gray-50 p-2 dark:bg-gray-800"
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", index.toString())
                      e.currentTarget.classList.add("opacity-50")
                    }}
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add("bg-gray-100", "dark:bg-gray-700")
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove("bg-gray-100", "dark:bg-gray-700")
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove("bg-gray-100", "dark:bg-gray-700")
                      const sourceIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
                      const targetIndex = index

                      if (sourceIndex !== targetIndex) {
                        const newOrder = [...customization.sectionOrder]
                        const [movedItem] = newOrder.splice(sourceIndex, 1)
                        newOrder.splice(targetIndex, 0, movedItem)

                        handleCustomizationChange({ sectionOrder: newOrder })
                      }
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove("opacity-50")
                    }}
                  >
                    <span className="text-sm capitalize">{section}</span>
                    <div className="flex items-center gap-1 text-gray-400">
                      <span className="text-xs">{index + 1}</span>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 8H12M4 4H12M4 12H12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
