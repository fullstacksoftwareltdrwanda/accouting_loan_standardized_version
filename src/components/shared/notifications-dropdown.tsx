"use client";

import React, { useState, useEffect } from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Notification, NotificationType } from "@/types/notification";
import { getNotifications, markNotificationAsRead } from "@/services/mock/notification.service";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load notifications
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to load notifications", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark read", error);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "critical": return <AlertCircle className="h-4 w-4 text-rose-600" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-amber-600" />;
      case "success": return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      default: return <Info className="h-4 w-4 text-indigo-600" />;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95"
        >
          <Bell className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          {unreadCount > 0 && (
            <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 overflow-hidden shadow-2xl border-zinc-200 dark:border-zinc-800" align="end">
        <div className="flex items-center justify-between p-4 bg-zinc-50/50 dark:bg-black/20">
          <h3 className="font-black text-sm tracking-tight">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full dark:bg-zinc-800">
              {unreadCount} Unread
            </span>
          )}
        </div>
        <Separator />
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-zinc-400 font-sans italic">Loading alerts...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400 font-sans">No notifications yet.</div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => handleMarkRead(n.id)}
                  className={cn(
                    "flex gap-3 p-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
                    !n.isRead && "bg-indigo-50/30 dark:bg-indigo-950/10"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                    n.type === "critical" ? "bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-900/30" :
                    n.type === "warning" ? "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30" :
                    "bg-zinc-50 border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700"
                  )}>
                    {getIcon(n.type)}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                       <span className="text-xs font-bold truncate text-zinc-900 dark:text-zinc-50">{n.title}</span>
                       {!n.isRead && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 shrink-0" />}
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2 font-sans">
                      {n.description}
                    </p>
                    <span className="mt-1 text-[9px] font-black uppercase tracking-tight text-zinc-400">
                      Just now
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        <Separator />
        <Button 
          variant="ghost" 
          className="w-full rounded-none h-12 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-indigo-600"
        >
          View All Activity
        </Button>
      </PopoverContent>
    </Popover>
  );
}
