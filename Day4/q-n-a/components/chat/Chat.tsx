"use client";

import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(text: string) {
    setMessages((m) => [...m, { role: "user", content: text }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();
    setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
  }

  // Scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  return (
    <div className="flex flex-col h-full gap-4">
      <ScrollArea className="flex-1 p-4 bg-white/10 rounded-lg" ref={scrollRef}>
        <div className="flex flex-col gap-3">
          {messages.map((m, i) => (
            <MessageBubble key={i} role={m.role} content={m.content} />
          ))}
        </div>
      </ScrollArea>
      <ChatInput onSend={send} />
    </div>
  );
}
