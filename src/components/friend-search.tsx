"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { UserPlus, Search, Check, Clock } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar_url: string | null;
  requestStatus?: "none" | "pending" | "accepted" | "rejected";
}

export default function FriendSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [requestLoading, setRequestLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const supabase = createClient();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      // Get current user
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      if (!currentUser) throw new Error("Not authenticated");

      // Search for users by name or email
      const { data: users, error } = await supabase
        .from("users")
        .select("id, name, avatar_url")
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .neq("id", currentUser.id)
        .limit(10);

      if (error) throw error;

      // For each user, check if there's an existing friend request
      const usersWithRequestStatus = await Promise.all(
        (users || []).map(async (user) => {
          // Check if there's a pending request from current user to this user
          const { data: sentRequest } = await supabase
            .from("friend_requests")
            .select("status")
            .eq("sender_id", currentUser.id)
            .eq("receiver_id", user.id)
            .maybeSingle();

          // Check if there's a pending request from this user to current user
          const { data: receivedRequest } = await supabase
            .from("friend_requests")
            .select("status")
            .eq("sender_id", user.id)
            .eq("receiver_id", currentUser.id)
            .maybeSingle();

          // Check if they're already friends
          const { data: friendship } = await supabase
            .from("friends")
            .select("id")
            .eq("user_id", currentUser.id)
            .eq("friend_id", user.id)
            .maybeSingle();

          let requestStatus: "none" | "pending" | "accepted" | "rejected" =
            "none";

          if (friendship) {
            requestStatus = "accepted";
          } else if (sentRequest) {
            requestStatus = sentRequest.status as any;
          } else if (receivedRequest) {
            requestStatus = receivedRequest.status as any;
          }

          return {
            ...user,
            requestStatus,
          };
        }),
      );

      setSearchResults(usersWithRequestStatus);
    } catch (error) {
      console.error("Error searching for users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    setRequestLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("friend_requests").insert({
        sender_id: user.id,
        receiver_id: userId,
        status: "pending",
      });

      if (error) throw error;

      // Update the local state to reflect the sent request
      setSearchResults((prev) =>
        prev.map((result) =>
          result.id === userId
            ? { ...result, requestStatus: "pending" }
            : result,
        ),
      );
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setRequestLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getButtonForUser = (user: User) => {
    const isLoading = requestLoading[user.id] || false;

    switch (user.requestStatus) {
      case "accepted":
        return (
          <Button variant="ghost" size="sm" disabled className="text-green-600">
            <Check className="h-4 w-4 mr-1" />
            Friends
          </Button>
        );
      case "pending":
        return (
          <Button variant="ghost" size="sm" disabled className="text-amber-600">
            <Clock className="h-4 w-4 mr-1" />
            Pending
          </Button>
        );
      case "rejected":
        return (
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => sendFriendRequest(user.id)}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Try Again
          </Button>
        );
      default:
        return (
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => sendFriendRequest(user.id)}
            className="border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add Friend
          </Button>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Find Friends
      </h2>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            <Search className="h-4 w-4 mr-1" />
            Search
          </Button>
        </div>
      </form>

      {isSearching ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="space-y-3">
          {searchResults.map((user) => (
            <Card key={user.id} className="w-full">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={
                          user.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
                        }
                        alt={user.name}
                      />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{user.name}</div>
                  </div>
                  {getButtonForUser(user)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="text-center py-8 text-gray-500">
          <p>No users found matching "{searchTerm}"</p>
        </div>
      ) : null}
    </div>
  );
}
