"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { createClient } from "../../supabase/client";

interface CommentFormProps {
  moodId: string;
  onCommentAdded?: () => void;
}

export default function CommentForm({
  moodId,
  onCommentAdded,
}: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        mood_id: moodId,
        content: comment.trim(),
      });

      if (error) throw error;

      // Clear the form
      setComment("");

      // Notify parent component
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <Textarea
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="resize-none text-sm"
        rows={2}
      />
      <div className="flex justify-end mt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting || !comment.trim()}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </div>
    </form>
  );
}
