import type { Template, ThemeOption, FontOption, SpacingOption, FontSizeOption } from "./types"

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    description: "A sleek, professional layout with vibrant color accents, perfect for showcasing your skills with a contemporary flair.",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "A clean, distraction-free design that emphasizes content with subtle elegance, ideal for professionals who value simplicity.",
    thumbnail: "https://images.unsplash.com/photo-1518655048521-f130df041f17?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "ats-optimized",
    name: "ATS Friendly",
    description: "A streamlined template optimized for Applicant Tracking Systems, ensuring your resume passes automated screenings with ease.",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "creative",
    name: "Creative",
    description: "A bold, visually striking template designed to make your resume pop, perfect for creative industries like design and media.",
    thumbnail: "https://images.unsplash.com/photo-1519337265831-57f932983011?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "executive",
    name: "Executive",
    description: "A sophisticated, high-impact template tailored for senior professionals, exuding authority and professionalism.",
    thumbnail: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "tech",
    name: "Tech",
    description: "A cutting-edge template crafted for tech professionals, with a modern layout that highlights technical skills and projects.",
    thumbnail: "https://images.unsplash.com/photo-1516321165247-7b391f2e7f56?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "A refined template with graceful typography and a polished layout, ideal for those seeking a timeless, upscale look.",
    thumbnail: "https://images.unsplash.com/photo-1517816428104-797678c7a6ae?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "professional",
    name: "Professional",
    description: "A classic, no-nonsense template that delivers a polished, traditional look for professionals across industries.",
    thumbnail: "https://images.unsplash.com/photo-1454166155302-ef4863c27e17?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "academic",
    name: "Academic",
    description: "A scholarly template designed for educators and researchers, with a focus on publications and academic achievements.",
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1b8e796f7f80?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
  {
    id: "designer",
    name: "Designer",
    description: "A visually dynamic template tailored for designers, showcasing your portfolio with bold layouts and creative typography.",
    thumbnail: "https://images.unsplash.com/photo-1518976029216-0ab179869b8b?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80",
  },
]

export const themeOptions: ThemeOption[] = [
  { 
    name: "Purple Passion", 
    primaryColor: "#9333ea", 
    secondaryColor: "#d8b4fe",
    thumbnail: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Ocean Blue", 
    primaryColor: "#2563eb", 
    secondaryColor: "#93c5fd",
    thumbnail: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Forest Green", 
    primaryColor: "#16a34a", 
    secondaryColor: "#86efac",
    thumbnail: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Crimson Red", 
    primaryColor: "#dc2626", 
    secondaryColor: "#fca5a5",
    thumbnail: "https://images.unsplash.com/photo-1519750783826-e2420f4d687f?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Sunset Orange", 
    primaryColor: "#ea580c", 
    secondaryColor: "#fdba74",
    thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&fit=crop&w=120&h=120&qshield:Unsplash80"
  },
  { 
    name: "Teal Tide", 
    primaryColor: "#0d9488", 
    secondaryColor: "#5eead4",
    thumbnail: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Slate Gray", 
    primaryColor: "#4b5563", 
    secondaryColor: "#d1d5db",
    thumbnail: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Blush Pink", 
    primaryColor: "#db2777", 
    secondaryColor: "#f9a8d4",
    thumbnail: "https://images.unsplash.com/photo-1525498128493-380d1990a112?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Indigo Night", 
    primaryColor: "#4f46e5", 
    secondaryColor: "#a5b4fc",
    thumbnail: "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Golden Amber", 
    primaryColor: "#d97706", 
    secondaryColor: "#fed7aa",
    thumbnail: "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
]

export const fontOptions: FontOption[] = [
  { 
    name: "Inter (Sans-serif)", 
    value: "Inter, sans-serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Roboto (Sans-serif)", 
    value: "Roboto, sans-serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Open Sans (Sans-serif)", 
    value: "Open Sans, sans-serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Merriweather (Serif)", 
    value: "Merriweather, serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Playfair Display (Serif)", 
    value: "Playfair Display, serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Montserrat (Sans-serif)", 
    value: "Montserrat, sans-serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Lato (Sans-serif)", 
    value: "Lato, sans-serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Georgia (Serif)", 
    value: "Georgia, serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Poppins (Sans-serif)", 
    value: "Poppins, sans-serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Source Serif Pro (Serif)", 
    value: "Source Serif Pro, serif",
    thumbnail: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
]

export const spacingOptions: SpacingOption[] = [
  { 
    name: "Very Compact", 
    value: "very-compact",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Compact", 
    value: "compact",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Normal", 
    value: "normal",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Relaxed", 
    value: "relaxed",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Spacious", 
    value: "spacious",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Very Spacious", 
    value: "very-spacious",
    thumbnail: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
]

export const fontSizeOptions: FontSizeOption[] = [
  { 
    name: "Extra Small", 
    value: "xs",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Small", 
    value: "small",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Medium", 
    value: "medium",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Large", 
    value: "large",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
  { 
    name: "Extra Large", 
    value: "xl",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&fit=crop&w=120&h=120&q=80"
  },
]

export const defaultCustomization = {
  primaryColor: "#2563eb", // Ocean Blue
  secondaryColor: "#93c5fd",
  fontFamily: "Poppins, sans-serif",
  fontSize: "medium",
  spacing: "normal",
  showBulletPoints: true,
  sectionOrder: ["personalInfo", "skills", "experience", "education", "projects"],
}