import { cn } from "@/lib/utils"
import { ArrowRight, Building, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { Job } from "../../lib/data"
import { formatDate, getValidLogoUrl } from "../../lib/data"

interface RecentJobsProps {
  jobs?: Job[]
  className?: string
}

export default function RecentJobs({ jobs = [], className }: RecentJobsProps) {
  // Get unique companies with null checks
  const uniqueCompanies = Array.from(new Set(jobs.map((job) => job.Company_Name))).map((companyName) => {
    const companyJobs = jobs.filter((job) => job.Company_Name === companyName)
    return {
      name: companyName || "Unknown Company",
      logo: companyJobs[0]?.Company_Logo,
      jobCount: companyJobs.length,
      latestJob: companyJobs.sort(
        (a, b) => new Date(b.Created_At || "").getTime() - new Date(a.Created_At || "").getTime(),
      )[0],
    }
  })

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
            Top Companies
            <span className="text-xs font-normal text-zinc-600 dark:text-zinc-400 ml-1">
              ({uniqueCompanies.length})
            </span>
          </h2>
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Hiring Now</span>
        </div>

        <div className="space-y-2">
          {uniqueCompanies.map((company) => (
            <div
              key={company.name}
              className={cn(
                "group flex items-center gap-3",
                "p-3 rounded-lg",
                "border border-zinc-100 dark:border-zinc-800",
                "hover:border-zinc-200 dark:hover:border-zinc-700",
                "hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
                "transition-all duration-200",
              )}
            >
              <div className="shrink-0">
                <Image
                  src={getValidLogoUrl(company.logo) || "/placeholder.svg"}
                  alt={company.name}
                  width={48}
                  height={48}
                  className="rounded-md border border-zinc-200 dark:border-zinc-700 object-contain bg-white"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">{company.name}</h3>
                <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {company.jobCount} {company.jobCount === 1 ? "job" : "jobs"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {company.latestJob?.Location ? company.latestJob.Location.split(",")[0] : "Location not specified"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(company.latestJob?.Created_At || "")}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
          <span>View All Companies</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
