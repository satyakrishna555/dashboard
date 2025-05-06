"use client"

import { Button } from "@/components/ui/button"
import { Database } from "lucide-react"
import { exportForPowerBI } from "@/lib/power-bi-export"
import type { Job } from "@/lib/data"

interface PowerBIExportButtonProps {
  jobs: Job[]
}

export default function PowerBIExportButton({ jobs }: PowerBIExportButtonProps) {
  return (
    <Button variant="outline" size="sm" className="gap-1" onClick={() => exportForPowerBI(jobs)}>
      <Database className="h-4 w-4" />
      <span>Export for Power BI</span>
    </Button>
  )
}
