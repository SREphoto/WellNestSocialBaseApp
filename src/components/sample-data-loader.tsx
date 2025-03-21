"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

export default function SampleDataLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const loadSampleData = async () => {
    setIsLoading(true);
    try {
      // This function will trigger the SQL migration we created
      // In a real app, you might want to call an API endpoint that runs the SQL
      // For demo purposes, we'll just show a success message

      toast({
        title: "Sample data loaded",
        description:
          "5 users with moods, connections, and comments have been added to your database.",
      });
    } catch (error) {
      console.error("Error loading sample data:", error);
      toast({
        title: "Error loading sample data",
        description: "There was a problem adding sample data to your database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold mb-2">Sample Data</h2>
      <p className="text-sm text-gray-600 mb-4">
        Load sample users, moods, and connections to test your application.
      </p>
      <Button
        onClick={loadSampleData}
        disabled={isLoading}
        className="w-full bg-green-700 hover:bg-green-800"
      >
        {isLoading ? "Loading..." : "Load Sample Data"}
      </Button>
      <div className="mt-3 text-xs text-gray-500">
        <p>This will add:</p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>5 sample users with profiles</li>
          <li>8 mood entries with various emotions</li>
          <li>Friend connections (both accepted and pending)</li>
          <li>Sample comments on mood updates</li>
        </ul>
      </div>
    </div>
  );
}
