"use client"

import { useState, useEffect } from "react"
import { Search, Download, Filter, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getJobStatistics, extractWorkType, extractSkills } from "@/lib/data"
import type { Job } from "@/lib/data"
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
} from "recharts"

// Import PowerBIExportButton
import dynamic from 'next/dynamic'
const PowerBIExportButton = dynamic(() => import('./power-bi-export-button'), { ssr: false })

interface AnalyticsDashboardProps {
  jobs: Job[]
}

export default function AnalyticsDashboard({ jobs }: AnalyticsDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs)
  const [activeTab, setActiveTab] = useState("overview")
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("all")

  // Get statistics for the dashboard
  const stats = getJobStatistics(filteredJobs)

  // Colors for charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#8dd1e1",
    "#a4de6c",
    "#d0ed57",
  ]

  // Filter jobs based on search term and work type
  useEffect(() => {
    let tempJobs = jobs

    // Apply work type filter first
    if (workTypeFilter !== "all") {
      tempJobs = tempJobs.filter((job) => {
        const workType = extractWorkType(job.Primary_Description).toLowerCase()
        return workType === workTypeFilter
      })
    }

    // Then apply search term filter
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      tempJobs = tempJobs.filter(
        (job) =>
          job.Title.toLowerCase().includes(lowerSearchTerm) ||
          job.Company_Name.toLowerCase().includes(lowerSearchTerm) ||
          (job.Location && job.Location.toLowerCase().includes(lowerSearchTerm)),
      )
    }

    setFilteredJobs(tempJobs)
  }, [jobs, searchTerm, workTypeFilter])

  // Function to export data as CSV
  const exportToCSV = () => {
    const headers = ["Title", "Company", "Location", "Work Type", "Created At", "Skills"]

    const csvData = filteredJobs.map((job) => [
      job.Title || "",
      job.Company_Name || "",
      job.Location || "",
      extractWorkType(job.Primary_Description),
      job.Created_At || "",
      extractSkills(job.Description).join(", "),
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "job_data.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Job Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive analysis of job market data</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search jobs..."
              className="pl-8 pr-4 py-2 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span>Filter ({workTypeFilter !== 'all' ? workTypeFilter.charAt(0).toUpperCase() + workTypeFilter.slice(1) : 'All'})</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setWorkTypeFilter("all")}>
                All Jobs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWorkTypeFilter("remote")}>
                Remote Jobs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWorkTypeFilter("hybrid")}>
                Hybrid Jobs
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setWorkTypeFilter("on-site")}>
                On-site Jobs
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" className="gap-1" onClick={exportToCSV}>
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>

          <PowerBIExportButton jobs={filteredJobs} />
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalJobs}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">From {stats.companiesCount} companies</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Remote Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.remoteJobs}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((stats.remoteJobs / stats.totalJobs) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Hybrid Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.hybridJobs}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((stats.hybridJobs / stats.totalJobs) * 100)}% of total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">On-site Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.onsiteJobs}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Math.round((stats.onsiteJobs / stats.totalJobs) * 100)}% of total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Job Type Distribution */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Job Type Distribution</CardTitle>
              <CardDescription>Breakdown of remote, hybrid, and on-site positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "Remote", value: stats.remoteJobs },
                        { name: "Hybrid", value: stats.hybridJobs },
                        { name: "On-site", value: stats.onsiteJobs },
                        {
                          name: "Not Specified",
                          value: stats.totalJobs - stats.remoteJobs - stats.hybridJobs - stats.onsiteJobs,
                        },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: "Remote", value: stats.remoteJobs },
                        { name: "Hybrid", value: stats.hybridJobs },
                        { name: "On-site", value: stats.onsiteJobs },
                        {
                          name: "Not Specified",
                          value: stats.totalJobs - stats.remoteJobs - stats.hybridJobs - stats.onsiteJobs,
                        },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Companies */}
          <Card>
            <CardHeader>
              <CardTitle>Top Companies Hiring</CardTitle>
              <CardDescription>Companies with the most job listings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={stats.topCompanies}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="company" tick={{ fontSize: 12 }} width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Job Count" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Jobs by Date */}
          <Card>
            <CardHeader>
              <CardTitle>Job Postings Over Time</CardTitle>
              <CardDescription>Number of jobs posted by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={stats.jobsByDate} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Job Count" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          {/* Top Locations */}
          <Card>
            <CardHeader>
              <CardTitle>Top Job Locations</CardTitle>
              <CardDescription>Cities with the most job opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={stats.topLocations} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Job Count" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Location Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Location Distribution</CardTitle>
              <CardDescription>Percentage of jobs by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={stats.topLocations}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="location"
                      label={({ location, percent }) => `${location}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.topLocations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          {/* Top Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Most In-Demand Skills</CardTitle>
              <CardDescription>Skills mentioned most frequently in job descriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={stats.skillsDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Mentions" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Skills Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Distribution</CardTitle>
              <CardDescription>Percentage breakdown of top skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={stats.skillsDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="skill"
                      label={({ skill, percent }) => `${skill}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {stats.skillsDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Job Postings Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Job Postings Over Time</CardTitle>
                <CardDescription>Number of jobs posted by date</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={stats.jobsByDate} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} name="Job Count" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top 10 Job Titles */}
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Job Titles</CardTitle>
                <CardDescription>Most frequently mentioned job titles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={stats.topJobTitles} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="title" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" name="Mentions" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
