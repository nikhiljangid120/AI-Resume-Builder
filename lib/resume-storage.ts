import type { ResumeData } from "./types"

export const RESUME_STORAGE_KEY = "resumeRocketData_v2"
const LEGACY_STORAGE_KEYS = ["resumeData"] as const

/** Old default sample identities that should be replaced with current defaults. */
const STALE_SAMPLE_NAMES = ["nikhil jangid"]

function isStaleSample(data: Partial<ResumeData> | null | undefined): boolean {
  const name = data?.personalInfo?.name?.trim().toLowerCase() ?? ""
  const email = data?.personalInfo?.email?.trim().toLowerCase() ?? ""
  return (
    STALE_SAMPLE_NAMES.includes(name) ||
    email.includes("nikhil.jangid") ||
    email.includes("nikhiljangid")
  )
}

export function loadStoredResumeData(defaultData: ResumeData): ResumeData {
  if (typeof window === "undefined") return defaultData

  try {
    let raw = localStorage.getItem(RESUME_STORAGE_KEY)

    if (!raw) {
      for (const key of LEGACY_STORAGE_KEYS) {
        const legacy = localStorage.getItem(key)
        if (legacy) {
          raw = legacy
          break
        }
      }
    }

    if (!raw) return defaultData

    const parsed = JSON.parse(raw) as Partial<ResumeData>

    if (isStaleSample(parsed)) {
      clearStoredResumeData()
      saveStoredResumeData(defaultData)
      return { ...defaultData }
    }

    return {
      personalInfo: { ...defaultData.personalInfo, ...parsed.personalInfo },
      skills: Array.isArray(parsed.skills) ? parsed.skills : defaultData.skills,
      experience: Array.isArray(parsed.experience) ? parsed.experience : defaultData.experience,
      education: Array.isArray(parsed.education) ? parsed.education : defaultData.education,
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultData.projects,
      customization: { ...defaultData.customization, ...parsed.customization },
    }
  } catch (error) {
    console.error("Error loading resume data from localStorage:", error)
    return defaultData
  }
}

export function saveStoredResumeData(data: ResumeData) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(data))
    for (const key of LEGACY_STORAGE_KEYS) {
      localStorage.removeItem(key)
    }
  } catch (error) {
    console.error("Error saving resume data to localStorage:", error)
  }
}

export function clearStoredResumeData() {
  if (typeof window === "undefined") return
  localStorage.removeItem(RESUME_STORAGE_KEY)
  for (const key of LEGACY_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}
