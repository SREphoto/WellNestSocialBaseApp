"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  UserCircle,
  Users,
  BarChart,
  Bell,
  Plus,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import MoodLiquidDrops from "./mood-liquid-drops";
import WellStream from "./well-stream";
import FriendsList from "./friends-list";
import { moodDescriptions } from "./mood-descriptions";

type MoodType = "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";

interface UserProfile {
  id: string;
  name: string;
  full_name: string | null;
  avatar_url: string | null;
  latest_mood?: MoodType;
  mood_updated_at?: string;
}

export default function DashboardHome() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [friendCount, setFriendCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("id, name, full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        // Get latest mood
        const { data: moodData, error: moodError } = await supabase
          .from("moods")
          .select("mood_type, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (moodError) throw moodError;

        // Get friend count
        const { count: friendsCount, error: friendsError } = await supabase
          .from("friends")
          .select("id", { count: "exact" })
          .eq("user_id", user.id);

        if (friendsError) throw friendsError;

        // Get pending friend requests count
        const { count: requestsCount, error: requestsError } = await supabase
          .from("friend_requests")
          .select("id", { count: "exact" })
          .eq("receiver_id", user.id)
          .eq("status", "pending");

        if (requestsError) throw requestsError;

        setUserProfile({
          ...profileData,
          latest_mood: moodData?.mood_type as MoodType,
          mood_updated_at: moodData?.created_at,
        });
        setFriendCount(friendsCount || 0);
        setPendingRequests(requestsCount || 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Set up realtime subscriptions
    const moodsSubscription = supabase
      .channel("moods-dashboard-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "moods" },
        () => {
          fetchUserData();
        },
      )
      .subscribe();

    const friendsSubscription = supabase
      .channel("friends-dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friends" },
        () => {
          fetchUserData();
        },
      )
      .subscribe();

    const requestsSubscription = supabase
      .channel("requests-dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friend_requests" },
        () => {
          fetchUserData();
        },
      )
      .subscribe();

    return () => {
      moodsSubscription.unsubscribe();
      friendsSubscription.unsubscribe();
      requestsSubscription.unsubscribe();
    };
  }, [supabase]);

  const formatLastActive = (dateString?: string) => {
    if (!dateString) return "Never";

    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - User Profile */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <Card className="overflow-hidden">
            {userProfile?.latest_mood && (
              <div
                className="h-2"
                style={{
                  background:
                    moodDescriptions[userProfile.latest_mood]?.gradient ||
                    moodDescriptions.neutral.gradient,
                }}
              ></div>
            )}
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={
                      userProfile?.avatar_url ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userProfile?.id}`
                    }
                    alt={userProfile?.full_name || "User"}
                  />
                  <AvatarFallback>
                    {(userProfile?.full_name || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold mb-1">
                  {userProfile?.full_name || "Welcome"}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {userProfile?.latest_mood ? (
                    <span
                      className="font-medium"
                      style={{
                        color:
                          moodDescriptions[userProfile.latest_mood]?.color ||
                          moodDescriptions.neutral.color,
                      }}
                    >
                      Feeling{" "}
                      {moodDescriptions[userProfile.latest_mood]?.name ||
                        "Neutral"}{" "}
                      • Updated {formatLastActive(userProfile.mood_updated_at)}
                    </span>
                  ) : (
                    "Share how you're feeling below"
                  )}
                </p>

                <div className="w-full mb-6">
                  <MoodLiquidDrops
                    autoSubmit={true}
                    size="sm"
                    showLabels={false}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <Link href="/dashboard/profile" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <UserCircle className="h-4 w-4" />
                      Profile
                    </Button>
                  </Link>
                  <Link href="/dashboard/mood" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <BarChart className="h-4 w-4" />
                      Mood
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Friends Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Friends & Connections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Your Friends</span>
                  <span className="font-medium">{friendCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Requests</span>
                  <span className="font-medium">{pendingRequests}</span>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <Link href="/dashboard/friends">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Manage Friends
                    </Button>
                  </Link>
                  <Link href="/dashboard/friends?tab=search">
                    <Button
                      variant="outline"
                      className="w-full flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Find Friends
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  href="/dashboard/wellstream"
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <span className="text-sm">WellStream Feed</span>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/dashboard/mood"
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <span className="text-sm">Mood Tracking</span>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </Link>
                <Link
                  href="/dashboard/profile"
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <span className="text-sm">Profile Settings</span>
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="feed">WellStream Feed</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">WellStream</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
              <WellStream />
            </TabsContent>

            <TabsContent value="friends" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Your Friends</h2>
                <Link href="/dashboard/friends">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </Link>
              </div>
              <FriendsList limit={6} compact={true} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
