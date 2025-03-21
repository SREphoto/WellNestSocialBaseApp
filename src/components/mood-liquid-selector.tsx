"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { toast } from "./ui/use-toast";
import MoodLiquidDrops from "./mood-liquid-drops";

type MoodType = "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";

export default function MoodLiquidSelector() {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (!selectedMood) {
      toast({
        title: "Please select a mood",
        description: "Select how you're feeling before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("moods").insert({
        mood_type: selectedMood,
        message: message.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Mood updated",
        description: "Your mood has been shared with your connections",
      });

      // Reset form
      setSelectedMood(null);
      setMessage("");
    } catch (error) {
      console.error("Error submitting mood:", error);
      toast({
        title: "Something went wrong",
        description: "Failed to update your mood. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          How are you feeling?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <MoodLiquidDrops
            onMoodSelect={handleMoodSelect}
            initialMood={selectedMood}
            size="lg"
          />
        </div>
        <Textarea
          placeholder="Share more about how you're feeling... (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none"
          rows={3}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedMood}
          className="w-full bg-green-700 hover:bg-green-800"
        >
          {isSubmitting ? "Updating..." : "Share Mood"}
        </Button>
      </CardFooter>
    </Card>
  );
}
