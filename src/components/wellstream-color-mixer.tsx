"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { moodDescriptions } from "./mood-descriptions";

type MoodType = "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";

interface Friend {
  id: string;
  mood_type: MoodType;
}

interface WellstreamColorMixerProps {
  userId?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function WellstreamColorMixer({
  userId,
  className = "",
  children,
}: WellstreamColorMixerProps) {
  const [mixedColor, setMixedColor] = useState<string>("#8EB896"); // Default to neutral
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchFriendsAndMoods = async () => {
      setLoading(true);
      try {
        // Get current user if not provided
        let currentUserId = userId;
        if (!currentUserId) {
          const { data: userData } = await supabase.auth.getUser();
          currentUserId = userData.user?.id;
          if (!currentUserId) return;
        }

        // Get all friends
        const { data: friendsData, error: friendsError } = await supabase
          .from("friends")
          .select(
            `
            friend_id
          `,
          )
          .eq("user_id", currentUserId);

        if (friendsError) throw friendsError;

        // For each friend, get their latest mood
        const friendsWithMoods = await Promise.all(
          (friendsData || []).map(async (friend) => {
            // Get latest mood
            const { data: moodData } = await supabase
              .from("moods")
              .select("mood_type")
              .eq("user_id", friend.friend_id)
              .order("created_at", { ascending: false })
              .limit(1)
              .maybeSingle();

            return {
              id: friend.friend_id,
              mood_type: (moodData?.mood_type as MoodType) || "neutral",
            };
          }),
        );

        setFriends(friendsWithMoods);
        calculateMixedColor(friendsWithMoods);
      } catch (error) {
        console.error("Error fetching friends and moods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsAndMoods();

    // Set up realtime subscription for moods to update the mixed color
    const moodsSubscription = supabase
      .channel("moods-for-wellstream-color")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "moods" },
        () => {
          fetchFriendsAndMoods();
        },
      )
      .subscribe();

    return () => {
      moodsSubscription.unsubscribe();
    };
  }, [supabase, userId]);

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  // Helper function to convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
  };

  // Calculate the mixed color based on friends' moods
  const calculateMixedColor = (friendsList: Friend[]) => {
    if (friendsList.length === 0) {
      // Default to neutral if no friends
      setMixedColor(moodDescriptions.neutral.color);
      return;
    }

    // Get RGB values for each friend's mood color
    const rgbValues = friendsList.map((friend) => {
      const moodColor =
        moodDescriptions[friend.mood_type]?.color ||
        moodDescriptions.neutral.color;
      return hexToRgb(moodColor);
    });

    // Calculate the average RGB values
    const totalR = rgbValues.reduce((sum, rgb) => sum + rgb.r, 0);
    const totalG = rgbValues.reduce((sum, rgb) => sum + rgb.g, 0);
    const totalB = rgbValues.reduce((sum, rgb) => sum + rgb.b, 0);

    const avgR = Math.round(totalR / rgbValues.length);
    const avgG = Math.round(totalG / rgbValues.length);
    const avgB = Math.round(totalB / rgbValues.length);

    // Convert back to hex
    const mixedHexColor = rgbToHex(avgR, avgG, avgB);
    setMixedColor(mixedHexColor);
  };

  return (
    <div
      className={`transition-colors duration-500 ${className}`}
      style={{ backgroundColor: mixedColor }}
    >
      {children}
    </div>
  );
}
