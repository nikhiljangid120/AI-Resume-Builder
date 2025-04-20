import type { ResumeData } from "./types"

// This enhanced ATS checker provides reliable analysis even when the API fails
export function calculateATSScore(
  resumeData: ResumeData,
  jobDescription: string,
): { score: number; feedback: string[]; missingKeywords: string[] } {
  const feedback: string[] = []
  const missingKeywords: string[] = []

  if (!jobDescription) {
    return { score: 100, feedback: [], missingKeywords: [] }
  }

  // Extract all text from resume for keyword matching
  const resumeText = extractResumeText(resumeData).toLowerCase()
  const jobDescLower = jobDescription.toLowerCase()

  // Common keywords to check based on job descriptions
  const commonKeywords = [
    "experience",
    "skills",
    "team",
    "project",
    "development",
    "management",
    "communication",
    "leadership",
    "problem-solving",
    "analysis",
    "design",
    "implementation",
    "testing",
    "deployment",
    "maintenance",
    "collaboration",
    "innovation",
    "strategy",
    "planning",
    "execution",
    "results",
    "performance",
  ]

  // Technical keywords based on resume content
  const technicalKeywords = extractTechnicalKeywords(resumeData)

  // Industry-specific keywords from job description
  const industryKeywords = extractIndustryKeywords(jobDescription)

  // All keywords to check
  const allKeywords = [...new Set([...commonKeywords, ...technicalKeywords, ...industryKeywords])]

  // Check for missing keywords
  for (const keyword of allKeywords) {
    if (jobDescLower.includes(keyword) && !resumeText.includes(keyword)) {
      missingKeywords.push(keyword)
    }
  }

  // Check for professional summary
  if (!resumeData.personalInfo.summary || resumeData.personalInfo.summary.length < 50) {
    feedback.push(
      "Your professional summary is too short or missing. Aim for 3-5 sentences that highlight your expertise and achievements.",
    )
  }

  // Check for quantifiable achievements
  const hasQuantifiableAchievements = resumeData.experience.some((exp) =>
    exp.achievements.some((achievement) => /\d+%|\d+ times|\d+x|\$\d+|\d+ people/i.test(achievement)),
  )

  if (!hasQuantifiableAchievements) {
    feedback.push(
      "Add quantifiable achievements to your experience section (e.g., 'Improved performance by 30%' instead of 'Improved performance').",
    )
  }

  // Check for weak action verbs
  const weakVerbs = ["worked on", "helped with", "assisted", "participated", "was responsible for"]
  const hasWeakVerbs = resumeData.experience.some((exp) =>
    exp.achievements.some((achievement) => weakVerbs.some((verb) => achievement.toLowerCase().startsWith(verb))),
  )

  if (hasWeakVerbs) {
    feedback.push(
      "Replace weak action verbs like 'worked on' with stronger alternatives like 'developed', 'implemented', or 'engineered'.",
    )
  }

  // Check for skills matching
  const jobSkills = extractSkillsFromJobDescription(jobDescription)
  const resumeSkills = resumeData.skills.flatMap((category) => category.skills.map((skill) => skill.name.toLowerCase()))

  const missingSkills = jobSkills.filter((skill) => !resumeSkills.some((resumeSkill) => resumeSkill.includes(skill)))

  if (missingSkills.length > 0) {
    feedback.push(`Consider adding these skills that appear in the job description: ${missingSkills.join(", ")}.`)
    missingKeywords.push(...missingSkills)
  }

  // Check for contact information
  if (!resumeData.personalInfo.email || !resumeData.personalInfo.phone) {
    feedback.push("Ensure your contact information (email and phone) is complete.")
  }

  // Check for education details
  if (resumeData.education.length === 0) {
    feedback.push("Add your educational background to strengthen your resume.")
  }

  // Calculate score based on feedback and missing keywords
  let score = 100
  score -= feedback.length * 5 // Deduct 5 points for each feedback item
  score -= Math.min(25, missingKeywords.length * 2) // Deduct up to 25 points for missing keywords

  // Ensure score doesn't go below 60
  score = Math.max(60, score)

  return {
    score,
    feedback,
    missingKeywords: [...new Set(missingKeywords)], // Remove duplicates
  }
}

