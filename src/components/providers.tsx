"use client";

import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "@/components/notification-provider";
import { Toaster } from "sonner";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <NotificationProvider>
        {children}
        <Toaster position="top-right" />
      </NotificationProvider>
    </SessionProvider>
  );
}