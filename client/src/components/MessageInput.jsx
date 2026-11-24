import { useState } from "react";
import Button from "../UI/Button";
export default function MessageInput({ send, disabled }) {
  const [text, setText] = useState("");
  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const value = text;
    setText("");
    const ok = await send(value);
    if (!ok) setText(value);
  }
  return (
    <form
      onSubmit={submit}
      className="flex gap-2 border-t border-slate-200 bg-white p-3"
    >
      <input
        className="min-w-0 flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand"
        placeholder="כתיבת הודעה..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        maxLength={2000}
      />
      <Button disabled={disabled || !text.trim()}>שליחה</Button>
    </form>
  );
}
