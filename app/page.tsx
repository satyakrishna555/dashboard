import { redirect } from "next/navigation"
import Layout from "@/components/kokonutui/layout"

export default function Home() {
  // redirect("/dashboard") 
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome content will be added here */}
        <div className="bg-white dark:bg-[#0F0F12] rounded-xl p-6 border border-gray-200 dark:border-[#1F1F23]">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to the Job Dashboard!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            This dashboard helps you track and analyze job market data scraped from various sources.
            Navigate using the sidebar to:
          </p>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mt-2 space-y-1">
            <li>View the main **Dashboard** for job listings and company overviews.</li>
            <li>**Explore** companies present in the dataset.</li>
            <li>Manage your saved jobs in **My Applications**.</li>
            <li>Search external job portals via **Job Search**.</li>
            <li>Analyze trends in the **Analytics Dashboard** (under the Dashboard tab).</li>
          </ul>
        </div>
      </div>
    </Layout>
  )
}
