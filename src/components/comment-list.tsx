"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar_url: string | null;
  } | null;
}

interface CommentListProps {
  moodId: string;
}

export default function CommentList({ moodId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id,
          content,
          created_at,
          user:user_id(name, avatar_url)
        `,
        )
        .eq("mood_id", moodId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();

    // Set up realtime subscription
    const subscription = supabase
      .channel(`comments-${moodId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `mood_id=eq.${moodId}`,
        },
        (payload) => {
          // Fetch the complete comment data with user info
          supabase
            .from("comments")
            .select(
              `
              id,
              content,
              created_at,
              user:user_id(name, avatar_url)
            `,
            )
            .eq("id", payload.new.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setComments((current) => [...current, data]);
              }
            });
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [moodId, supabase]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="text-center py-2 text-sm text-gray-500">
        Loading comments...
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-2 text-sm text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                comment.user?.avatar_url ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.id}`
              }
              alt={comment.user?.name || "User"}
            />
            <AvatarFallback>
              {(comment.user?.name || "U").charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 bg-gray-50 rounded-lg p-2">
            <div className="flex justify-between items-start">
              <span className="font-medium text-sm">
                {comment.user?.name || "Anonymous"}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(comment.created_at)}
              </span>
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
