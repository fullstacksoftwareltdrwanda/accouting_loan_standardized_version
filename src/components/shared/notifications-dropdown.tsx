"use client";

import React, { useState, useEffect } from "react";
import { Bell, Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Notification, NotificationType } from "@/types/notification";
import { getNotifications, markAsRead } from "@/services/notification.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "critical": return <AlertCircle className="h-4 w-4 text-rose-500" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-secondary)] transition-all"
        >
          <Bell className="h-[18px] w-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden rounded-2xl shadow-xl border-[var(--border-default)]" align="end">
        <div className="flex items-center justify-between px-4 py-3 bg-[var(--bg-sunken)]">
          <h3 className="font-semibold text-[14px] text-[var(--text-primary)]">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-semibold text-[var(--text-tertiary)] bg-white px-2 py-0.5 rounded-md">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-[13px] text-[var(--text-tertiary)]">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-[13px] text-[var(--text-tertiary)]">No notifications yet.</div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => handleMarkRead(n.id)}
                  className={cn(
                    "flex gap-3 px-4 py-3 transition-colors hover:bg-[var(--bg-hover)]",
                    !n.isRead && "bg-teal-50/30"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                    n.type === "critical" ? "bg-rose-50" :
                    n.type === "warning" ? "bg-amber-50" :
                    "bg-[var(--bg-sunken)]"
                  )}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[13px] font-semibold truncate text-[var(--text-primary)]">{n.title}</span>
                      {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] shrink-0" />}
                    </div>
                    <p className="text-[12px] text-[var(--text-tertiary)] line-clamp-2 leading-relaxed">
                      {n.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-[var(--border-subtle)]">
          <Button 
            variant="ghost" 
            className="w-full rounded-none h-10 text-[12px] font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)] hover:bg-[var(--bg-hover)]"
          >
            View All Activity
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
