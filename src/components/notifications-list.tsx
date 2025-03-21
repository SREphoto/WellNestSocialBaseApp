"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Bell, Check, X, MessageCircle, UserPlus, Heart } from "lucide-react";

interface Notification {
  id: string;
  type: "friend_request" | "mood_update" | "comment" | "support";
  content: string;
  created_at: string;
  is_read: boolean;
  user: {
    name: string;
    avatar_url: string | null;
  } | null;
  action_url?: string;
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "friend_request",
        content: "sent you a friend request",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        is_read: false,
        user: {
          name: "Taylor Williams",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
        },
        action_url: "/dashboard/friends?tab=requests",
      },
      {
        id: "2",
        type: "mood_update",
        content: "updated their mood to Urgent",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        is_read: false,
        user: {
          name: "Alex Chen",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
        },
        action_url: "/dashboard/wellstream",
      },
      {
        id: "3",
        type: "comment",
        content: "commented on your mood update",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        is_read: true,
        user: {
          name: "Sarah Johnson",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        },
        action_url: "/dashboard/wellstream",
      },
      {
        id: "4",
        type: "support",
        content: "sent you support on your mood update",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        is_read: true,
        user: {
          name: "Jordan Smith",
          avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan",
        },
        action_url: "/dashboard/wellstream",
      },
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, is_read: true })),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "friend_request":
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      case "mood_update":
        return <Bell className="h-5 w-5 text-amber-500" />;
      case "comment":
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case "support":
        return <Heart className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
        {notifications.some((n) => !n.is_read) && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            className="text-gray-600"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p>You don't have any notifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`w-full ${!notification.is_read ? "bg-green-50 border-green-100" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={
                            notification.user?.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${notification.id}`
                          }
                          alt={notification.user?.name || "User"}
                        />
                        <AvatarFallback>
                          {(notification.user?.name || "U").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {notification.user?.name}
                      </span>
                      <span className="text-gray-600">
                        {notification.content}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(notification.created_at)}
                      </span>
                      <div className="flex gap-2">
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 px-2 text-gray-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
