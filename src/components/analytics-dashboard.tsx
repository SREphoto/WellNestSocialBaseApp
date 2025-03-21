"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { moodDescriptions } from "./mood-descriptions";

type MoodType = "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";

interface MoodCount {
  mood_type: MoodType;
  count: number;
}

interface MoodTrend {
  date: string;
  mood_type: MoodType;
}

export default function AnalyticsDashboard() {
  const [moodCounts, setMoodCounts] = useState<MoodCount[]>([]);
  const [moodTrends, setMoodTrends] = useState<MoodTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchMoodData = async () => {
      setLoading(true);
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        // Get mood counts by type
        const { data: countsData, error: countsError } = await supabase
          .from("moods")
          .select("mood_type")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (countsError) throw countsError;

        // Process mood counts
        const counts: Record<MoodType, number> = {
          serene: 0,
          calm: 0,
          neutral: 0,
          uneasy: 0,
          alert: 0,
          urgent: 0,
        };

        countsData.forEach((mood) => {
          counts[mood.mood_type as MoodType] += 1;
        });

        const formattedCounts = Object.entries(counts).map(
          ([mood_type, count]) => ({
            mood_type: mood_type as MoodType,
            count,
          }),
        );

        setMoodCounts(formattedCounts);

        // Get mood trends (last 10 entries)
        const { data: trendsData, error: trendsError } = await supabase
          .from("moods")
          .select("mood_type, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (trendsError) throw trendsError;

        // Process mood trends
        const formattedTrends = trendsData.map((mood) => ({
          date: new Date(mood.created_at).toLocaleDateString(),
          mood_type: mood.mood_type as MoodType,
        }));

        setMoodTrends(formattedTrends);
      } catch (error) {
        console.error("Error fetching mood data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [supabase]);

  const getMostFrequentMood = (): MoodType | null => {
    if (moodCounts.length === 0) return null;
    return moodCounts.reduce((prev, current) =>
      prev.count > current.count ? prev : current,
    ).mood_type;
  };

  const mostFrequentMood = getMostFrequentMood();

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Total Mood Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {moodCounts.reduce((sum, item) => sum + item.count, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Most Frequent Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {mostFrequentMood && (
                    <>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor:
                            moodDescriptions[mostFrequentMood]?.color,
                        }}
                      ></div>
                      <div className="text-xl font-bold">
                        {moodDescriptions[mostFrequentMood]?.name ||
                          mostFrequentMood}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Last Updated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">
                  {moodTrends.length > 0 ? moodTrends[0].date : "Never"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mood Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Mood Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodCounts.map((item) => (
                  <div key={item.mood_type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              moodDescriptions[item.mood_type]?.color,
                          }}
                        ></div>
                        <span className="text-sm font-medium">
                          {moodDescriptions[item.mood_type]?.name ||
                            item.mood_type}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {item.count}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(item.count / moodCounts.reduce((sum, i) => sum + i.count, 0)) * 100}%`,
                          background:
                            moodDescriptions[item.mood_type]?.gradient ||
                            moodDescriptions.neutral.gradient,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Mood History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Mood History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex overflow-x-auto pb-2">
                <div className="flex space-x-2">
                  {moodTrends.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center space-y-1 min-w-[60px]"
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            moodDescriptions[item.mood_type]?.gradient ||
                            moodDescriptions.neutral.gradient,
                        }}
                        title={
                          moodDescriptions[item.mood_type]?.name ||
                          item.mood_type
                        }
                      ></div>
                      <span className="text-xs text-gray-500">
                        {item.date.split("/").slice(0, 2).join("/")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
