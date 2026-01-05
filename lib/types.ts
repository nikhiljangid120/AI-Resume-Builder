export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  website: string
  summary: string
}

export interface Skill {
  name: string
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface Experience {
  company: string
  position: string
  startDate: string
  endDate: string
  location: string
  description: string
  achievements: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  startDate: string
  endDate: string
  location: string
  description: string
}

export interface Project {
  name: string
  description: string
  technologies: string
  link: string
  startDate: string
  endDate: string
  achievements: string[]
}

export interface ResumeData {
  personalInfo: PersonalInfo
  skills: SkillCategory[]
  experience: Experience[]
  education: Education[]
  projects: Project[]
  customization?: ResumeCustomization
}

export interface Template {
  id: string
  name: string
  description: string
  thumbnail?: string
}

export interface ResumeCustomization {
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  fontSize: string
  spacing: string
  showBulletPoints: boolean
  sectionOrder: string[]
  layout?: string
  headerStyle?: string
  sectionStyle?: string
}

export interface ThemeOption {
  name: string
  primaryColor: string
  secondaryColor: string
  thumbnail?: string
  accentColor?: string
  darkMode?: { primaryColor: string; secondaryColor: string }
  cssVariables?: Record<string, string>
}

export interface FontOption {
  name: string
  value: string
  thumbnail?: string
  weights?: string[]
  googleFont?: string
}

export interface SpacingOption {
  name: string
  value: string
  thumbnail?: string
  css?: Record<string, string>
}

export interface FontSizeOption {
  name: string
  value: string
  thumbnail?: string
  css?: { base: string; heading: string }
}
