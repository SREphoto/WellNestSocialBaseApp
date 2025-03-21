import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";
import ProfileSettings from "@/components/profile-settings";
import MoodHistory from "@/components/mood-history";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/sign-in");
  }

  // Get user profile data
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    redirect("/dashboard");
  }

  // Get user's mood history
  const { data: moodData, error: moodError } = await supabase
    .from("moods")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false });

  if (moodError) {
    console.error("Error fetching mood data:", moodError);
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            <TabsTrigger value="mood-history">Mood History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <ProfileSettings user={userData} />
          </TabsContent>

          <TabsContent value="mood-history" className="mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-2xl font-semibold mb-6">Your Mood History</h2>
              {moodData && moodData.length > 0 ? (
                <MoodHistory moods={moodData} />
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  You haven't tracked any moods yet. Start tracking your mood to
                  see your history here.
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
