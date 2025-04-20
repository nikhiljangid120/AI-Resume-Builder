"use client"

import type React from "react"

import { useToast } from "@/hooks/use-toast"
import type { ResumeData } from "@/lib/types"
import { useCallback } from "react"

interface UseResumeBuilderProps {
  resumeData: ResumeData
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>
}

export default function useResumeBuilder({ resumeData, setResumeData }: UseResumeBuilderProps) {
  const { toast } = useToast()

  // Handle resume data extraction from uploaded file
  const handleResumeDataExtracted = useCallback(
    (data: Partial<ResumeData>) => {
      // Check if we received any meaningful data
      if (!data || Object.keys(data).length === 0) {
        toast({
          title: "Extraction Failed",
          description: "Could not extract data from the uploaded resume. Please try a different file.",
          variant: "destructive",
        })
        return
      }

      // Merge extracted data with current data
      setResumeData((prev) => {
        const updated = { ...prev }

        // Merge personal info
        if (data.personalInfo) {
          updated.personalInfo = {
            ...updated.personalInfo,
            ...Object.fromEntries(
              Object.entries(data.personalInfo).filter(([_, value]) => value && value.trim() !== ""),
            ),
          }
        }

        // Merge skills - add new skills to existing categories or create new ones
        if (data.skills && data.skills.length > 0) {
          // If no skills exist yet, use the extracted ones
          if (!updated.skills || updated.skills.length === 0) {
            updated.skills = data.skills
          } else {
            // Otherwise, merge skills intelligently
            data.skills.forEach((category) => {
              // Check if a similar category exists
              const existingCategory = updated.skills.find((c) => c.name.toLowerCase() === category.name.toLowerCase())

              if (existingCategory) {
                // Add new skills to existing category
                category.skills.forEach((skill) => {
                  if (!existingCategory.skills.some((s) => s.name.toLowerCase() === skill.name.toLowerCase())) {
                    existingCategory.skills.push(skill)
                  }
                })
              } else {
                // Add new category
                updated.skills.push(category)
              }
            })
          }
        }

        // Merge experience - add new experiences
        if (data.experience && data.experience.length > 0) {
          // If no experience exists yet, use the extracted ones
          if (!updated.experience || updated.experience.length === 0) {
            updated.experience = data.experience
          } else {
            // Otherwise, add new experiences that don't seem to exist already
            data.experience.forEach((exp) => {
              // Only add if both company and position are not empty
              if (exp.company.trim() && exp.position.trim()) {
                const exists = updated.experience.some(
                  (e) =>
                    e.company.toLowerCase() === exp.company.toLowerCase() &&
                    e.position.toLowerCase() === exp.position.toLowerCase(),
                )

                if (!exists) {
                  updated.experience.push(exp)
                }
              }
            })
          }
        }

        // Merge education - add new education entries
        if (data.education && data.education.length > 0) {
          // If no education exists yet, use the extracted ones
          if (!updated.education || updated.education.length === 0) {
            updated.education = data.education
          } else {
            // Otherwise, add new education entries that don't seem to exist already
            data.education.forEach((edu) => {
              // Only add if institution is not empty
              if (edu.institution.trim()) {
                const exists = updated.education.some(
                  (e) =>
                    e.institution.toLowerCase() === edu.institution.toLowerCase() &&
                    (e.degree.toLowerCase() === edu.degree.toLowerCase() || !edu.degree.trim()),
                )

                if (!exists) {
                  updated.education.push(edu)
                }
              }
            })
          }
        }

        // Merge projects - add new projects
        if (data.projects && data.projects.length > 0) {
          // If no projects exist yet, use the extracted ones
          if (!updated.projects || updated.projects.length === 0) {
            updated.projects = data.projects
          } else {
            // Otherwise, add new projects that don't seem to exist already
            data.projects.forEach((proj) => {
              // Only add if name is not empty
              if (proj.name.trim()) {
                const exists = updated.projects.some((p) => p.name.toLowerCase() === proj.name.toLowerCase())

                if (!exists) {
                  updated.projects.push(proj)
                }
              }
            })
          }
        }

        // Save to localStorage
        localStorage.setItem("resumeData", JSON.stringify(updated))

        // Show success message after the state update is complete
        setTimeout(() => {
          toast({
            title: "Resume Data Imported",
            description: "Your resume data has been successfully imported and merged with existing data.",
            variant: "success",
          })
        }, 0)

        return updated
      })
    },
    [setResumeData, toast],
  )

  // Add a new function to handle data alignment
  const handleDataAlignment = useCallback(
    (data: Partial<ResumeData>) => {
      // Update the resume data with the aligned data
      setResumeData((prev) => {
        // Create a deep copy of the previous state to avoid reference issues
        const prevCopy = JSON.parse(JSON.stringify(prev))

        // Create a new object with the merged data
        const updated = {
          ...prevCopy,
          // Handle nested objects properly
          personalInfo: data.personalInfo ? { ...prevCopy.personalInfo, ...data.personalInfo } : prevCopy.personalInfo,
          skills: data.skills || prevCopy.skills,
          experience: data.experience || prevCopy.experience,
          education: data.education || prevCopy.education,
          projects: data.projects || prevCopy.projects,
          // Handle customization specially to ensure all properties are preserved
          customization: data.customization
            ? { ...prevCopy.customization, ...data.customization }
            : prevCopy.customization,
        }

        // Save to localStorage with proper error handling
        try {
          localStorage.setItem("resumeData", JSON.stringify(updated))
          console.log("Resume data saved successfully:", updated)
        } catch (error) {
          console.error("Error saving resume data to localStorage:", error)
          toast({
            title: "Save Error",
            description: "There was an error saving your data. Please try again.",
            variant: "destructive",
          })
        }

        return updated
      })

      // Show success message
      toast({
        title: "Data Updated",
        description: "Your resume data has been successfully updated and saved.",
        variant: "success",
      })
    },
    [setResumeData, toast],
  )

  // Return the new function in the hook
  return {
    handleResumeDataExtracted,
    handleDataAlignment,
  }
}
