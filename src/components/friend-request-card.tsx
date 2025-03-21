import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { createClient } from "../../supabase/client";
import { useState } from "react";

interface FriendRequestCardProps {
  id: string;
  name?: string;
  avatar?: string;
  timestamp?: string;
  onAccept?: () => void;
  onReject?: () => void;
}

export default function FriendRequestCard({
  id,
  name = "New User",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
  timestamp = "Just now",
  onAccept,
  onReject,
}: FriendRequestCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      // Update request status
      const { error: updateError } = await supabase
        .from("friend_requests")
        .update({ status: "accepted", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) throw updateError;

      // Get the request details to create friendship
      const { data: requestData, error: fetchError } = await supabase
        .from("friend_requests")
        .select("sender_id, receiver_id")
        .eq("id", id)
        .single();

      if (fetchError) throw fetchError;

      // Create two friendship records (bidirectional)
      const { error: friendError1 } = await supabase.from("friends").insert({
        user_id: requestData.sender_id,
        friend_id: requestData.receiver_id,
      });

      if (friendError1) throw friendError1;

      const { error: friendError2 } = await supabase.from("friends").insert({
        user_id: requestData.receiver_id,
        friend_id: requestData.sender_id,
      });

      if (friendError2) throw friendError2;

      if (onAccept) onAccept();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("friend_requests")
        .update({ status: "rejected", updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      if (onReject) onReject();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{name}</div>
              <div className="text-xs text-gray-500">{timestamp}</div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={handleAccept}
              disabled={isLoading}
            >
              <Check className="h-4 w-4 mr-1" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleReject}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-1" />
              Decline
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
