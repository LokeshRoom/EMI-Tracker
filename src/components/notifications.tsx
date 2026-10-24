"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCards } from "@/hooks/useCards";
import { formatCents } from "@/lib/money";
import type { Card } from "@/types";

interface DueCardItem {
  card: Card;
  diffDays: number;
  statusLabel: string;
  isUrgent: boolean;
}

export function NotificationBell() {
  const cards = useCards();
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const dueItems = useMemo<DueCardItem[]>(() => {
    if (!cards.data) return [];
    const today = new Date().getDate();

    return cards.data
      .filter((c) => Boolean(c.paymentDueDay))
      .map((c) => {
        const dueDay = c.paymentDueDay as number;
        const diffDays = dueDay - today;
        let statusLabel = "";
        let isUrgent = false;

        if (diffDays === 0) {
          statusLabel = "Due Today!";
          isUrgent = true;
        } else if (diffDays === 1) {
          statusLabel = "Due tomorrow";
          isUrgent = true;
        } else if (diffDays > 1 && diffDays <= 3) {
          statusLabel = `Due in ${diffDays} days`;
        } else if (diffDays < 0 && diffDays >= -3) {
          statusLabel = `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""}`;
          isUrgent = true;
        }

        return { card: c, diffDays, statusLabel, isUrgent };
      })
      .filter((item) => item.statusLabel !== "")
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [cards.data]);

  // Trigger push notification if permission is granted and there are urgent dues
  const hasNotifiedRef = useRef(false);
  useEffect(() => {
    if (
      permission === "granted" &&
      dueItems.length > 0 &&
      !hasNotifiedRef.current &&
      typeof window !== "undefined" &&
      "Notification" in window
    ) {
      const urgentItem = dueItems.find((d) => d.isUrgent) ?? dueItems[0];
      if (urgentItem) {
        new Notification("EMI Tracker: Payment Due", {
          body: `${urgentItem.card.bankName} (Ends ${urgentItem.card.last4}) is ${urgentItem.statusLabel}. Outstanding: ${formatCents(urgentItem.card.outstandingBalanceCents, urgentItem.card.currency)}`,
          icon: "/favicon.ico",
        });
        hasNotifiedRef.current = true;
      }
    }
  }, [permission, dueItems]);

  async function requestNotificationPermission() {
    if (typeof window !== "undefined" && "Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === "granted") {
        new Notification("EMI Tracker Reminders Enabled", {
          body: "You will now receive card due reminders directly in your browser.",
          icon: "/favicon.ico",
        });
      }
    }
  }

  function sendTestNotification() {
    if (typeof window !== "undefined" && "Notification" in window && permission === "granted") {
      new Notification("Test Reminder: Card Payment Due", {
        body: "Browser reminders are working properly!",
        icon: "/favicon.ico",
      });
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-white focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        {/* Bell Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.75}
          stroke="currentColor"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>

        {dueItems.length > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-slate-950">
            {dueItems.length}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-1.5rem)] max-w-sm rounded-xl border border-white/15 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-semibold text-slate-100 text-sm">Payment Due Reminders</span>
            {dueItems.length > 0 ? (
              <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400 border border-red-400/25">
                {dueItems.length} Due Soon
              </span>
            ) : null}
          </div>

          {/* Browser Permission Control */}
          <div className="my-2 rounded-md bg-slate-950/60 p-2 text-xs border border-white/10 backdrop-blur-md">
            {permission === "granted" ? (
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-medium">✓ Browser notifications active</span>
                <button
                  type="button"
                  onClick={sendTestNotification}
                  className="text-slate-300 underline transition-colors duration-200 hover:text-white cursor-pointer"
                >
                  Test alert
                </button>
              </div>
            ) : permission === "denied" ? (
              <span className="text-slate-400">
                Notifications blocked in your browser settings.
              </span>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-300">Get browser reminders for due dates</span>
                <button
                  type="button"
                  onClick={requestNotificationPermission}
                  className="rounded bg-violet-600 px-2 py-1 font-medium text-white transition-colors duration-200 hover:bg-violet-500 cursor-pointer"
                >
                  Enable
                </button>
              </div>
            )}
          </div>

          {/* Dues List */}
          <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
            {dueItems.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                No cards due in the next 3 days.
              </p>
            ) : (
              dueItems.map(({ card, statusLabel, isUrgent }) => (
                <Link
                  key={card.id}
                  href={`/cards/${card.id}`}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md border border-white/10 p-2.5 transition-colors duration-200 hover:bg-white/5 cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-slate-100">
                        {card.bankName} · {card.cardLabel}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Ends {card.last4} · Due Day: {card.paymentDueDay}th
                      </p>
                    </div>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        isUrgent
                          ? "bg-red-500/10 text-red-400 border border-red-400/25"
                          : "bg-amber-500/10 text-amber-300 border border-amber-400/25"
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-300 tabular-nums">
                    Outstanding: {formatCents(card.outstandingBalanceCents, card.currency)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
