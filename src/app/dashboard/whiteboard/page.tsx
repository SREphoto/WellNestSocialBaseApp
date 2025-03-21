import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import Whiteboard from "@/components/whiteboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function WhiteboardPage() {
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
        <h1 className="text-3xl font-bold mb-8">Shared Whiteboard</h1>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto mb-8 grid-cols-2">
            <TabsTrigger value="personal">Personal Board</TabsTrigger>
            <TabsTrigger value="shared">Shared Boards</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <Whiteboard />
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Shared with Sarah
                </h2>
                <Whiteboard friendId="00000000-0000-0000-0000-000000000001" />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Shared with Alex
                </h2>
                <Whiteboard friendId="00000000-0000-0000-0000-000000000002" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
