"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ArrowRight, Briefcase, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Job } from "../../lib/data"
import {
  formatDate,
  extractWorkType,
  getValidLogoUrl,
  extractSalary,
  extractSkills,
} from "../../lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useApplications } from "@/context/applications-context"

interface JobListProps {
  jobs?: Job[]
  className?: string
}

export default function JobList({ jobs = [], className }: JobListProps) {
  const { addJob, isJobApplied } = useApplications()

  // State for filters
  const [locationFilter, setLocationFilter] = useState("")
  const [companyFilter, setCompanyFilter] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [minSalaryFilter, setMinSalaryFilter] = useState<number | null>(null)

  // Helper function to parse minimum salary from description text
  const parseMinSalary = (description: string | null | undefined): number | null => {
    const salaryString = extractSalary(description)
    if (!salaryString) return null

    // Regex to find the first number (integer or float) possibly with kilo 'k' suffix
    const salaryMatch = salaryString.match(/\$?(\d{1,3}(?:,\d{3})*|\d+)(?:k)?/i)
    if (!salaryMatch) return null

    let numStr = salaryMatch[1].replace(/,/g, "")
    let num = parseFloat(numStr)

    // Handle 'k' suffix for thousands
    if (salaryMatch[0].toLowerCase().includes('k')) {
      num *= 1000
    }

    return isNaN(num) ? null : num
  }

  // --- Generate unique options for dropdowns ---
  const uniqueLocations = useMemo(() => {
    const locations = new Set(jobs.map(job => job.Location?.split(',')[0].trim()).filter(Boolean) as string[])
    return Array.from(locations).sort()
  }, [jobs])

  const uniqueCompanies = useMemo(() => {
    const companies = new Set(jobs.map(job => job.Company_Name?.trim()).filter(Boolean) as string[])
    return Array.from(companies).sort()
  }, [jobs])

  const uniqueSkills = useMemo(() => {
    const skills = new Set(jobs.flatMap(job => extractSkills(job.Description)))
    return Array.from(skills).sort()
  }, [jobs])
  // --- End options generation ---

  // Filter jobs based on state
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Location Filter (case-insensitive)
      if (
        locationFilter && // Check if filter is set
        job.Location?.split(',')[0].trim().toLowerCase() !== locationFilter.toLowerCase()
      ) {
        return false
      }

      // Company Filter (case-insensitive)
      if (
        companyFilter && // Check if filter is set
        job.Company_Name?.trim().toLowerCase() !== companyFilter.toLowerCase()
      ) {
        return false
      }

      // Skill Filter (case-insensitive)
      if (skillFilter) { // Check if filter is set
        const jobSkills = extractSkills(job.Description).map((s) =>
          s.toLowerCase(),
        )
        if (!jobSkills.includes(skillFilter.toLowerCase())) {
          return false
        }
      }

      // Minimum Salary Filter
      if (minSalaryFilter !== null && minSalaryFilter > 0) {
        const jobMinSalary = parseMinSalary(job.Description)
        if (jobMinSalary === null || jobMinSalary < minSalaryFilter) {
          return false
        }
      }

      return true // Include job if all filters pass
    })
  }, [jobs, locationFilter, companyFilter, skillFilter, minSalaryFilter])

  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto",
        "bg-white dark:bg-zinc-900/70",
        "border border-zinc-100 dark:border-zinc-800",
        "rounded-xl shadow-sm backdrop-blur-xl",
        className,
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Available Positions
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">({filteredJobs.length} jobs)</span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Machine Learning</span>
        </div>

        {/* Filter Inputs Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-lg">
          <div>
            <Label htmlFor="location-filter" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Location</Label>
            {/* Changed Input to Select */}
            <Select
              value={locationFilter || "_ALL_"}
              onValueChange={(value) => setLocationFilter(value === "_ALL_" ? "" : value)}
            >
              <SelectTrigger id="location-filter" className="mt-1 text-sm">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_ALL_">All Locations</SelectItem>
                {uniqueLocations.map(loc => (
                  <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="company-filter" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Company</Label>
            {/* Changed Input to Select */}
            <Select
              value={companyFilter || "_ALL_"}
              onValueChange={(value) => setCompanyFilter(value === "_ALL_" ? "" : value)}
            >
              <SelectTrigger id="company-filter" className="mt-1 text-sm">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_ALL_">All Companies</SelectItem>
                {uniqueCompanies.map(comp => (
                  <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="skill-filter" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Skill</Label>
            {/* Changed Input to Select */}
            <Select
              value={skillFilter || "_ALL_"}
              onValueChange={(value) => setSkillFilter(value === "_ALL_" ? "" : value)}
            >
              <SelectTrigger id="skill-filter" className="mt-1 text-sm">
                <SelectValue placeholder="Select Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_ALL_">All Skills</SelectItem>
                {uniqueSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="salary-filter" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Min Salary ($)</Label>
            <Input
              id="salary-filter"
              type="number"
              placeholder="e.g., 100000"
              value={minSalaryFilter ?? ""}
              onChange={(e) => {
                const value = e.target.value
                setMinSalaryFilter(value ? parseInt(value, 10) : null)
              }}
              className="mt-1 text-sm"
              min="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.Detail_URL || `job-${Math.random()}`}
                className={cn(
                  "group flex flex-col",
                  "p-3 rounded-lg",
                  "border border-zinc-100 dark:border-zinc-800",
                  "hover:border-zinc-200 dark:hover:border-zinc-700",
                  "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                  "transition-all duration-200",
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <Image
                      src={getValidLogoUrl(job.Company_Logo) || "/placeholder.svg"}
                      alt={job.Company_Name || "Company"}
                      width={40}
                      height={40}
                      className="rounded-md border border-zinc-200 dark:border-zinc-700 object-contain bg-white"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1 flex-1">
                        {job.Title || "Job Title"}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => addJob(job)}
                        disabled={isJobApplied(job.Detail_URL)}
                      >
                        {isJobApplied(job.Detail_URL) ? "Added" : "Add"}
                      </Button>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2 line-clamp-1">
                      {job.Company_Name || "Company"}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        <MapPin className="w-3 h-3" />
                        {job.Location ? job.Location.split(",")[0] : "Location not specified"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        <Briefcase className="w-3 h-3" />
                        {extractWorkType(job.Primary_Description)}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        <Clock className="w-3 h-3" />
                        {formatDate(job.Created_At || "")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 py-4">
              No jobs found matching your criteria.
            </p>
          )}
        </div>
      </div>

      <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">
        <Link
          href="#"
          className={cn(
            "w-full flex items-center justify-center gap-2",
            "py-2 px-3 rounded-lg",
            "text-xs font-medium",
            "bg-gradient-to-r from-zinc-900 to-zinc-800",
            "dark:from-zinc-50 dark:to-zinc-200",
            "text-zinc-50 dark:text-zinc-900",
            "hover:from-zinc-800 hover:to-zinc-700",
            "dark:hover:from-zinc-200 dark:hover:to-zinc-300",
            "shadow-sm hover:shadow",
            "transform transition-all duration-200",
            "hover:-translate-y-0.5",
            "active:translate-y-0",
            "focus:outline-none focus:ring-2",
            "focus:ring-zinc-500 dark:focus:ring-zinc-400",
            "focus:ring-offset-2 dark:focus:ring-offset-zinc-900",
          )}
        >
          <span>View All Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
