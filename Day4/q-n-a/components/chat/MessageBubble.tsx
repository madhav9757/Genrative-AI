"use client";

export default function MessageBubble({
  role,
  content,
}: {
  role: "user" | "assistant";
  content: string;
}) {
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] px-4 py-2 rounded-xl break-words
          ${isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-white/20 text-white rounded-bl-none"}`}
      >
        {content}
      </div>
    </div>
  );
}
