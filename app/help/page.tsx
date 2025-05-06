import Layout from "@/components/kokonutui/layout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6" />
              Help Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              The Help section is currently under development.
              We'll update this page soon with helpful resources and guides.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
