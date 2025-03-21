"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import MoodCard from "./mood-card";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

type MoodType = "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";

interface Mood {
  id: string;
  mood_type: MoodType;
  message: string | null;
  created_at: string;
  user: {
    name: string;
    avatar_url: string;
  } | null;
}

export default function WellStream() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchMoods = async () => {
    setLoading(true);
    try {
      const { data: moodsData, error: moodsError } = await supabase
        .from("moods")
        .select(
          `
          id,
          mood_type,
          message,
          created_at,
          user:user_id(name, avatar_url)
        `,
        )
        .order("created_at", { ascending: false })
        .limit(20);

      if (moodsError) throw moodsError;
      setMoods(moodsData || []);
    } catch (error) {
      console.error("Error fetching moods:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoods();

    // Set up realtime subscription for moods
    const moodsSubscription = supabase
      .channel("moods-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "moods" },
        (payload) => {
          // Fetch the complete mood data with user info
          supabase
            .from("moods")
            .select(
              `
              id,
              mood_type,
              message,
              created_at,
              user:user_id(name, avatar_url)
            `,
            )
            .eq("id", payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setMoods((current) => [data, ...current.slice(0, 19)]);
              }
            });
        },
      )
      .subscribe();

    return () => {
      moodsSubscription.unsubscribe();
    };
  }, [supabase]);

  const formatDate = (dateString: string) => {
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
        hour: "numeric",
        minute: "numeric",
      }).format(date);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">WellStream</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchMoods}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : moods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No mood updates yet.</p>
          <p className="text-sm mt-2">
            Connect with friends to see their updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {moods.map((mood) => (
            <MoodCard
              key={mood.id}
              id={mood.id}
              name={mood.user?.name || "Anonymous"}
              avatar={
                mood.user?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${mood.id}`
              }
              mood={mood.mood_type}
              timestamp={formatDate(mood.created_at)}
              message={mood.message || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
