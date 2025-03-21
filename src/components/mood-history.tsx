"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SmilePlus,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  Calendar,
} from "lucide-react";

type MoodType = "happy" | "content" | "neutral" | "sad" | "stressed";

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

export default function MoodHistory() {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const { data, error } = await supabase
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
          .limit(10);

        if (error) throw error;
        setMoods(data || []);
      } catch (error) {
        console.error("Error fetching mood history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoods();

    // Set up realtime subscription
    const subscription = supabase
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
                setMoods((current) => [data, ...current.slice(0, 9)]);
              }
            });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getMoodIcon = (mood: MoodType) => {
    switch (mood) {
      case "happy":
        return <SmilePlus className="h-5 w-5 text-green-600" />;
      case "content":
        return <Smile className="h-5 w-5 text-blue-600" />;
      case "neutral":
        return <Meh className="h-5 w-5 text-yellow-600" />;
      case "sad":
        return <Frown className="h-5 w-5 text-orange-600" />;
      case "stressed":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Meh className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <span>Your Mood History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">Loading your mood history...</div>
        ) : moods.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            You haven't shared any moods yet. Start tracking how you feel!
          </div>
        ) : (
          <div className="space-y-4">
            {moods.map((mood) => (
              <div key={mood.id} className="border-b pb-3 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getMoodIcon(mood.mood_type)}
                    <span className="font-medium capitalize">
                      {mood.mood_type}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(mood.created_at)}
                  </span>
                </div>
                {mood.message && (
                  <p className="text-gray-700 text-sm">{mood.message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
