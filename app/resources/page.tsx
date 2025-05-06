import Layout from "@/components/kokonutui/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react"; // Using FileText icon

export default function ResourcesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              The Resources section is currently under development.
              We'll update this page soon with useful links and materials.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
