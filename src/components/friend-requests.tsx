"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import FriendRequestCard from "./friend-request-card";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

interface FriendRequest {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar_url: string;
  } | null;
  created_at: string;
}

export default function FriendRequests() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get pending friend requests where current user is the receiver
      const { data, error } = await supabase
        .from("friend_requests")
        .select(
          `
          id,
          created_at,
          sender:sender_id(id, name, avatar_url)
        `,
        )
        .eq("receiver_id", user.id)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    // Set up realtime subscription
    const subscription = supabase
      .channel("friend-requests-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friend_requests" },
        () => {
          // Refresh the list when any change happens
          fetchRequests();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      }).format(date);
    }
  };

  const handleRequestProcessed = () => {
    fetchRequests();
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Friend Requests
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchRequests}
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
      ) : requests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No pending friend requests.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <FriendRequestCard
              key={request.id}
              id={request.id}
              name={request.sender?.name || "Unknown User"}
              avatar={
                request.sender?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.id}`
              }
              timestamp={formatDate(request.created_at)}
              onAccept={handleRequestProcessed}
              onReject={handleRequestProcessed}
            />
          ))}
        </div>
      )}
    </div>
  );
}
