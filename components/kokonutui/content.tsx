import { Briefcase, MapPin, Building } from "lucide-react"
import JobList from "./job-list"
import JobDetails from "./job-details"
import RecentJobs from "./recent-jobs"
import AnalyticsDashboard from "./analytics-dashboard"
import { getJobsData } from "@/lib/data.server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Content() {
  const jobs = await getJobsData()

  return (
    <div className="flex flex-col gap-6">
      {/* Existing Tabs */}
      <Tabs defaultValue="jobs" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2 ">
                <Briefcase className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
                Job Listings
              </h2>
              <div className="flex-1">
                <JobList jobs={jobs} className="h-full" />
              </div>
            </div>
            <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
                Companies
              </h2>
              <div className="flex-1">
                <RecentJobs jobs={jobs} className="h-full" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col items-start justify-start border border-gray-200 dark:border-[#1F1F23]">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-left flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-50" />
              Job Details
            </h2>
            <JobDetails jobs={jobs} />
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 flex flex-col border border-gray-200 dark:border-[#1F1F23]">
            <AnalyticsDashboard jobs={jobs} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
