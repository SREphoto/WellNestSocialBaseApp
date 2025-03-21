"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Heart, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { moodDescriptions } from "./mood-descriptions";
import CommentList from "./comment-list";
import CommentForm from "./comment-form";
import { Button } from "./ui/button";

interface MoodCardWithCommentsProps {
  id?: string;
  name?: string;
  avatar?: string;
  mood?: "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";
  timestamp?: string;
  message?: string;
  commentCount?: number;
}

export default function MoodCardWithComments({
  id = "",
  name = "Sarah Johnson",
  avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  mood = "neutral",
  timestamp = "2 hours ago",
  message = "Feeling pretty good today. Had a nice walk in the park and caught up with an old friend.",
  commentCount = 3,
}: MoodCardWithCommentsProps) {
  const [showComments, setShowComments] = useState(false);
  const [supportCount, setSupportCount] = useState(0);
  const [hasSupported, setHasSupported] = useState(false);

  // Get mood color and gradient from mood descriptions
  const moodColor =
    moodDescriptions[mood]?.color || moodDescriptions.neutral.color;
  const moodGradient =
    moodDescriptions[mood]?.gradient || moodDescriptions.neutral.gradient;

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleSupport = () => {
    if (!hasSupported) {
      setSupportCount(supportCount + 1);
      setHasSupported(true);
    } else {
      setSupportCount(supportCount - 1);
      setHasSupported(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-2" style={{ background: moodGradient }}></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="w-5 h-5 rounded-full drop-shadow-sm"
                  style={{
                    background: moodGradient,
                  }}
                ></div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium">
                  {moodDescriptions[mood]?.name || mood}
                </p>
                <p className="text-xs text-gray-500">
                  {moodDescriptions[mood]?.description}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 mb-4">{message}</p>
        <div className="flex items-center space-x-4 text-gray-500 text-sm">
          <button
            className={`flex items-center space-x-1 ${hasSupported ? "text-green-600" : "hover:text-green-600"}`}
            onClick={handleSupport}
          >
            <Heart
              className={`h-4 w-4 ${hasSupported ? "fill-current" : ""}`}
            />
            <span>Support {supportCount > 0 && `(${supportCount})`}</span>
          </button>
          <button
            className="flex items-center space-x-1 hover:text-green-600"
            onClick={toggleComments}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Comments {commentCount > 0 && `(${commentCount})`}</span>
            {showComments ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <CommentList moodId={id} />
            <CommentForm moodId={id} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
