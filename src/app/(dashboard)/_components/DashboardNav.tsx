"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "@/shared/components/ui/Avatar";
import { Button } from "@/shared/components/ui/Button";

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function DashboardNav({ user }: DashboardNavProps) {
  return (
    <header className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#E84C1F] flex items-center justify-center shadow-[0_4px_14px_0_rgb(232_76_31/0.4)]">
            <svg
              className="w-4 h-4 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <span className="font-black text-white tracking-tight text-lg">
            Court<span className="text-[#E84C1F]">Spot</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-white text-sm font-semibold leading-none">
              {user.name}
            </span>
            <span className="text-[#94A3B8] text-xs mt-0.5">{user.email}</span>
          </div>
          <Avatar size="md">
            <AvatarFallback size="md" color="primary">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#94A3B8] hover:text-white"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
