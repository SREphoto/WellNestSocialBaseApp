import DashboardNavbar from "@/components/dashboard-navbar";
import FriendsList from "@/components/friends-list";
import FriendRequests from "@/components/friend-requests";
import FriendSearch from "@/components/friend-search";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

interface FriendsPageProps {
  searchParams?: { tab?: string };
}

export default async function FriendsPage({ searchParams }: FriendsPageProps) {
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
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Friends</h1>
            <p className="text-muted-foreground">
              Connect with friends and family to share your wellness journey.
            </p>
          </header>

          <Tabs
            defaultValue={searchParams?.tab || "friends"}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="friends">My Friends</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="search">Find Friends</TabsTrigger>
            </TabsList>
            <TabsContent value="friends" className="mt-6">
              <FriendsList />
            </TabsContent>
            <TabsContent value="requests" className="mt-6">
              <FriendRequests />
            </TabsContent>
            <TabsContent value="search" className="mt-6">
              <FriendSearch />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
