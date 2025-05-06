import fs from "fs"
import path from "path"
import type { Job } from "./data"

// Server-only data fetching
export async function getJobsData(): Promise<Job[]> {
  if (typeof window !== "undefined") {
    throw new Error("getJobsData can only be called on the server side.")
  }

  const filePath = path.join(process.cwd(), "data/jobs.json")
  const fileContents = fs.readFileSync(filePath, "utf8")
  const rawJobs = JSON.parse(fileContents) as any[]
  return rawJobs.map((job) => ({
    Title: job.Title,
    Description: job.Description,
    Primary_Description: job["Primary Description"],
    Detail_URL: job["Detail URL"],
    Location: job.Location,
    Skill: job.Skill,
    Insight: job.Insight,
    Job_State: job["Job State"],
    Poster_Id: job["Poster Id"] ?? null,
    Company_Name: job["Company Name"],
    Company_Logo: job["Company Logo"],
    Created_At: job["Created At"],
    Scraped_At: job["Scraped At"],
  }))
}
