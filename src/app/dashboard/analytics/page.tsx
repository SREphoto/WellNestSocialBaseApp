import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import AnalyticsDashboard from "@/components/analytics-dashboard";

export default async function AnalyticsPage() {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mood Analytics</h1>
          <p className="text-gray-600 mt-2">
            Track your emotional patterns and gain insights into your well-being
            journey
          </p>
        </div>

        <AnalyticsDashboard />
      </main>
    </div>
  );
}