// Helper function to extract all text from resume
function extractResumeText(resumeData: ResumeData): string {
  const { personalInfo, skills, experience, education, projects } = resumeData

  const personalInfoText = `${personalInfo.name} ${personalInfo.title} ${personalInfo.summary}`

  const skillsText = skills.flatMap((category) => category.skills.map((skill) => skill.name)).join(" ")

  const experienceText = experience
    .map((exp) => `${exp.position} ${exp.company} ${exp.description} ${exp.achievements.join(" ")}`)
    .join(" ")

  const educationText = education
    .map((edu) => `${edu.degree} ${edu.field} ${edu.institution} ${edu.description}`)
    .join(" ")

  const projectsText = projects
    .map((proj) => `${proj.name} ${proj.description} ${proj.technologies} ${proj.achievements.join(" ")}`)
    .join(" ")

  return `${personalInfoText} ${skillsText} ${experienceText} ${educationText} ${projectsText}`
}

// Extract technical keywords from resume
function extractTechnicalKeywords(resumeData: ResumeData): string[] {
  const keywords: string[] = []

  // Extract from skills
  resumeData.skills.forEach((category) => {
    category.skills.forEach((skill) => {
      keywords.push(skill.name.toLowerCase())
    })
  })

  // Extract from project technologies
  resumeData.projects.forEach((project) => {
    if (project.technologies) {
      project.technologies.split(/[,;]/).forEach((tech) => {
        keywords.push(tech.trim().toLowerCase())
      })
    }
  })

  return [...new Set(keywords)] // Remove duplicates
}

// Extract industry keywords from job description
function extractIndustryKeywords(jobDescription: string): string[] {
  const commonIndustryTerms = [
    "agile",
    "scrum",
    "kanban",
    "waterfall",
    "lean",
    "devops",
    "ci/cd",
    "cloud",
    "aws",
    "azure",
    "gcp",
    "saas",
    "paas",
    "iaas",
    "frontend",
    "backend",
    "full-stack",
    "web",
    "mobile",
    "desktop",
    "database",
    "sql",
    "nosql",
    "api",
    "rest",
    "graphql",
    "microservices",
    "architecture",
    "design patterns",
    "oop",
    "functional programming",
    "testing",
    "unit testing",
    "integration testing",
    "qa",
    "quality assurance",
    "security",
    "performance",
    "optimization",
    "scalability",
    "reliability",
    "monitoring",
    "analytics",
    "data science",
    "machine learning",
    "ai",
    "blockchain",
    "iot",
    "ar/vr",
    "mobile development",
    "responsive design",
  ]

  return commonIndustryTerms.filter((term) => jobDescription.toLowerCase().includes(term))
}

// Extract skills from job description
function extractSkillsFromJobDescription(jobDescription: string): string[] {
  const jobDescLower = jobDescription.toLowerCase()

  // Common programming languages
  const programmingLanguages = [
    "javascript",
    "typescript",
    "python",
    "java",
    "c#",
    "c++",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "go",
    "rust",
    "scala",
    "perl",
    "r",
    "dart",
  ]

  // Common frameworks and libraries
  const frameworks = [
    "react",
    "angular",
    "vue",
    "svelte",
    "next.js",
    "node.js",
    "express",
    "django",
    "flask",
    "spring",
    "asp.net",
    "laravel",
    "ruby on rails",
    "flutter",
    "react native",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
  ]

  // Common tools and platforms
  const tools = [
    "git",
    "github",
    "gitlab",
    "bitbucket",
    "jira",
    "confluence",
    "trello",
    "docker",
    "kubernetes",
    "jenkins",
    "travis ci",
    "circleci",
    "aws",
    "azure",
    "gcp",
    "firebase",
    "heroku",
    "netlify",
    "vercel",
    "figma",
    "sketch",
    "adobe xd",
  ]

  // Combine all potential skills
  const allSkills = [...programmingLanguages, ...frameworks, ...tools]

  // Return skills that appear in the job description
  return allSkills.filter((skill) => jobDescLower.includes(skill))
}

