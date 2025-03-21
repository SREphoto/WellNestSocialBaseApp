import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { moodDescriptions } from "./mood-descriptions";

interface FriendCardProps {
  name?: string;
  avatar?: string;
  mood?: "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";
  lastActive?: string;
  userId?: string;
}

export default function FriendCard({
  name = "Alex Chen",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  mood = "neutral",
  lastActive = "10 minutes ago",
  userId,
}: FriendCardProps) {
  // Get mood color and name from mood descriptions
  const moodColor =
    moodDescriptions[mood]?.color || moodDescriptions.neutral.color;
  const moodName = moodDescriptions[mood]?.name || "Neutral";

  return (
    <Card className="w-full max-w-xs bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div
        className="h-2"
        style={{
          background:
            moodDescriptions[mood]?.gradient ||
            moodDescriptions.neutral.gradient,
        }}
      ></div>
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div
              className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: moodColor }}
              title={`Mood: ${moodName}`}
            ></div>
          </div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <p className="text-xs text-gray-500 mb-1">Active {lastActive}</p>
          <p className="text-xs font-medium mb-3" style={{ color: moodColor }}>
            Feeling {moodName}
          </p>

          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2 text-green-600 border-green-200 hover:bg-green-50"
            asChild
          >
            <Link href={`/dashboard/wellstream`}>
              <MessageCircle className="h-4 w-4" />
              <span>Check In</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
