import type { Metadata } from "next";
import type { ReactNode } from "react";
import RequireAuth from "@/components/require-auth";

export const metadata: Metadata = {
  title: {
    default: "Dashboard",
    template: "%s | EMI Tracker",
  },
  description: "Track cards, cardholders, and EMI purchases.",
};


export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
