import type { Job } from "@/lib/data"
import { extractWorkType, extractSkills } from "@/lib/data"

export function generatePowerBITemplate(jobs: Job[]): string {
  // Create a template for Power BI with sample queries and visualizations
  return `
# Power BI Template for Job Data Analysis

## Data Import Instructions

1. Open Power BI Desktop
2. Click "Get Data" > "Text/CSV"
3. Select the exported job_data.csv file
4. In the Navigator dialog, click "Load"

## Recommended Visualizations

### Overview Dashboard
- Card visuals for total jobs, companies, and locations
- Pie chart for job types (Remote, Hybrid, On-site)
- Bar chart for top companies
- Line chart for jobs posted over time

### Location Analysis
- Map visualization for job locations
- Bar chart for jobs by city/state
- Slicer for filtering by location

### Skills Analysis
- Word cloud for skills mentioned
- Bar chart for top skills
- Matrix showing skills by company

## Sample DAX Measures

\`\`\`
// Count of Remote Jobs
Remote Jobs = 
CALCULATE(
    COUNTROWS('Jobs'),
    'Jobs'[Work Type] = "Remote"
)

// Count of Hybrid Jobs
Hybrid Jobs = 
CALCULATE(
    COUNTROWS('Jobs'),
    'Jobs'[Work Type] = "Hybrid"
)

// Count of On-site Jobs
Onsite Jobs = 
CALCULATE(
    COUNTROWS('Jobs'),
    'Jobs'[Work Type] = "On-site"
)

// Jobs by Month
Jobs by Month = 
CALCULATE(
    COUNTROWS('Jobs'),
    USERELATIONSHIP('Date'[Date], 'Jobs'[Created At])
)
\`\`\`

## Recommended Relationships
- Create a Date table and relate it to the Created At field
- Create a Location table for geographic hierarchies
- Create a Skills table for detailed skill analysis

## Advanced Analysis Ideas
- Trend analysis of skills over time
- Correlation between location and job type
- Company hiring patterns
- Salary range analysis by job title and location
`
}

export function exportForPowerBI(jobs: Job[]): void {
  // Export data in a format optimized for Power BI
  const headers = ["Title", "Company", "Location", "Work Type", "Created At", "Skills", "Salary", "Job State", "URL"]

  const csvData = jobs.map((job) => [
    job.Title || "",
    job.Company_Name || "",
    job.Location || "",
    extractWorkType(job.Primary_Description),
    job.Created_At || "",
    extractSkills(job.Description).join(";"),
    extractSalary(job.Description) || "",
    job.Job_State || "",
    job.Detail_URL || "",
  ])

  const csvContent = [
    headers.join(","),
    ...csvData.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", "job_data_for_power_bi.csv")
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Also download the template
  const templateBlob = new Blob([generatePowerBITemplate(jobs)], { type: "text/markdown;charset=utf-8;" })
  const templateUrl = URL.createObjectURL(templateBlob)
  const templateLink = document.createElement("a")
  templateLink.setAttribute("href", templateUrl)
  templateLink.setAttribute("download", "power_bi_template.md")
  templateLink.style.visibility = "hidden"
  document.body.appendChild(templateLink)
  templateLink.click()
  document.body.removeChild(templateLink)
}

// Helper function to extract salary (imported from data.ts)
function extractSalary(description: string | null | undefined): string | null {
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
