// Define types for our job data
export interface Job {
  Title: string
  Description: string
  Primary_Description: string
  Detail_URL: string
  Location: string
  Skill: string | null
  Insight: string | null
  Job_State: string
  Poster_Id: number | null
  Company_Name: string
  Company_Logo: string
  Created_At: string
  Scraped_At: string
}

export interface Transaction {
  id: string
  title: string
  amount: string
  type: "incoming" | "outgoing"
  category: string
  icon: string
  timestamp: string
  status: "completed" | "pending"
}

export interface Event {
  id: string
  title: string
  subtitle: string
  icon: string
  iconStyle: string
  date: string
  amount: string
  status: "pending" | "in-progress" | "completed"
  progress?: number
}

// Function to get a valid logo URL or fallback
export function getValidLogoUrl(logoUrl: string | null | undefined): string {
  if (!logoUrl) {
    return "/placeholder.svg?height=48&width=48"
  }

  // Check if the URL is valid
  try {
    new URL(logoUrl)
    return logoUrl
  } catch (e) {
    // If URL is invalid, return placeholder
    return "/placeholder.svg?height=48&width=48"
  }
}

// Update the formatDate function to handle null or undefined values
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) {
    return "Date unknown"
  }

  const date = new Date(dateString)

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date"
  }

  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return "Today"
  } else if (diffDays === 1) {
    return "Yesterday"
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? "month" : "months"} ago`
  }
}

// Update the extractWorkType function to handle null or undefined values
export function extractWorkType(description: string | null | undefined): string {
  if (!description) {
    return "Not specified"
  }

  const lowerDesc = description.toLowerCase()

  if (lowerDesc.includes("remote")) {
    return "Remote"
  } else if (lowerDesc.includes("hybrid")) {
    return "Hybrid"
  } else if (lowerDesc.includes("on-site") || lowerDesc.includes("onsite")) {
    return "On-site"
  } else {
    return "Not specified"
  }
}

// Also update the truncateDescription function to handle null or undefined values
export function truncateDescription(description: string | null | undefined, maxLength = 150): string {
  if (!description) {
    return "No description available"
  }

  if (description.length <= maxLength) {
    return description
  }

  // Find the last space before maxLength
  const lastSpace = description.substring(0, maxLength).lastIndexOf(" ")
  if (lastSpace === -1) {
    return description.substring(0, maxLength) + "..."
  }

  return description.substring(0, lastSpace) + "..."
}

// Update the extractSalary function to handle null or undefined values
export function extractSalary(description: string | null | undefined): string | null {
  if (!description) {
    return null
  }

  // Common salary patterns
  const patterns = [
    /\$(\d{1,3}(,\d{3})*(\.\d+)?)\s*-\s*\$(\d{1,3}(,\d{3})*(\.\d+)?)/i, // $X - $Y
    /(\$\d{1,3}(,\d{3})*(\.\d+)?)/i, // $X
    /(\d{1,3}(,\d{3})*(\.\d+)?)\s*-\s*(\d{1,3}(,\d{3})*(\.\d+)?)\s*\/\s*(year|yr|hour|hr)/i, // X - Y /year
    /(\d{1,3}(,\d{3})*(\.\d+)?)\s*\/\s*(year|yr|hour|hr)/i, // X /year
    /(\d{2,3})(k)\s*-\s*(\d{2,3})(k)/i, // Xk - Yk
  ]

  for (const pattern of patterns) {
    const match = description.match(pattern)
    if (match) {
      return match[0]
    }
  }

  return null
}

// Extract skills from job description
export function extractSkills(description: string | null | undefined): string[] {
  if (!description) {
    return []
  }

  const skillsRegex = [
    /\b(Python|JavaScript|TypeScript|Java|C\+\+|C#|Ruby|Go|Rust|PHP|Swift|Kotlin)\b/gi,
    /\b(React|Angular|Vue|Node\.js|Express|Django|Flask|Spring|Laravel|Rails)\b/gi,
    /\b(AWS|Azure|GCP|Docker|Kubernetes|Terraform|Jenkins|Git|CI\/CD)\b/gi,
    /\b(SQL|NoSQL|MongoDB|PostgreSQL|MySQL|Oracle|Redis|Elasticsearch)\b/gi,
    /\b(Machine Learning|Deep Learning|NLP|Computer Vision|Data Science|AI|Artificial Intelligence)\b/gi,
    /\b(TensorFlow|PyTorch|Scikit-learn|Pandas|NumPy|Keras|NLTK|OpenCV)\b/gi,
    /\b(Agile|Scrum|Kanban|JIRA|Confluence|Trello|Asana)\b/gi,
    /\b(REST|GraphQL|API|Microservices|Serverless|WebSockets)\b/gi,
  ]

  let skills: string[] = []

  skillsRegex.forEach((regex) => {
    const matches = description.match(regex)
    if (matches) {
      skills = [...skills, ...matches]
    }
  })

  // Remove duplicates and convert to lowercase for comparison
  return Array.from(new Set(skills.map((skill) => skill.toLowerCase()))).map(
    (skill) => skill.charAt(0).toUpperCase() + skill.slice(1),
  ) // Capitalize first letter
}

// Get job statistics for dashboard
export function getJobStatistics(jobs: Job[]): {
  totalJobs: number
  remoteJobs: number
  hybridJobs: number
  onsiteJobs: number
  companiesCount: number
  locationsCount: number
  topLocations: { location: string; count: number }[]
  topCompanies: { company: string; count: number }[]
  jobsByDate: { date: string; count: number }[]
  skillsDistribution: { skill: string; count: number }[]
  topJobTitles: { title: string; count: number }[]
} {
  // Count job types
  const remoteJobs = jobs.filter(
    (job) => job.Primary_Description && job.Primary_Description.toLowerCase().includes("remote"),
  ).length

  const hybridJobs = jobs.filter(
    (job) => job.Primary_Description && job.Primary_Description.toLowerCase().includes("hybrid"),
  ).length

  const onsiteJobs = jobs.filter(
    (job) =>
      job.Primary_Description &&
      (job.Primary_Description.toLowerCase().includes("on-site") ||
        job.Primary_Description.toLowerCase().includes("onsite")),
  ).length

  // Count unique companies and locations
  const companies = new Set(jobs.map((job) => job.Company_Name))
  const locations = new Set(jobs.map((job) => (job.Location ? job.Location.split(",")[0] : "")))

  // Get top locations
  const locationCounts: { [key: string]: number } = {}
  jobs.forEach((job) => {
    if (job.Location) {
      const location = job.Location.split(",")[0]
      locationCounts[location] = (locationCounts[location] || 0) + 1
    }
  })

  const topLocations = Object.entries(locationCounts)
    .map(([location, count]) => ({ location, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Get top companies
  const companyCounts: { [key: string]: number } = {}
  jobs.forEach((job) => {
    if (job.Company_Name) {
      companyCounts[job.Company_Name] = (companyCounts[job.Company_Name] || 0) + 1
    }
  })

  const topCompanies = Object.entries(companyCounts)
    .map(([company, count]) => ({ company, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Get jobs by date
  const dateMap: { [key: string]: number } = {}
  jobs.forEach((job) => {
    if (job.Created_At) {
      const date = new Date(job.Created_At).toISOString().split("T")[0]
      dateMap[date] = (dateMap[date] || 0) + 1
    }
  })

  const jobsByDate = Object.entries(dateMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get skills distribution
  const skillsMap: { [key: string]: number } = {}
  jobs.forEach((job) => {
    const skills = extractSkills(job.Description)
    skills.forEach((skill) => {
      skillsMap[skill] = (skillsMap[skill] || 0) + 1
    })
  })

  const skillsDistribution = Object.entries(skillsMap)
    .map(([skill, count]) => ({ skill, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // Get top job titles
  const titleCounts: { [key: string]: number } = {}
  jobs.forEach((job) => {
    if (job.Title) {
      titleCounts[job.Title] = (titleCounts[job.Title] || 0) + 1
    }
  })

  const topJobTitles = Object.entries(titleCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  return {
    totalJobs: jobs.length,
    remoteJobs,
    hybridJobs,
    onsiteJobs,
    companiesCount: companies.size,
    locationsCount: locations.size,
    topLocations,
    topCompanies,
    jobsByDate,
    skillsDistribution,
    topJobTitles,
  }
}
