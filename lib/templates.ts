import type { Template, ThemeOption, FontOption, SpacingOption, FontSizeOption } from "./types"

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "A clean, professional template with a touch of color",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A simple, elegant template with minimal styling",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "ats-optimized",
    name: "ATS Friendly",
    description: "Optimized for Applicant Tracking Systems",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "creative",
    name: "Creative",
    description: "A bold, creative template to stand out",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "executive",
    name: "Executive",
    description: "A sophisticated template for senior professionals",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "tech",
    name: "Tech",
    description: "A modern template for tech professionals",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "A refined template with elegant typography",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "professional",
    name: "Professional",
    description: "A traditional professional template",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
]

export const themeOptions: ThemeOption[] = [
  { name: "Purple", primaryColor: "#9333ea", secondaryColor: "#d8b4fe" },
  { name: "Blue", primaryColor: "#2563eb", secondaryColor: "#93c5fd" },
  { name: "Green", primaryColor: "#16a34a", secondaryColor: "#86efac" },
  { name: "Red", primaryColor: "#dc2626", secondaryColor: "#fca5a5" },
  { name: "Orange", primaryColor: "#ea580c", secondaryColor: "#fdba74" },
  { name: "Teal", primaryColor: "#0d9488", secondaryColor: "#5eead4" },
  { name: "Gray", primaryColor: "#4b5563", secondaryColor: "#d1d5db" },
  { name: "Pink", primaryColor: "#db2777", secondaryColor: "#f9a8d4" },
]

export const fontOptions: FontOption[] = [
  { name: "Inter (Sans-serif)", value: "Inter, sans-serif" },
  { name: "Roboto (Sans-serif)", value: "Roboto, sans-serif" },
  { name: "Open Sans (Sans-serif)", value: "Open Sans, sans-serif" },
  { name: "Merriweather (Serif)", value: "Merriweather, serif" },
  { name: "Playfair Display (Serif)", value: "Playfair Display, serif" },
  { name: "Montserrat (Sans-serif)", value: "Montserrat, sans-serif" },
  { name: "Lato (Sans-serif)", value: "Lato, sans-serif" },
  { name: "Georgia (Serif)", value: "Georgia, serif" },
]

export const spacingOptions: SpacingOption[] = [
  { name: "Compact", value: "compact" },
  { name: "Normal", value: "normal" },
  { name: "Relaxed", value: "relaxed" },
  { name: "Spacious", value: "spacious" },
]

export const fontSizeOptions: FontSizeOption[] = [
  { name: "Small", value: "small" },
  { name: "Medium", value: "medium" },
  { name: "Large", value: "large" },
]

export const defaultCustomization = {
  primaryColor: "#9333ea", // Purple
  secondaryColor: "#d8b4fe",
  fontFamily: "Inter, sans-serif",
  fontSize: "medium",
  spacing: "normal",
  showBulletPoints: true,
  sectionOrder: ["personalInfo", "skills", "experience", "education", "projects"],
}
