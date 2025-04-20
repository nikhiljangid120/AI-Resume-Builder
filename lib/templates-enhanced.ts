import type { Template, ThemeOption, FontOption, SpacingOption, FontSizeOption } from "./types"

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "A sleek, professional template with vibrant accents, ideal for tech and creative industries.",
    thumbnail: "/templates/modern/thumbnail.png",
    previewUrl: "/templates/modern/preview",
    category: ["professional", "tech", "creative"],
    compatibility: { ats: true, print: true, digital: true },
    recommendedFor: ["software engineers", "designers", "marketing professionals"]
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and distraction-free, perfect for showcasing content with elegant simplicity.",
    thumbnail: "/templates/minimal/thumbnail.png",
    previewUrl: "/templates/minimal/preview",
    category: ["minimalist", "professional"],
    compatibility: { ats: true, print: true, digital: true },
    recommendedFor: ["writers", "consultants", "academics"]
  },
  {
    id: "ats-optimized",
    name: "ATS Friendly",
    description: "Designed for maximum compatibility with Applicant Tracking Systems while maintaining professional aesthetics.",
    thumbnail: "/templates/ats-optimized/thumbnail.png",
    previewUrl: "/templates/ats-optimized/preview",
    category: ["professional", "corporate"],
    compatibility: { ats: true, print: true, digital: false },
    recommendedFor: ["corporate roles", "government positions"]
  },
  {
    id: "creative",
    name: "Creative",
    description: "Bold and visually striking, perfect for standing out in creative fields.",
    thumbnail: "/templates/creative/thumbnail.png",
    previewUrl: "/templates/creative/preview",
    category: ["creative", "artistic"],
    compatibility: { ats: false, print: true, digital: true },
    recommendedFor: ["graphic designers", "artists", "media professionals"]
  },
  {
    id: "executive",
    name: "Executive",
    description: "Sophisticated and authoritative, tailored for senior leadership positions.",
    thumbnail: "/templates/executive/thumbnail.png",
    previewUrl: "/templates/executive/preview",
    category: ["professional", "leadership"],
    compatibility: { ats: true, print: true, digital: true },
    recommendedFor: ["C-level executives", "senior managers"]
  },
  {
    id: "tech",
    name: "Tech",
    description: "Futuristic design with technical elements, ideal for tech industry professionals.",
    thumbnail: "/templates/tech/thumbnail.png",
    previewUrl: "/templates/tech/preview",
    category: ["tech", "modern"],
    compatibility: { ats: true, print: true, digital: true },
    recommendedFor: ["developers", "data scientists", "IT professionals"]
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Refined typography and subtle accents for a polished, professional look.",
    thumbnail: "/templates/elegant/thumbnail.png",
    previewUrl: "/templates/elegant/preview",
    category: ["professional", "classic"],
    compatibility: { ats: true, print: true, digital: true },
    recommendedFor: ["lawyers", "financial advisors", "consultants"]
  },
  {
    id: "professional",
    name: "Professional",
    description: "Traditional layout with modern touches, suitable for all industries.",
    thumbnail: "/templates/professional/thumbnail.png",
    previewUrl: "/templates/professional/preview",
    category: ["professional", "classic"],
    compatibility: { ats: true, print: true, digital: true },
    recommendedFor: ["general professionals", "administrative roles"]
  },
  {
    id: "compact",
    name: "Compact",
    description: "Optimized for dense content, fitting more information in less space.",
    thumbnail: "/templates/compact/thumbnail.png",
    previewUrl: "/templates/compact/preview",
    category: ["professional", "dense"],
    compatibility: { ats: true, print: true, digital: true },
    recommendedFor: ["experienced professionals", "academics"]
  },
  {
    id: "modern-dark",
    name: "Modern Dark",
    description: "Dark-themed with vibrant accents, ideal for digital-first presentations.",
    thumbnail: "/templates/modern-dark/thumbnail.png",
    previewUrl: "/templates/modern-dark/preview",
    category: ["modern", "digital"],
    compatibility: { ats: false, print: false, digital: true },
    recommendedFor: ["digital marketers", "UI/UX designers"]
  },
  {
    id: "gradient",
    name: "Gradient",
    description: "Subtle gradient backgrounds with modern typography for a contemporary look.",
    thumbnail: "/templates/gradient/thumbnail.png",
    previewUrl: "/templates/gradient/preview",
    category: ["modern", "creative"],
    compatibility: { ats: false, print: true, digital: true },
    recommendedFor: ["startups", "entrepreneurs"]
  },
  {
    id: "timeline",
    name: "Timeline",
    description: "Unique timeline layout to showcase career progression visually.",
    thumbnail: "/templates/timeline/thumbnail.png",
    previewUrl: "/templates/timeline/preview",
    category: ["creative", "modern"],
    compatibility: { ats: false, print: true, digital: true },
    recommendedFor: ["project managers", "career switchers"]
  }
]

