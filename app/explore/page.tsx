import Layout from "@/components/kokonutui/layout";
import { getJobsData } from "@/lib/data.server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getValidLogoUrl } from "@/lib/data"; // Assuming this is correctly exported
import Image from "next/image";
import Link from "next/link";
import { Building } from "lucide-react";

export default async function ExplorePage() {
  const jobs = await getJobsData();

  // Get unique companies with logo and count
  const companyMap = new Map<string, { logo: string | null; count: number; }>();
  jobs.forEach(job => {
    if (job.Company_Name) {
      const existing = companyMap.get(job.Company_Name);
      const logo = getValidLogoUrl(job.Company_Logo);
      if (existing) {
        existing.count++;
        // Optionally update logo if a better one is found (e.g., not null)
        if (!existing.logo && logo) {
           existing.logo = logo;
        }
      } else {
        companyMap.set(job.Company_Name, { logo: logo, count: 1 });
      }
    }
  });

  const uniqueCompanies = Array.from(companyMap.entries()).map(([name, data]) => ({ name, ...data }));
  uniqueCompanies.sort((a, b) => b.count - a.count); // Sort by job count

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Building className="w-6 h-6" /> Explore Companies
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uniqueCompanies.map((company) => (
            <Card key={company.name} className="hover:shadow-md transition-shadow duration-200">
              {/* Make the card clickable - Link could go to a company detail page later */}
              {/* <Link href={`/company/${encodeURIComponent(company.name)}`}> */}
                <a className="block">
                  <CardHeader className="flex flex-row items-center gap-4 p-4">
                    <Image
                      src={company.logo || "/placeholder.svg"} // Fallback placeholder
                      alt={`${company.name} logo`}
                      width={40}
                      height={40}
                      className="rounded-md border border-zinc-200 dark:border-zinc-700 object-contain bg-white"
                    />
                    <CardTitle className="text-base font-semibold line-clamp-2">{company.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {company.count} {company.count === 1 ? 'job' : 'jobs'} listed
                    </p>
                  </CardContent>
                </a>
              {/* </Link> */}
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
