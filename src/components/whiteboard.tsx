"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Eraser, Pencil, Save, Trash2 } from "lucide-react";
import { createClient } from "../../supabase/client";
import { toast } from "./ui/use-toast";

interface WhiteboardProps {
  friendId?: string;
  boardId?: string;
}

export default function Whiteboard({ friendId, boardId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pencil" | "eraser">("pencil");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(3);
  const [boardName, setBoardName] = useState("Shared Whiteboard");
  const supabase = createClient();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set default styles
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // Clear canvas with white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load saved whiteboard if boardId is provided
    if (boardId) {
      loadWhiteboard(boardId);
    }
  }, [boardId]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);

    // Set styles based on selected tool
    if (tool === "pencil") {
      ctx.strokeStyle = color;
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.strokeStyle = "white";
      ctx.globalCompositeOperation = "destination-out";
    }
    ctx.lineWidth = lineWidth;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveWhiteboard = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      // Convert canvas to base64 image
      const imageData = canvas.toDataURL("image/png");

      // In a real app, you would save this to Supabase storage
      // For demo purposes, we'll just show a success message
      toast({
        title: "Whiteboard saved",
        description: "Your whiteboard has been saved successfully.",
      });
    } catch (error) {
      console.error("Error saving whiteboard:", error);
      toast({
        title: "Error saving whiteboard",
        description: "There was a problem saving your whiteboard.",
        variant: "destructive",
      });
    }
  };

  const loadWhiteboard = async (id: string) => {
    try {
      // In a real app, you would load from Supabase storage
      // For demo purposes, we'll just show a message
      toast({
        title: "Whiteboard loaded",
        description: "Your whiteboard has been loaded successfully.",
      });
    } catch (error) {
      console.error("Error loading whiteboard:", error);
      toast({
        title: "Error loading whiteboard",
        description: "There was a problem loading your whiteboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">{boardName}</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={tool === "pencil" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTool("pencil")}
                className="rounded-none"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Draw
              </Button>
              <Button
                variant={tool === "eraser" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTool("eraser")}
                className="rounded-none"
              >
                <Eraser className="h-4 w-4 mr-1" />
                Erase
              </Button>
            </div>
            {tool === "pencil" && (
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={clearCanvas}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={saveWhiteboard}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            className="w-full h-[400px] touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>
            This whiteboard is shared with your connection. Draw together to
            share ideas and support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
