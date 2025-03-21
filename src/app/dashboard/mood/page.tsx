import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import MoodTracker from "@/components/mood-tracker";
import MoodHistory from "@/components/mood-history";

export default async function MoodPage() {
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
        <h1 className="text-3xl font-bold mb-8">Mood Tracking</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <MoodTracker />
          </div>
          <div>
            <MoodHistory />
          </div>
        </div>
      </main>
    </div>
  );
}
