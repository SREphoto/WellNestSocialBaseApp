"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, Heart, Bookmark, Share2 } from "lucide-react";
import Link from "next/link";

interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Understanding Anxiety: A Guide to Coping",
    description:
      "Learn about anxiety symptoms and effective coping strategies for daily life.",
    url: "https://example.com/anxiety-guide",
    category: "Mental Health",
    tags: ["anxiety", "coping", "stress"],
  },
  {
    id: "2",
    title: "Mindfulness Meditation for Beginners",
    description:
      "A simple introduction to mindfulness practices that can improve your mental wellbeing.",
    url: "https://example.com/mindfulness",
    category: "Wellness",
    tags: ["meditation", "mindfulness", "relaxation"],
  },
  {
    id: "3",
    title: "Building Healthy Relationships",
    description:
      "Tips and strategies for developing and maintaining supportive relationships.",
    url: "https://example.com/relationships",
    category: "Social Wellness",
    tags: ["relationships", "communication", "support"],
  },
  {
    id: "4",
    title: "Crisis Support Hotlines",
    description:
      "A comprehensive list of crisis support services available 24/7.",
    url: "https://example.com/crisis-support",
    category: "Crisis Resources",
    tags: ["crisis", "emergency", "support"],
  },
  {
    id: "5",
    title: "Self-Care Practices for Daily Life",
    description:
      "Simple self-care activities you can incorporate into your daily routine.",
    url: "https://example.com/self-care",
    category: "Wellness",
    tags: ["self-care", "routine", "wellness"],
  },
  {
    id: "6",
    title: "Understanding Depression",
    description:
      "Information about depression symptoms, causes, and treatment options.",
    url: "https://example.com/depression",
    category: "Mental Health",
    tags: ["depression", "mental health", "treatment"],
  },
];

export default function ResourcesList() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.id} className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">
                {resource.title}
              </CardTitle>
              <div className="flex flex-wrap gap-1 mt-1">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-green-100 text-green-800 rounded-full px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {resource.description}
              </p>
              <div className="flex justify-between items-center mt-auto pt-2">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Heart className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Bookmark className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Share2 className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  asChild
                >
                  <Link
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
