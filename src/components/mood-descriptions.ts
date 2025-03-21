// Mood descriptions for the Casual Moodies Theme

export interface MoodDescription {
  name: string;
  color: string;
  description: string;
  gradient?: string;
}

export const moodDescriptions: Record<string, MoodDescription> = {
  serene: {
    name: "Deeply Serene",
    color: "#4F6A8F",
    description:
      "A deep, grounding denim blue that signifies a deeply serene, almost meditative state—utmost serenity and inner peace.",
    gradient: "linear-gradient(135deg, #4F6A8F 0%, #6A8CAF 100%)",
  },
  calm: {
    name: "Calm and Peaceful",
    color: "#88A2BC",
    description:
      "A soft, light slate blue that embodies a calm and peaceful state—a moment of quiet relief and relaxation.",
    gradient: "linear-gradient(135deg, #88A2BC 0%, #A3BDDC 100%)",
  },
  neutral: {
    name: "Mild/Neutral",
    color: "#8EB896",
    description:
      "A muted sage green that represents a mild, neutral state—everything is steady, neither particularly high nor low.",
    gradient: "linear-gradient(135deg, #8EB896 0%, #A9D3B1 100%)",
  },
  uneasy: {
    name: "Something Feels Off",
    color: "#FCC580",
    description:
      "A gentle, pale peach that indicates something feels off—a mild unease or subtle discomfort.",
    gradient: "linear-gradient(135deg, #FCC580 0%, #FFD9A0 100%)",
  },
  alert: {
    name: "High Alert",
    color: "#D9895F",
    description:
      "A warm, muted terracotta that radiates high alert—a state of strong concern where the user feels unsettled and on edge.",
    gradient: "linear-gradient(135deg, #D9895F 0%, #F5A77F 100%)",
  },
  urgent: {
    name: "Urgent",
    color: "#A24944",
    description:
      "A rich, earthy red that signals an urgent, critical state—something is seriously wrong and demands immediate attention.",
    gradient: "linear-gradient(135deg, #A24944 0%, #C26964 100%)",
  },
};
