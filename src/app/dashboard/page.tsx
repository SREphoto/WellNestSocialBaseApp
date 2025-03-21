import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardHome from "@/components/dashboard-home";
import SampleDataLoader from "@/components/sample-data-loader";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <DashboardHome />
        <div className="max-w-md mx-auto py-6">
          <SampleDataLoader />
        </div>
      </main>
    </>
  );
}
