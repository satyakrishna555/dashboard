import { cn } from "@/lib/utils"
import { Calendar, MapPin, Briefcase, ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Job } from "../../lib/data"
import {
  formatDate,
  extractWorkType,
  truncateDescription,
  extractSalary,
  getValidLogoUrl,
  extractSkills,
} from "../../lib/data"

interface JobDetailsProps {
  jobs?: Job[]
  className?: string
}

export default function JobDetails({ jobs = [], className }: JobDetailsProps) {
  return (
    <div className={cn("w-full overflow-x-auto scrollbar-none", className)}>
      <div className="flex gap-3 min-w-full p-1">
        {jobs.slice(0, 3).map((job) => (
          <div
            key={job.Detail_URL || `job-detail-${Math.random()}`}
            className={cn(
              "flex flex-col",
              "w-[320px] shrink-0",
              "bg-white dark:bg-zinc-900/70",
              "rounded-xl",
              "border border-zinc-100 dark:border-zinc-800",
              "hover:border-zinc-200 dark:hover:border-zinc-700",
              "transition-all duration-200",
              "shadow-sm backdrop-blur-xl",
            )}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={getValidLogoUrl(job.Company_Logo) || "/placeholder.svg"}
                    alt={job.Company_Name || "Company"}
                    width={40}
                    height={40}
                    className="rounded-md border border-zinc-200 dark:border-zinc-700 object-contain bg-white"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {job.Company_Name || "Company"}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {job.Primary_Description || "No description"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  {job.Title || "Job Title"}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-4">
                  {truncateDescription(job.Description, 200)}
                </p>
              </div>

              {extractSalary(job.Description) && (
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {extractSalary(job.Description)}
                  </span>
                </div>
              )}

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
                  <Calendar className="w-3 h-3" />
                  {formatDate(job.Created_At || "")}
                </span>
              </div>

              {/* Display skills */}
              <div className="mt-2">
                <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {extractSkills(job.Description)
                    .slice(0, 5)
                    .map((skill, index) => (
                      <span
                        key={index}
                        className="text-[10px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
              <Link
                href={job.Detail_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "w-full flex items-center justify-center gap-2",
                  "py-2.5 px-3",
                  "text-xs font-medium",
                  "text-zinc-600 dark:text-zinc-400",
                  "hover:text-zinc-900 dark:hover:text-zinc-100",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                  "transition-colors duration-200",
                )}
              >
                Apply Now
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
