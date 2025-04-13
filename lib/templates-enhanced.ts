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
  {
    id: "compact",
    name: "Compact",
    description: "Fits more content on a single page",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "A sleek dark-themed modern template",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Features subtle gradient accents",
    thumbnail: "/placeholder.svg?height=120&width=120",
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Presents experience in a timeline format",
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
  { name: "Indigo", primaryColor: "#4f46e5", secondaryColor: "#a5b4fc" },
  { name: "Amber", primaryColor: "#d97706", secondaryColor: "#fcd34d" },
  { name: "Emerald", primaryColor: "#059669", secondaryColor: "#6ee7b7" },
  { name: "Rose", primaryColor: "#e11d48", secondaryColor: "#fda4af" },
  { name: "Slate", primaryColor: "#334155", secondaryColor: "#94a3b8" },
  { name: "Violet", primaryColor: "#7c3aed", secondaryColor: "#c4b5fd" },
  { name: "Cyan", primaryColor: "#0891b2", secondaryColor: "#67e8f9" },
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
  { name: "Poppins (Sans-serif)", value: "Poppins, sans-serif" },
  { name: "Raleway (Sans-serif)", value: "Raleway, sans-serif" },
  { name: "Source Sans Pro (Sans-serif)", value: "Source Sans Pro, sans-serif" },
  { name: "Nunito (Sans-serif)", value: "Nunito, sans-serif" },
  { name: "Garamond (Serif)", value: "Garamond, serif" },
  { name: "Helvetica (Sans-serif)", value: "Helvetica, Arial, sans-serif" },
  { name: "Futura (Sans-serif)", value: "Futura, sans-serif" },
]

export const spacingOptions: SpacingOption[] = [
  { name: "Very Compact", value: "very-compact" },
  { name: "Compact", value: "compact" },
  { name: "Normal", value: "normal" },
  { name: "Relaxed", value: "relaxed" },
  { name: "Spacious", value: "spacious" },
  { name: "Very Spacious", value: "very-spacious" },
]

export const fontSizeOptions: FontSizeOption[] = [
  { name: "Extra Small", value: "xs" },
  { name: "Small", value: "small" },
  { name: "Medium", value: "medium" },
  { name: "Large", value: "large" },
  { name: "Extra Large", value: "xl" },
]

export const layoutOptions = [
  { name: "Standard", value: "standard" },
  { name: "Two Column", value: "two-column" },
  { name: "Sidebar Left", value: "sidebar-left" },
  { name: "Sidebar Right", value: "sidebar-right" },
  { name: "Minimalist", value: "minimalist" },
  { name: "Modern Split", value: "modern-split" },
]

export const headerStyleOptions = [
  { name: "Classic", value: "classic" },
  { name: "Centered", value: "centered" },
  { name: "Minimal", value: "minimal" },
  { name: "Bold", value: "bold" },
  { name: "Underlined", value: "underlined" },
  { name: "Boxed", value: "boxed" },
]

export const sectionStyleOptions = [
  { name: "Standard", value: "standard" },
  { name: "Bordered", value: "bordered" },
  { name: "Underlined", value: "underlined" },
  { name: "Card", value: "card" },
  { name: "Minimal", value: "minimal" },
  { name: "Bold Headers", value: "bold-headers" },
]

export const defaultCustomization = {
  primaryColor: "#9333ea", // Purple
  secondaryColor: "#d8b4fe",
  fontFamily: "Inter, sans-serif",
  fontSize: "medium",
  spacing: "normal",
  showBulletPoints: true,
  layout: "standard",
  headerStyle: "classic",
  sectionStyle: "standard",
  sectionOrder: ["personalInfo", "skills", "experience", "education", "projects"],
}
