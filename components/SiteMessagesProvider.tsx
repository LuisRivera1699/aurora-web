"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteMessages } from "@/content/messages/types";

const SiteMessagesContext = createContext<SiteMessages | null>(null);

export function SiteMessagesProvider({
  messages,
  children,
}: {
  messages: SiteMessages;
  children: ReactNode;
}) {
  return (
    <SiteMessagesContext.Provider value={messages}>{children}</SiteMessagesContext.Provider>
  );
}

export function useSiteMessages(): SiteMessages {
  const ctx = useContext(SiteMessagesContext);
  if (!ctx) {
    throw new Error("useSiteMessages must be used within SiteMessagesProvider");
  }
  return ctx;
}
