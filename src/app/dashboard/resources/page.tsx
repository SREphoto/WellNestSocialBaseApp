import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import ResourcesList from "@/components/resources-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default async function ResourcesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mental Health Resources</h1>
            <p className="text-gray-600 mt-2">
              Explore resources to support your mental health journey
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search resources..."
                className="pr-10"
              />
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto mb-8 grid-cols-4">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="mental-health">Mental Health</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="crisis">Crisis Support</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <ResourcesList />
          </TabsContent>

          <TabsContent value="mental-health" className="mt-6">
            <ResourcesList />
          </TabsContent>

          <TabsContent value="wellness" className="mt-6">
            <ResourcesList />
          </TabsContent>

          <TabsContent value="crisis" className="mt-6">
            <ResourcesList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