// Generate tailoring tips based on resume and job description
export function generateTailoringTips(resumeData: ResumeData, jobDescription: string): string[] {
  if (!jobDescription) {
    return []
  }

  const tips: string[] = []
  const jobDescLower = jobDescription.toLowerCase()

  // Check for job title alignment
  const jobTitles = extractJobTitles(jobDescription)
  if (jobTitles.length > 0 && !jobTitles.some((title) => resumeData.personalInfo.title.toLowerCase().includes(title))) {
    tips.push(`Consider aligning your professional title with the job posting (e.g., "${jobTitles[0]}").`)
  }

  // Check for key responsibilities
  const responsibilities = extractResponsibilities(jobDescription)
  if (responsibilities.length > 0) {
    tips.push(`Highlight experience related to these key responsibilities: ${responsibilities.slice(0, 3).join(", ")}.`)
  }

  // Check for education requirements
  if (
    jobDescLower.includes("bachelor") ||
    jobDescLower.includes("master") ||
    jobDescLower.includes("phd") ||
    jobDescLower.includes("degree")
  ) {
    tips.push("Ensure your education section prominently displays your highest relevant degree.")
  }

  // Check for years of experience
  const experienceYears = extractExperienceYears(jobDescription)
  if (experienceYears > 0) {
    tips.push(
      `The job requires ${experienceYears}+ years of experience. Make sure your work history clearly demonstrates this.`,
    )
  }

  // Check for certifications
  const certifications = extractCertifications(jobDescription)
  if (certifications.length > 0) {
    tips.push(`Consider highlighting these certifications if you have them: ${certifications.join(", ")}.`)
  }

  // Check for soft skills
  const softSkills = extractSoftSkills(jobDescription)
  if (softSkills.length > 0) {
    tips.push(`Incorporate these soft skills into your resume: ${softSkills.join(", ")}.`)
  }

  return tips
}

// Helper functions for tailoring tips
function extractJobTitles(jobDescription: string): string[] {
  const jobDescLower = jobDescription.toLowerCase()
  const commonTitles = [
    "software engineer",
    "developer",
    "programmer",
    "architect",
    "designer",
    "manager",
    "director",
    "lead",
    "senior",
    "junior",
    "full stack",
    "frontend",
    "backend",
    "devops",
    "data scientist",
    "analyst",
    "consultant",
    "specialist",
  ]

  return commonTitles.filter((title) => jobDescLower.includes(title))
}

function extractResponsibilities(jobDescription: string): string[] {
  const responsibilities: string[] = []
  const lines = jobDescription.split("\n")

  // Look for bullet points or numbered lists that might indicate responsibilities
  for (const line of lines) {
    const trimmedLine = line.trim()
    if (
      (trimmedLine.startsWith("-") || trimmedLine.startsWith("•") || /^\d+\./.test(trimmedLine)) &&
      trimmedLine.length > 5
    ) {
      // Extract the main part without the bullet or number
      const content = trimmedLine.replace(/^[-•\d.]+\s*/, "")
      responsibilities.push(content)
    }
  }

  return responsibilities
}

function extractExperienceYears(jobDescription: string): number {
  const regex = /(\d+)[+]?\s*(?:years?|yrs?)\s+(?:of\s+)?experience/i
  const match = jobDescription.match(regex)

  if (match && match[1]) {
    return Number.parseInt(match[1], 10)
  }

  return 0
}

function extractCertifications(jobDescription: string): string[] {
  const jobDescLower = jobDescription.toLowerCase()
  const commonCertifications = [
    "aws certified",
    "azure certified",
    "google cloud certified",
    "pmp",
    "scrum",
    "cissp",
    "ceh",
    "comptia",
    "itil",
    "prince2",
    "six sigma",
    "ccna",
    "ccnp",
    "cka",
    "ckad",
    "rhce",
    "mcsa",
    "mcse",
    "oracle certified",
    "salesforce certified",
  ]

  return commonCertifications.filter((cert) => jobDescLower.includes(cert))
}

function extractSoftSkills(jobDescription: string): string[] {
  const jobDescLower = jobDescription.toLowerCase()
  const commonSoftSkills = [
    "communication",
    "teamwork",
    "leadership",
    "problem-solving",
    "critical thinking",
    "time management",
    "adaptability",
    "flexibility",
    "creativity",
    "work ethic",
    "interpersonal skills",
    "emotional intelligence",
    "conflict resolution",
    "negotiation",
    "decision-making",
    "stress management",
    "attention to detail",
    "organization",
  ]

  return commonSoftSkills.filter((skill) => jobDescLower.includes(skill))
}
