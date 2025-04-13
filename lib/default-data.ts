import type { ResumeData } from "./types"
import { defaultCustomization } from "./templates"

export const defaultResumeData: ResumeData = {
  personalInfo: {
    name: "Nikhil Jangid",
    title: "Full Stack Developer",
    email: "nikhil.jangid@example.com",
    phone: "+91 9876543210",
    location: "Shahpura, Jaipur",
    website: "github.com/nikhiljangid",
    summary:
      "Driven Full-Stack Developer with expertise in MERN stack and C++ problem-solving. Skilled in creating scalable, high-performance applications and collaborating on innovative projects.",
  },
  skills: [
    {
      name: "Core",
      skills: [{ name: "HTML" }, { name: "CSS" }, { name: "JavaScript" }],
    },
    {
      name: "Advanced",
      skills: [{ name: "MongoDB" }, { name: "Express.js" }, { name: "React.js" }, { name: "Node.js" }],
    },
    {
      name: "Programming",
      skills: [{ name: "C++" }, { name: "Data Structures" }, { name: "Algorithms" }],
    },
  ],
  experience: [
    {
      company: "TechInnovate Solutions",
      position: "Virtual Intern",
      startDate: "June 2024",
      endDate: "Present",
      location: "Remote",
      description: "Working as a full-stack developer intern on various web applications and services.",
      achievements: [
        "Built and optimized frontend and backend features for full-stack projects",
        "Improved code efficiency by 20% through refactoring",
        "Collaborated with a remote team of 5 developers",
      ],
    },
  ],
  education: [
    {
      institution: "Amity University",
      degree: "Bachelor of Technology",
      field: "Computer Science",
      startDate: "2022",
      endDate: "2026",
      location: "Jaipur, India",
      description: "Relevant coursework: Data Structures, Algorithms, Web Development, Database Management Systems",
    },
  ],
  projects: [
    {
      name: "AI Resume Builder",
      description: "A modern resume builder with AI-powered content suggestions and ATS optimization.",
      technologies: "React.js, Next.js, Tailwind CSS, AI Integration",
      link: "https://github.com/nikhiljangid/resume-rocket",
      startDate: "June 2024",
      endDate: "Ongoing",
      achievements: [
        "Engineered an AI-powered resume tool with real-time ATS scoring",
        "Implemented live preview and dynamic customization features",
        "Integrated AI content generation for professional summaries and bullet points",
      ],
    },
  ],
  customization: defaultCustomization,
}
