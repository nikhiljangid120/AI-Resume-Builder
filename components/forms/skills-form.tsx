"use client"

import { useState } from "react"
import type { SkillCategory } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SkillsFormProps {
  skills: SkillCategory[]
  onDataChange: (skills: SkillCategory[]) => void
}

export function SkillsForm({ skills, onDataChange }: SkillsFormProps) {
  const [newSkill, setNewSkill] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(skills[0]?.name || "Core")

  const handleAddSkill = () => {
    if (!newSkill.trim()) return

    const updatedSkills = [...skills]
    const categoryIndex = updatedSkills.findIndex((category) => category.name === selectedCategory)

    if (categoryIndex === -1) {
      // Create new category if it doesn't exist
      updatedSkills.push({
        name: selectedCategory,
        skills: [{ name: newSkill }],
      })
    } else {
      // Add to existing category
      updatedSkills[categoryIndex].skills.push({ name: newSkill })
    }

    onDataChange(updatedSkills)
    setNewSkill("")
  }

  const handleRemoveSkill = (categoryIndex: number, skillIndex: number) => {
    const updatedSkills = [...skills]
    updatedSkills[categoryIndex].skills.splice(skillIndex, 1)

    // Remove category if empty
    if (updatedSkills[categoryIndex].skills.length === 0) {
      updatedSkills.splice(categoryIndex, 1)
    }

    onDataChange(updatedSkills)
  }

  const handleAddCategory = () => {
    const categoryName = prompt("Enter new category name:")
    if (!categoryName?.trim()) return

    const updatedSkills = [...skills]
    updatedSkills.push({
      name: categoryName,
      skills: [],
    })

    onDataChange(updatedSkills)
    setSelectedCategory(categoryName)
  }

  return (
    <div className="space-y-6">
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
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {skills.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
              <SelectItem value="__new__" className="text-purple-600">
                + Add new category
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddSkill} className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="space-y-4">
        {skills.map((category, categoryIndex) => (
          <Card key={category.name}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No skills added yet. Add your first skill above.</p>
        </div>
      )}
    </div>
  )
}
