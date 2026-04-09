"use client";

import ChatAssistant from "@/components/shared/ChatAssistant";
import { Toaster } from "sonner";

export default function AppClientShell() {
  return (
    <>
      <ChatAssistant />
      <Toaster position='top-right' richColors theme='system' />
    </>
  );
}
