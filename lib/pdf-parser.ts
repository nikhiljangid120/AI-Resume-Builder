import type { ResumeData, Experience, Education, Project, SkillCategory } from "./types"
// Add import for OCR service
import { isPdfScanned, processScannedPdf } from "./ocr-service"

// Main function to parse PDF files
export async function parsePdfResume(file: File): Promise<string> {
  try {
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()

    // Try multiple parsing approaches in sequence
    let extractedText = ""

    console.log("Starting PDF extraction process")

    // Approach 1: Use pdf.js with enhanced configuration
    try {
      console.log("Trying PDF.js approach")
      const pdfjs = await import("pdfjs-dist")

      // Set worker source
      // @ts-ignore
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs")
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker.default

      // Load the PDF document with enhanced configuration
      const loadingTask = pdfjs.getDocument({
        data: arrayBuffer,
        nativeImageDecoderSupport: "display",
        ignoreErrors: true,
        disableFontFace: true,
        isEvalSupported: false,
        useSystemFonts: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@4.0.379/standard_fonts/`,
      })

      const pdf = await loadingTask.promise
      console.log(`PDF loaded with ${pdf.numPages} pages`)

      let fullText = ""

      // Extract text from each page with advanced options
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)

        // Get text content with enhanced options
        const textContent = await page.getTextContent({
          normalizeWhitespace: true,
          disableCombineTextItems: false,
        })

        // Process text items with their positions
        const pageText = processTextItems(textContent.items)

        fullText += pageText + "\n"
        console.log(`Extracted page ${i}/${pdf.numPages}`)
      }

      if (fullText.trim().length > 100) {
        console.log("PDF.js extraction successful")
        extractedText = fullText
      } else {
        console.log("PDF.js extraction produced insufficient text")
      }
    } catch (err) {
      console.warn("PDF.js approach failed:", err)
    }

    // Add OCR check in the parsePdfResume function, after the first approach but before the second approach
    // Add this code after the first try-catch block for PDF.js approach
    // Check if the PDF might be scanned
    if (extractedText.length < 100) {
      try {
        console.log("Checking if PDF is scanned")
        const isScanned = await isPdfScanned(arrayBuffer)

        if (isScanned) {
          console.log("PDF appears to be scanned, returning scanned PDF message")
          // Return the message from processScannedPdf directly
          return await processScannedPdf(arrayBuffer)
        }
      } catch (err) {
        console.warn("OCR approach failed:", err)
      }
    }

    // Approach 2: Use pdf-parse if PDF.js didn't work well
    if (extractedText.length < 100) {
      try {
        console.log("Trying pdf-parse approach")
        const pdfParse = await import("pdf-parse")
        const data = await pdfParse.default(Buffer.from(arrayBuffer))

        if (data.text && data.text.length > 100) {
          console.log("pdf-parse extraction successful")
          extractedText = data.text
        }
      } catch (err) {
        console.warn("pdf-parse approach failed:", err)
      }
    }

    // Approach 3: Try OCR-like text extraction for scanned PDFs
    if (extractedText.length < 100 || !isReadableText(extractedText)) {
      try {
        console.log("Trying OCR-like extraction approach")
        // This is a simplified approach since we can't use actual OCR in the browser
        // In a real implementation, you would use a service like Tesseract.js or a backend OCR service

        // For now, we'll try to extract text from PDF objects directly
        const rawText = await extractTextFromPdfObjects(arrayBuffer)

        if (rawText && rawText.length > 100 && isReadableText(rawText)) {
          console.log("OCR-like extraction successful")
          extractedText = rawText
        }
      } catch (err) {
        console.warn("OCR-like extraction approach failed:", err)
      }
    }

    // Final verification and cleanup
    if (extractedText.length < 100 || !isReadableText(extractedText)) {
      throw new Error(
        "Could not extract readable text from the PDF. The file may be scanned or in an unsupported format.",
      )
    }

    // Clean up the extracted text
    extractedText = cleanupExtractedText(extractedText)

    console.log("Text extraction complete")
    return extractedText
  } catch (error) {
    console.error("Error parsing PDF:", error)
    throw new Error(
      "Failed to parse PDF. The file may be password-protected, scanned, or in an unsupported format. Please try uploading a text-based PDF.",
    )
  }
}

// Check if text is actually readable (not just random characters)
function isReadableText(text: string): boolean {
  // Calculate the ratio of alphanumeric and common punctuation to total characters
  const readableChars = text.match(/[a-zA-Z0-9 .,;:'"!?()-]/g)?.length || 0
  const totalChars = text.length

  if (totalChars === 0) return false

  const readableRatio = readableChars / totalChars

  // Check for common words that should appear in a resume
  const commonResumeWords = ["experience", "education", "skills", "project", "work", "job", "professional"]
  const containsCommonWords = commonResumeWords.some((word) => text.toLowerCase().includes(word))

  // Text is considered readable if it has a high ratio of readable characters
  // or contains common resume words
  return readableRatio > 0.7 || containsCommonWords
}

// Process text items to maintain proper text flow and positioning
function processTextItems(items: any[]): string {
  if (!items || items.length === 0) return ""

  // Sort items by position to ensure proper text flow
  items.sort((a, b) => {
    if (Math.abs(a.transform[5] - b.transform[5]) > 5) {
      // Sort by y position first (vertical)
      return b.transform[5] - a.transform[5]
    } else {
      // Then by x position (horizontal)
      return a.transform[4] - b.transform[4]
    }
  })

  let lastY = 0
  let text = ""

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (!item.str) continue // Skip items without text

    // Add newline if significant vertical distance
    if (i > 0 && Math.abs(lastY - item.transform[5]) > 5) {
      text += "\n"
    } else if (i > 0) {
      // Otherwise add space between horizontally adjacent items
      text += " "
    }

    text += item.str
    lastY = item.transform[5]
  }

  return text
}

// Extract text directly from PDF objects
async function extractTextFromPdfObjects(arrayBuffer: ArrayBuffer): Promise<string> {
  // Convert ArrayBuffer to text to look for plain text
  const textDecoder = new TextDecoder("utf-8")
  const uint8Array = new Uint8Array(arrayBuffer)
  const pdfText = textDecoder.decode(uint8Array)

  // Combined patterns to extract text content from PDF
  const extractedParts: string[] = []

  // Pattern 1: Extract text between stream and endstream tags
  const streamRegex = /stream\s([\s\S]*?)\sendstream/g
  let match
  while ((match = streamRegex.exec(pdfText)) !== null) {
    if (match[1]) {
      // Clean binary data and keep printable ASCII
      const cleanText = match[1].replace(/[^\x20-\x7E\n\r\t]/g, " ")
      if (cleanText.length > 20 && !cleanText.includes("<?xml") && !cleanText.includes("<rdf:")) {
        extractedParts.push(cleanText)
      }
    }
  }

  // Pattern 2: Extract from content objects
  const contentRegex = /\/(Contents|Text|Content)\s*\[([\s\S]*?)\]/g
  while ((match = contentRegex.exec(pdfText)) !== null) {
    if (match[2]) {
      const cleanText = match[2].replace(/[^\x20-\x7E\n\r\t]/g, " ")
      if (cleanText.length > 20) {
        extractedParts.push(cleanText)
      }
    }
  }

  // Pattern 3: Find text fragments using common markers
  const textFragmentRegex = /\/(T[icmfdrjJ]|Tx|TEXT)[^)]*$$([^)]+)$$/g
  while ((match = textFragmentRegex.exec(pdfText)) !== null) {
    if (match[2] && match[2].length > 3) {
      extractedParts.push(match[2].replace(/\\(\d{3}|.)/g, " "))
    }
  }

  // Join all extracted parts and filter for the most readable content
  const combinedText = extractedParts.join("\n")

  // If we have a lot of text, try to find the most readable sections
  if (combinedText.length > 1000) {
    const paragraphs = combinedText.split(/\n\s*\n/)
    const readableParagraphs = paragraphs.filter((p) => p.length > 50 && isReadableText(p)).join("\n\n")

    if (readableParagraphs.length > 100) {
      return readableParagraphs
    }
  }

  return combinedText
}

// Clean up and normalize extracted text
function cleanupExtractedText(text: string): string {
  return (
    text
      // Replace excessive whitespace
      .replace(/\s+/g, " ")
      // Normalize line breaks
      .replace(/\r\n/g, "\n")
      // Replace special PDF characters
      .replace(/\\(\d{3}|.)/g, " ")
      // Clean up common PDF artifacts
      .replace(/[^\x20-\x7E\n\t]/g, "")
      // Split by lines, trim each line and remove empty lines
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
  )
}

// Extract structured data with improved detection
export function extractResumeData(text: string): Partial<ResumeData> {
  console.log("Starting resume data extraction")

  // Check if text is valid
  if (!text || text.length < 100 || !isReadableText(text)) {
    console.error("Invalid text content for resume extraction")
    return {}
  }

  // Initialize empty resume data
  const extractedData: Partial<ResumeData> = {}

  // Create personal info object
  const personalInfo = {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    summary: "",
  }

  // Extract email using regex
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emails = text.match(emailRegex)
  if (emails && emails.length > 0) {
    personalInfo.email = emails[0]
    console.log("Found email:", personalInfo.email)
  }

  // Extract phone number using improved regex
  const phoneRegex = /\b(\+\d{1,3}[-.\s]?)?([(]?\d{3}[)]?[-.\s]?\d{3}[-.\s]?\d{4})\b/g
  const phones = text.match(phoneRegex)
  if (phones && phones.length > 0) {
    personalInfo.phone = phones[0]
    console.log("Found phone:", personalInfo.phone)
  }

  // Clean text and split into lines
  const lines = text.split("\n").filter((line) => line.trim().length > 0)

  // Extract name (usually at beginning of resume)
  if (lines.length > 0) {
    // First few lines often contain the name
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i].trim()
      // Name heuristic: not too long, no special characters or numbers
      if (
        line.length > 2 &&
        line.length < 40 &&
        !line.includes("@") &&
        !line.match(/\d/) &&
        /^[A-Z][a-z]+(?: [A-Z][a-z]+){1,2}$/.test(line)
      ) {
        personalInfo.name = line
        console.log("Found name:", personalInfo.name)
        break
      }
    }

    // If no name found with strict heuristic, try less strict approach
    if (!personalInfo.name) {
      for (let i = 0; i < Math.min(3, lines.length); i++) {
        const line = lines[i].trim()
        if (line.length > 2 && line.length < 40 && !line.includes("@") && !line.match(/^\d+/)) {
          personalInfo.name = line
          console.log("Found name (alternative):", personalInfo.name)
          break
        }
      }
    }
  }

  // Extract professional title (usually follows the name)
  if (personalInfo.name && lines.length > 1) {
    const nameIndex = lines.findIndex((line) => line.includes(personalInfo.name))
    if (nameIndex !== -1 && nameIndex + 1 < lines.length) {
      const potentialTitle = lines[nameIndex + 1].trim()
      if (
        potentialTitle.length < 50 &&
        !potentialTitle.includes("@") &&
        !potentialTitle.match(/^\d+/) &&
        !emailRegex.test(potentialTitle) &&
        !phoneRegex.test(potentialTitle)
      ) {
        personalInfo.title = potentialTitle
        console.log("Found title:", personalInfo.title)
      }
    }
  }

  // Extract location using common patterns
  const locationRegex = /\b([A-Za-z\s]+,\s*[A-Za-z\s]+|[A-Za-z\s]+,\s*[A-Z]{2})\b/g
  const possibleLocations = text.match(locationRegex)
  if (possibleLocations && possibleLocations.length > 0) {
    // Filter out common non-location words
    const filteredLocations = possibleLocations.filter(
      (loc) => loc.includes(",") && !loc.match(/^(summary|experience|education|skills|projects|references)$/i),
    )
    if (filteredLocations.length > 0) {
      personalInfo.location = filteredLocations[0]
      console.log("Found location:", personalInfo.location)
    }
  }

  // Extract website/LinkedIn/GitHub
  const websiteRegex = /\b(https?:\/\/[^\s]+|linkedin\.com\/in\/[^\s]+|github\.com\/[^\s]+)\b/g
  const websites = text.match(websiteRegex)
  if (websites && websites.length > 0) {
    personalInfo.website = websites[0]
    console.log("Found website:", personalInfo.website)
  }

  // Extract summary with improved section detection
  const summarySection = extractSection(text, [
    "SUMMARY",
    "PROFESSIONAL SUMMARY",
    "PROFILE",
    "ABOUT",
    "OBJECTIVE",
    "CAREER OBJECTIVE",
  ])

  if (summarySection && summarySection.length > 20) {
    personalInfo.summary = summarySection.substring(0, 500) // Limit to 500 chars
    console.log("Found summary:", personalInfo.summary.substring(0, 50) + "...")
  }

  extractedData.personalInfo = personalInfo

  // Extract remaining sections
  extractedData.skills = extractSkills(text)
  extractedData.experience = extractExperience(text)
  extractedData.education = extractEducation(text)
  extractedData.projects = extractProjects(text)

  console.log("Resume data extraction complete")
  return extractedData
}

function extractSection(text: string, possibleHeaders: string[]): string | null {
  // Convert to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()

  // Define all possible section headers for boundary detection
  const allSectionHeaders = [
    "summary",
    "professional summary",
    "profile",
    "about",
    "objective",
    "experience",
    "work experience",
    "employment history",
    "work history",
    "education",
    "academic background",
    "qualifications",
    "skills",
    "technical skills",
    "core competencies",
    "expertise",
    "projects",
    "project experience",
    "personal projects",
    "certifications",
    "awards",
    "achievements",
    "honors",
    "publications",
    "languages",
    "interests",
    "activities",
    "references",
    "volunteer",
    "volunteering",
    "community service",
  ]

  // Try to find the specified section
  for (const header of possibleHeaders) {
    const lowerHeader = header.toLowerCase()

    // Try different patterns for section headers
    const patterns = [
      new RegExp(`\\b${lowerHeader}\\b`, "i"),
      new RegExp(`\\b${lowerHeader}:`, "i"),
      new RegExp(`\n${lowerHeader}\n`, "i"),
      new RegExp(`\n${lowerHeader}:`, "i"),
      new RegExp(`^${lowerHeader}\\b`, "im"),
    ]

    for (const pattern of patterns) {
      const match = lowerText.match(pattern)
      if (match && match.index !== undefined) {
        // Found the section header, now find where it ends
        const startIndex = match.index + match[0].length

        // Look for the next section header
        let endIndex = text.length

        for (const nextHeader of allSectionHeaders) {
          // Skip if it's the same as our current header
          if (nextHeader === lowerHeader) continue

          // Look for next header
          const nextPattern = new RegExp(
            `\\b${nextHeader}\\b|\\b${nextHeader}:|\n${nextHeader}\n|\n${nextHeader}:|^${nextHeader}\\b`,
            "i",
          )
          const nextMatch = lowerText.substring(startIndex).match(nextPattern)

          if (nextMatch && nextMatch.index !== undefined) {
            const potentialEndIndex = startIndex + nextMatch.index
            if (potentialEndIndex > startIndex && potentialEndIndex < endIndex) {
              endIndex = potentialEndIndex
            }
          }
        }

        // Extract the section content
        let sectionContent = text.substring(startIndex, endIndex).trim()

        // Clean up common formatting issues
        sectionContent = sectionContent.replace(/^\s*[:;-]\s*/, "")

        return sectionContent
      }
    }
  }

  return null
}

function extractSkills(text: string): SkillCategory[] {
  console.log("Extracting skills")

  // Extract skills section
  const skillsSection = extractSection(text, [
    "SKILLS",
    "TECHNICAL SKILLS",
    "CORE COMPETENCIES",
    "KEY SKILLS",
    "EXPERTISE",
    "TECHNOLOGIES",
  ])

  if (!skillsSection) {
    return []
  }

  console.log("Found skills section:", skillsSection.substring(0, 100) + "...")

  // Initialize categories
  const categories: Record<string, string[]> = {
    Technical: [],
    "Programming Languages": [],
    Frameworks: [],
    Tools: [],
    "Soft Skills": [],
  }

  // First attempt: Try to find explicit categories in the skills section
  const explicitCategoryPattern = /(?:^|\n)([A-Za-z\s&]+)(?::|→|-)(?:[^:]*?)(?=\n[A-Za-z\s&]+(?::|→|-)|$)/gs
  let match
  let foundExplicitCategories = false

  while ((match = explicitCategoryPattern.exec(skillsSection)) !== null) {
    if (match[1] && match[0]) {
      const categoryName = match[1].trim()
      const skills = match[0]
        .substring(match[1].length + 1) // +1 for the colon
        .split(/[,|•|\n|;]/)
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0 && skill.length < 30)

      if (skills.length > 0) {
        categories[categoryName] = skills
        foundExplicitCategories = true
      }
    }
  }

  // Second attempt: If no explicit categories found, try to parse skill groups
  if (!foundExplicitCategories) {
    // Look for bullet points and lists
    const skillItems = skillsSection
      .split(/[•\-*,;|]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && item.length < 30)

    // Categorize skills based on keywords
    skillItems.forEach((skill) => {
      const lowerSkill = skill.toLowerCase()

      if (/java\b|python|javascript|typescript|c\+\+|ruby|php|go|rust|swift|kotlin|html|css|sql/i.test(lowerSkill)) {
        categories["Programming Languages"].push(skill)
      } else if (/react|angular|vue|node|express|django|flask|spring|laravel|next\.js|gatsby/i.test(lowerSkill)) {
        categories["Frameworks"].push(skill)
      } else if (/aws|azure|gcp|docker|kubernetes|jenkins|git|github|gitlab|jira|confluence|ci\/cd/i.test(lowerSkill)) {
        categories["Tools"].push(skill)
      } else if (/communication|leadership|teamwork|problem.solving|critical.thinking|management/i.test(lowerSkill)) {
        categories["Soft Skills"].push(skill)
      } else {
        categories["Technical"].push(skill)
      }
    })
  }

  // Convert categories to SkillCategory[] format
  const skills: SkillCategory[] = Object.entries(categories)
    .filter(([_, skills]) => skills.length > 0)
    .map(([name, skillNames]) => ({
      name,
      skills: skillNames.map((name) => ({ name })),
    }))

  console.log(`Extracted ${skills.length} skill categories`)
  return skills
}

function extractExperience(text: string): Experience[] {
  console.log("Extracting experience")

  // Extract experience section
  const experienceSection = extractSection(text, [
    "EXPERIENCE",
    "WORK EXPERIENCE",
    "EMPLOYMENT",
    "PROFESSIONAL EXPERIENCE",
    "WORK HISTORY",
    "CAREER HISTORY",
  ])

  if (!experienceSection) {
    return []
  }

  console.log("Found experience section:", experienceSection.substring(0, 100) + "...")

  const experiences: Experience[] = []

  // Pattern for company/position headers
  const entryHeaderPattern = /(?:^|\n)(.{3,60})\n(.{3,60})\n/g
  let match
  let lastMatchEndIndex = 0
  const entries: Array<{ startIndex: number; text: string }> = []

  // First, identify potential job entries by looking for patterns
  while ((match = entryHeaderPattern.exec(experienceSection)) !== null) {
    // Check if there's a significant gap between matches, indicating a new entry
    if (match.index - lastMatchEndIndex > 20 || entries.length === 0) {
      entries.push({
        startIndex: match.index,
        text: match[0],
      })
    }
    lastMatchEndIndex = match.index + match[0].length
  }

  // If we found at least 2 entries, split the text at those positions
  if (entries.length >= 2) {
    for (let i = 0; i < entries.length; i++) {
      const currentEntry = entries[i]
      const nextEntry = entries[i + 1]

      const entryText = nextEntry
        ? experienceSection.substring(currentEntry.startIndex, nextEntry.startIndex)
        : experienceSection.substring(currentEntry.startIndex)

      // Process this entry
      const experience = processExperienceEntry(entryText)
      if (experience.company || experience.position) {
        experiences.push(experience)
      }
    }
  } else {
    // Fallback: Split by date patterns or double newlines
    let entriesText = experienceSection.split(/\n\s*\n/)

    if (entriesText.length <= 1) {
      // Try splitting by date patterns
      const datePattern =
        /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*(?:-|to|–|—)\s*(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|Present\b|\b\d{4}\s*(?:-|to|–|—)\s*\d{4}|Present\b/gi

      const tempText = experienceSection
      const positions: number[] = []

      while ((match = datePattern.exec(tempText)) !== null) {
        positions.push(match.index)
      }

      if (positions.length > 1) {
        entriesText = []
        for (let i = 0; i < positions.length; i++) {
          const startPos = positions[i]
          const endPos = i < positions.length - 1 ? positions[i + 1] : tempText.length
          entriesText.push(tempText.substring(startPos, endPos))
        }
      }
    }

    // Process each entry
    entriesText.forEach((entryText) => {
      if (entryText && entryText.trim().length > 20) {
        const experience = processExperienceEntry(entryText)
        if (experience.company || experience.position) {
          experiences.push(experience)
        }
      }
    })
  }

  console.log(`Extracted ${experiences.length} experiences`)
  return experiences
}

function processExperienceEntry(text: string): Experience {
  // Initialize with empty values
  const experience: Experience = {
    company: "",
    position: "",
    startDate: "",
    endDate: "Present",
    location: "",
    description: "",
    achievements: [""],
  }

  // Split into lines for processing
  const lines = text.split("\n").filter((line) => line.trim().length > 0)

  if (lines.length < 2) return experience

  // First line is often position or company
  const firstLine = lines[0].trim()
  const secondLine = lines[1].trim()

  // Check for "Position at Company" pattern
  const positionCompanyMatch = firstLine.match(/(.+?)\s+(?:at|@|\||-)\s+(.+)/i)

  if (positionCompanyMatch) {
    experience.position = positionCompanyMatch[1].trim()
    experience.company = positionCompanyMatch[2].trim()
  }
  // Otherwise use heuristics
  else {
    // If second line has date pattern, first line is likely position or company
    const datePattern =
      /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|\b\d{4}\b/

    if (datePattern.test(secondLine)) {
      if (/Inc\.|LLC|Ltd\.|\bCorp\.?|\bCompany\b/i.test(firstLine)) {
        experience.company = firstLine
        // Try to find position in remaining lines
        for (let i = 2; i < Math.min(lines.length, 5); i++) {
          if (lines[i].length < 50 && !datePattern.test(lines[i])) {
            experience.position = lines[i].trim()
            break
          }
        }
      } else {
        experience.position = firstLine
        // Look for company in remaining lines
        for (let i = 2; i < Math.min(lines.length, 5); i++) {
          if (
            (lines[i].length < 50 && !datePattern.test(lines[i])) ||
            /Inc\.|LLC|Ltd\.|\bCorp\.?|\bCompany\b/i.test(lines[i])
          ) {
            experience.company = lines[i].trim()
            break
          }
        }
      }
    }
    // If neither first nor second line has date, assume first=position, second=company
    else {
      experience.position = firstLine
      experience.company = secondLine
    }
  }

  // Extract dates
  const datePatterns = [
    // Month Year - Month Year or Present
    /\b((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})\s*(?:-|to|–|—)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}|Present)\b/i,
    // Year - Year or Present
    /\b(\d{4})\s*(?:-|to|–|—)\s*(\d{4}|Present)\b/i,
  ]

  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      experience.startDate = match[1].trim()
      experience.endDate = match[2].trim()
      break
    }
  }

  // Extract location
  const locationPattern = /\b([A-Za-z\s]+,\s*[A-Za-z\s]+|[A-Za-z\s]+,\s*[A-Z]{2})\b/
  const locationMatch = text.match(locationPattern)
  if (locationMatch) {
    experience.location = locationMatch[1].trim()
  }

  // Extract achievements (bullet points)
  const bulletPoints = text.match(/[•\-*]\s*([^\n•\-*]+)/g) || text.match(/\d+\.\s*([^\n]+)/g)

  if (bulletPoints && bulletPoints.length > 0) {
    experience.achievements = bulletPoints
      .map((point) => point.replace(/^[•\-*\d.]\s*/, "").trim())
      .filter((point) => point.length > 5) // Filter out very short points

    // If we have bullet points, use remaining text as description
    const achievementsText = bulletPoints.join(" ")
    const descriptionText = text.replace(achievementsText, "").trim()
    const descriptionLines = descriptionText
      .split("\n")
      .filter(
        (line) =>
          line.trim().length > 0 &&
          !line.includes(experience.company) &&
          !line.includes(experience.position) &&
          !locationPattern.test(line) &&
          !datePatterns.some((pattern) => pattern.test(line)),
      )

    if (descriptionLines.length > 0) {
      experience.description = descriptionLines.join(" ").trim()
    }
  }
  // If no bullet points, use remaining text as description
  else if (lines.length > 2) {
    const descriptionLines = lines
      .slice(2)
      .filter(
        (line) =>
          line.trim().length > 0 && !locationPattern.test(line) && !datePatterns.some((pattern) => pattern.test(line)),
      )

    if (descriptionLines.length > 0) {
      experience.description = descriptionLines.join(" ").trim()
    }
  }

  // Ensure achievements are not empty
  if (experience.achievements.length === 0 || (experience.achievements.length === 1 && !experience.achievements[0])) {
    experience.achievements = [""]
  }

  return experience
}

function extractEducation(text: string): Education[] {
  console.log("Extracting education")

  // Extract education section
  const educationSection = extractSection(text, [
    "EDUCATION",
    "ACADEMIC BACKGROUND",
    "EDUCATIONAL QUALIFICATIONS",
    "ACADEMIC QUALIFICATIONS",
    "ACADEMIC HISTORY",
  ])

  if (!educationSection) {
    return []
  }

  console.log("Found education section:", educationSection.substring(0, 100) + "...")

  const educations: Education[] = []

  // Split section into entries using multiple methods
  let entries = educationSection.split(/\n\s*\n/)

  // If we only have one entry, try to split by degree or institution patterns
  if (entries.length <= 1) {
    const degreePattern =
      /\b(Bachelor|Master|Ph\.?D\.?|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.Tech|M\.Tech|B\.E\.|M\.E\.)[^,\n]*/i
    const universityPattern = /\b(University|College|Institute|School)\s+of\s+[A-Za-z\s]+\b/i

    // Combine patterns for splitting
    const splitPattern = new RegExp(`(${degreePattern.source})|(${universityPattern.source})`, "i")
    const positions: number[] = []
    let match

    // Find positions of all matches
    const tempText = educationSection
    while (
      (match = splitPattern.exec(tempText.substring(positions.length > 0 ? positions[positions.length - 1] + 1 : 0)))
    ) {
      if (match.index !== undefined) {
        positions.push(positions.length > 0 ? positions[positions.length - 1] + match.index + 1 : match.index)
      }
    }

    // Use positions to split text
    if (positions.length > 1) {
      entries = []
      for (let i = 0; i < positions.length; i++) {
        const startPos = positions[i]
        const endPos = i < positions.length - 1 ? positions[i + 1] : educationSection.length
        entries.push(educationSection.substring(startPos, endPos))
      }
    }
  }

  // Process each entry
  entries.forEach((entry) => {
    if (entry && entry.trim().length > 10) {
      const education = processEducationEntry(entry.trim())
      if (education.institution || education.degree) {
        educations.push(education)
      }
    }
  })

  console.log(`Extracted ${educations.length} education entries`)
  return educations
}

function processEducationEntry(text: string): Education {
  // Initialize with empty values
  const education: Education = {
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    location: "",
    description: "",
  }

  // Split into lines for processing
  const lines = text.split("\n").filter((line) => line.trim().length > 0)

  if (lines.length === 0) return education

  // Check for degree pattern in the first line
  const degreeMatch = lines[0].match(
    /\b(Bachelor|Master|Ph\.?D\.?|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.Tech|M\.Tech|B\.E\.|M\.E\.)[^,\n]*/i,
  )

  if (degreeMatch) {
    education.degree = degreeMatch[0].trim()

    // Try to extract field of study
    const fieldMatch = lines[0].match(/\bin\s+([^,\n]+)/i)
    if (fieldMatch) {
      education.field = fieldMatch[1].trim()
    }

    // Look for institution in the same line or next line
    const instMatch = lines[0].match(/(?:from|at)\s+([^,\n]+)/i)
    if (instMatch) {
      education.institution = instMatch[1].trim()
    } else if (lines.length > 1) {
      // Institution might be on the next line
      education.institution = lines[1].trim()
    }
  }
  // If no degree in first line, it might be the institution
  else {
    education.institution = lines[0].trim()

    // Look for degree in subsequent lines
    if (lines.length > 1) {
      for (let i = 1; i < lines.length; i++) {
        const degreeMatch = lines[i].match(
          /\b(Bachelor|Master|Ph\.?D\.?|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.Tech|M\.Tech|B\.E\.|M\.E\.)[^,\n]*/i,
        )
        if (degreeMatch) {
          education.degree = degreeMatch[0].trim()

          // Try to extract field of study
          const fieldMatch = lines[i].match(/\bin\s+([^,\n]+)/i)
          if (fieldMatch) {
            education.field = fieldMatch[1].trim()
          }
          break
        }
      }
    }
  }

  // Extract dates
  const datePatterns = [
    // Year - Year or Present
    /\b(\d{4})\s*(?:-|to|–|—)\s*(\d{4}|Present)\b/i,
    // Single Year (likely graduation year)
    /\bClass\s+of\s+(\d{4})\b/i,
    /\bGraduat(?:ed|ion)(?:\s+in)?\s+(\d{4})\b/i,
  ]

  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      if (match[2]) {
        education.startDate = match[1].trim()
        education.endDate = match[2].trim()
      } else {
        education.endDate = match[1].trim()
      }
      break
    }
  }

  // Extract location
  const locationPattern = /\b([A-Za-z\s]+,\s*[A-Za-z\s]+|[A-Za-z\s]+,\s*[A-Z]{2})\b/
  const locationMatch = text.match(locationPattern)
  if (locationMatch) {
    education.location = locationMatch[0].trim()
  }

  // Extract description from remaining text
  if (lines.length > 2) {
    const usedLines = new Set()
    if (education.degree) usedLines.add(lines.findIndex((l) => l.includes(education.degree)))
    if (education.institution) usedLines.add(lines.findIndex((l) => l.includes(education.institution)))
    if (education.location) usedLines.add(lines.findIndex((l) => l.includes(education.location)))

    const descLines = lines
      .filter((_, i) => !usedLines.has(i))
      .filter((line) => !datePatterns.some((p) => p.test(line)))

    if (descLines.length > 0) {
      education.description = descLines.join(" ").trim()
    }
  }

  return education
}

function extractProjects(text: string): Project[] {
  console.log("Extracting projects")

  // Extract projects section
  const projectsSection = extractSection(text, [
    "PROJECTS",
    "PROJECT EXPERIENCE",
    "PERSONAL PROJECTS",
    "KEY PROJECTS",
    "ACADEMIC PROJECTS",
    "PORTFOLIO",
  ])

  if (!projectsSection) {
    return []
  }

  console.log("Found projects section:", projectsSection.substring(0, 100) + "...")

  const projects: Project[] = []

  // Split section into entries
  const entries = projectsSection.split(/\n\s*\n/)

  // Process each entry
  entries.forEach((entry) => {
    if (entry && entry.trim().length > 10) {
      const project = processProjectEntry(entry.trim())
      if (project.name) {
        projects.push(project)
      }
    }
  })

  console.log(`Extracted ${projects.length} projects`)
  return projects
}

function processProjectEntry(text: string): Project {
  // Initialize with empty values
  const project: Project = {
    name: "",
    description: "",
    technologies: "",
    link: "",
    startDate: "",
    endDate: "",
    achievements: [""],
  }

  // Split into lines for processing
  const lines = text.split("\n").filter((line) => line.trim().length > 0)

  if (lines.length === 0) return project

  // First line is typically the project name
  project.name = lines[0].trim()

  // Extract technologies
  const techMatch = text.match(/(?:Technologies?|Tech Stack|Tools|Built with)(?:\s*:|used)?[^\n]*?([^\n]+)/i)
  if (techMatch && techMatch[1]) {
    project.technologies = techMatch[1].trim()
  }

  // Extract link
  const linkMatch = text.match(/\b(https?:\/\/[^\s]+)\b/)
  if (linkMatch) {
    project.link = linkMatch[0]
  }

  // Extract dates
  const dateMatch = text.match(/\b(\d{4})\s*(?:-|to|–|—)\s*(\d{4}|Present|Ongoing)\b/i)
  if (dateMatch) {
    project.startDate = dateMatch[1].trim()
    project.endDate = dateMatch[2].trim()
  }

  // Extract bullet points as achievements
  const bulletPoints = text.match(/[•\-*]\s*([^\n•\-*]+)/g) || text.match(/\d+\.\s*([^\n]+)/g)

  if (bulletPoints && bulletPoints.length > 0) {
    project.achievements = bulletPoints
      .map((point) => point.replace(/^[•\-*\d.]\s*/, "").trim())
      .filter((point) => point.length > 0)
  }

  // Extract description
  if (lines.length > 1) {
    // Use second line as description if it doesn't look like technologies or a bullet point
    const secondLine = lines[1].trim()
    if (
      !secondLine.match(/^[•\-*\d.]/) &&
      !secondLine.match(/^Technologies?|Tech Stack|Tools|Built with/i) &&
      !secondLine.match(/^https?:\/\//)
    ) {
      project.description = secondLine
    } else {
      // Search for a line that could be a description
      for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim()
        if (
          !line.match(/^[•\-*\d.]/) &&
          !line.match(/^Technologies?|Tech Stack|Tools|Built with/i) &&
          !line.match(/^https?:\/\//)
        ) {
          project.description = line
          break
        }
      }
    }
  }

  // Ensure achievements is not empty
  if (project.achievements.length === 0 || (project.achievements.length === 1 && !project.achievements[0])) {
    project.achievements = [""]
  }

  return project
}
