import { useEffect, useRef } from "react";
export default function MessageList({ messages, userId }) {
  const end = useRef(null);
  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto bg-[#f6f8f6] p-4 md:p-6">
      {messages.map((m) => {
        const mine = String(m.sender?._id || m.sender) === String(userId);
        return (
          <div
            key={m._id}
            className={`mb-2 flex ${mine ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm shadow-sm ${mine ? "bg-[#dcf4e4]" : "bg-white"}`}
            >
              <p className="mb-1 text-xs font-semibold text-brand-dark">
                {m.sender?.name || "משתמש"}
              </p>
              <p className="whitespace-pre-wrap break-words">{m.text}</p>
              <time className="mt-1 block text-left text-[10px] text-slate-500">
                {new Date(m.createdAt).toLocaleTimeString("he-IL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </time>
            </div>
          </div>
        );
      })}
      <div ref={end} />
    </div>
  );
}
