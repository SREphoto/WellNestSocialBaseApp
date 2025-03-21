"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { toast } from "./ui/use-toast";
import { moodDescriptions } from "./mood-descriptions";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

type MoodType = "serene" | "calm" | "neutral" | "uneasy" | "alert" | "urgent";

interface MoodLiquidDropsProps {
  onMoodSelect?: (mood: MoodType) => void;
  initialMood?: MoodType | null;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
  autoSubmit?: boolean;
}

export default function MoodLiquidDrops({
  onMoodSelect,
  initialMood = null,
  showLabels = true,
  size = "md",
  autoSubmit = false,
}: MoodLiquidDropsProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(
    initialMood,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();

  // Size mappings
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const handleMoodSelect = async (mood: MoodType) => {
    setSelectedMood(mood);

    if (onMoodSelect) {
      onMoodSelect(mood);
    }

    if (autoSubmit) {
      await submitMood(mood);
    }
  };

  const submitMood = async (mood: MoodType) => {
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("moods").insert({
        mood_type: mood,
        message: null,
      });

      if (error) throw error;

      toast({
        title: "Mood updated",
        description: "Your mood has been shared with your connections",
      });
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
    <div className="flex flex-wrap gap-4 justify-center">
      {Object.entries(moodDescriptions).map(([key, mood]) => {
        const isSelected = selectedMood === key;
        return (
          <div key={key} className="flex flex-col items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleMoodSelect(key as MoodType)}
              className={`relative rounded-full ${sizeClasses[size]} flex items-center justify-center transition-all duration-300 ${isSelected ? "ring-4 ring-offset-2" : ""}`}
              style={{
                backgroundColor: mood.color,
                boxShadow: `0 4px 12px ${mood.color}80`,
                ringColor: mood.color,
              }}
              disabled={isSubmitting}
              aria-label={`Select mood: ${mood.name}`}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${mood.color}40 0%, transparent 70%)`,
                }}
              />
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute inset-0 rounded-full border-2 border-white opacity-70"
                />
              )}
            </motion.button>
            {showLabels && (
              <span className="text-xs font-medium text-gray-700">
                {mood.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