export const themeOptions: ThemeOption[] = [
  { 
    name: "Purple", 
    primaryColor: "#9333ea", 
    secondaryColor: "#d8b4fe", 
    accentColor: "#f3e8ff",
    darkMode: { primaryColor: "#a855f7", secondaryColor: "#e9d5ff" },
    cssVariables: {
      "--primary": "#9333ea",
      "--secondary": "#d8b4fe",
      "--accent": "#f3e8ff"
    }
  },
  { 
    name: "Blue", 
    primaryColor: "#2563eb", 
    secondaryColor: "#93c5fd", 
    accentColor: "#dbeafe",
    darkMode: { primaryColor: "#3b82f6", secondaryColor: "#bfdbfe" },
    cssVariables: {
      "--primary": "#2563eb",
      "--secondary": "#93c5fd",
      "--accent": "#dbeafe"
    }
  },
  // ... (similar structure for other themes)
]

export const fontOptions: FontOption[] = [
  { 
    name: "Inter (Sans-serif)", 
    value: "Inter, sans-serif",
    weights: ["300", "400", "500", "600", "700"],
    googleFont: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
  },
  { 
    name: "Roboto (Sans-serif)", 
    value: "Roboto, sans-serif",
    weights: ["300", "400", "500", "700"],
    googleFont: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
  },
  // ... (similar structure for other fonts)
]

export const spacingOptions: SpacingOption[] = [
  { name: "Very Compact", value: "very-compact", css: { lineHeight: "1.2", margin: "0.5rem" } },
  { name: "Compact", value: "compact", css: { lineHeight: "1.3", margin: "0.75rem" } },
  { name: "Normal", value: "normal", css: { lineHeight: "1.5", margin: "1rem" } },
  { name: "Relaxed", value: "relaxed", css: { lineHeight: "1.7", margin: "1.25rem" } },
  { name: "Spacious", value: "spacious", css: { lineHeight: "1.9", margin: "1.5rem" } },
  { name: "Very Spacious", value: "very-spacious", css: { lineHeight: "2.1", margin: "2rem" } }
]

export const fontSizeOptions: FontSizeOption[] = [
  { name: "Extra Small", value: "xs", css: { base: "12px", heading: "16px" } },
  { name: "Small", value: "small", css: { base: "14px", heading: "18px" } },
  { name: "Medium", value: "medium", css: { base: "16px", heading: "20px" } },
  { name: "Large", value: "large", css: { base: "18px", heading: "24px" } },
  { name: "Extra Large", value: "xl", css: { base: "20px", heading: "28px" } }
]

export const layoutOptions = [
  { name: "Standard", value: "standard", cssClass: "layout-standard" },
  { name: "Two Column", value: "two-column", cssClass: "layout-two-column" },
  { name: "Sidebar Left", value: "sidebar-left", cssClass: "layout-sidebar-left" },
  { name: "Sidebar Right", value: "sidebar-right", cssClass: "layout-sidebar-right" },
  { name: "Minimalist", value: "minimalist", cssClass: "layout-minimalist" },
  { name: "Modern Split", value: "modern-split", cssClass: "layout-modern-split" }
]

export const headerStyleOptions = [
  { name: "Classic", value: "classic", cssClass: "header-classic" },
  { name: "Centered", value: "centered", cssClass: "header-centered" },
  { name: "Minimal", value: "minimal", cssClass: "header-minimal" },
  { name: "Bold", value: "bold", cssClass: "header-bold" },
  { name: "Underlined", value: "underlined", cssClass: "header-underlined" },
  { name: "Boxed", value: "boxed", cssClass: "header-boxed" }
]

export const sectionStyleOptions = [
  { name: "Standard", value: "standard", cssClass: "section-standard" },
  { name: "Bordered", value: "bordered", cssClass: "section-bordered" },
  { name: "Underlined", value: "underlined", cssClass: "section-underlined" },
  { name: "Card", value: "card", cssClass: "section-card" },
  { name: "Minimal", value: "minimal", cssClass: "section-minimal" },
  { name: "Bold Headers", value: "bold-headers", cssClass: "section-bold-headers" }
]

export const defaultCustomization = {
  primaryColor: "#9333ea",
  secondaryColor: "#d8b4fe",
  accentColor: "#f3e8ff",
  fontFamily: "Inter, sans-serif",
  fontSize: "medium",
  spacing: "normal",
  showBulletPoints: true,
  layout: "standard",
  headerStyle: "classic",
  sectionStyle: "standard",
  sectionOrder: ["personalInfo", "skills", "experience", "education", "projects"],
  darkMode: false
}

export const validateCustomization = (customization: typeof defaultCustomization) => {
  const errors: string[] = []

  if (!themeOptions.some(theme => theme.primaryColor === customization.primaryColor)) {
    errors.push("Invalid primary color")
  }
  if (!fontOptions.some(font => font.value === customization.fontFamily)) {
    errors.push("Invalid font family")
  }
  if (!fontSizeOptions.some(size => size.value === customization.fontSize)) {
    errors.push("Invalid font size")
  }
  if (!spacingOptions.some(spacing => spacing.value === customization.spacing)) {
    errors.push("Invalid spacing")
  }
  if (!layoutOptions.some(layout => layout.value === customization.layout)) {
    errors.push("Invalid layout")
  }
  if (!headerStyleOptions.some(header => header.value === customization.headerStyle)) {
    errors.push("Invalid header style")
  }
  if (!sectionStyleOptions.some(section => section.value === customization.sectionStyle)) {
    errors.push("Invalid section style")
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}