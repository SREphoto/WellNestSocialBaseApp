"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import FriendCard from "./friend-card";
import { Button } from "./ui/button";
import { RefreshCw, UserX } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface Friend {
  id: string;
  friend: {
    id: string;
    name: string;
    avatar_url: string | null;
    mood_type?: "happy" | "content" | "neutral" | "sad" | "stressed";
    last_active?: string;
  } | null;
}

interface FriendsListProps {
  limit?: number;
  compact?: boolean;
}

export default function FriendsList({
  limit,
  compact = false,
}: FriendsListProps = {}) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingFriend, setRemovingFriend] = useState<string | null>(null);
  const supabase = createClient();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get all friends
      let query = supabase
        .from("friends")
        .select(
          `
          id,
          friend:friend_id(id, name, avatar_url)
        `,
        )
        .eq("user_id", user.id);

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      // For each friend, get their latest mood if available
      const friendsWithMood = await Promise.all(
        (data || []).map(async (friend) => {
          if (!friend.friend) return friend;

          // Get latest mood
          const { data: moodData } = await supabase
            .from("moods")
            .select("mood_type, created_at")
            .eq("user_id", friend.friend.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...friend,
            friend: {
              ...friend.friend,
              mood_type: moodData?.mood_type || "neutral",
              last_active: moodData?.created_at || new Date().toISOString(),
            },
          };
        }),
      );

      setFriends(friendsWithMood);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();

    // Set up realtime subscription for friends table
    const friendsSubscription = supabase
      .channel("friends-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friends" },
        () => {
          fetchFriends();
        },
      )
      .subscribe();

    // Set up realtime subscription for moods table to update friend moods
    const moodsSubscription = supabase
      .channel("moods-for-friends-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "moods" },
        () => {
          fetchFriends();
        },
      )
      .subscribe();

    return () => {
      friendsSubscription.unsubscribe();
      moodsSubscription.unsubscribe();
    };
  }, []);

  const formatLastActive = (dateString: string) => {
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

  const removeFriend = async (friendshipId: string, friendId: string) => {
    setRemovingFriend(friendshipId);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Delete the friendship record
      const { error: deleteError } = await supabase
        .from("friends")
        .delete()
        .eq("id", friendshipId);

      if (deleteError) throw deleteError;

      // Delete the reciprocal friendship record
      const { error: reciprocalDeleteError } = await supabase
        .from("friends")
        .delete()
        .eq("user_id", friendId)
        .eq("friend_id", user.id);

      if (reciprocalDeleteError) throw reciprocalDeleteError;

      // Update local state
      setFriends((prev) => prev.filter((f) => f.id !== friendshipId));
    } catch (error) {
      console.error("Error removing friend:", error);
    } finally {
      setRemovingFriend(null);
    }
  };

  return (
    <div
      className={`w-full ${!compact ? "max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4" : ""}`}
    >
      {!compact && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">My Friends</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchFriends}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : friends.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>You don't have any friends yet.</p>
          <p className="text-sm mt-2">
            Use the search feature to find and connect with friends.
          </p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 ${compact ? "sm:grid-cols-2 md:grid-cols-3" : "sm:grid-cols-2 md:grid-cols-3"} gap-4`}
        >
          {friends.map((friendship) => (
            <div key={friendship.id} className="relative">
              <FriendCard
                name={friendship.friend?.name || "Unknown User"}
                avatar={
                  friendship.friend?.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${friendship.friend?.id}`
                }
                mood={friendship.friend?.mood_type || "neutral"}
                lastActive={formatLastActive(
                  friendship.friend?.last_active || new Date().toISOString(),
                )}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-gray-500 hover:text-red-500 bg-white/80 hover:bg-white rounded-full h-7 w-7 p-1"
                  >
                    <UserX className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Friend</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove {friendship.friend?.name}{" "}
                      from your friends list? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        friendship.friend &&
                        removeFriend(friendship.id, friendship.friend.id)
                      }
                      className="bg-red-500 hover:bg-red-600"
                    >
                      {removingFriend === friendship.id
                        ? "Removing..."
                        : "Remove"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
