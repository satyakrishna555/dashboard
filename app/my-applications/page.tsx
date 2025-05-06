"use client"

import { useApplications } from "@/context/applications-context";
import JobList from "@/components/kokonutui/job-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MyApplicationsPage() {
  const { appliedJobs } = useApplications();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>
            Here are the jobs you've added to your list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appliedJobs.length > 0 ? (
            <JobList jobs={appliedJobs} className="max-w-none shadow-none border-none" />
          ) : (
            <p className="text-center text-zinc-500 dark:text-zinc-400">
              You haven't added any jobs yet. Browse jobs and click "Add" to save them here.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
