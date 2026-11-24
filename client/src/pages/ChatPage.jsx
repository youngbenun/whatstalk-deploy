import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../hooks/useChat";
import Avatar from "../UI/Avatar";
import Sidebar, { conversationName } from "../components/Sidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import PeopleDialog from "../components/PeopleDialog";
export default function ChatPage() {
  const { logout } = useAuth();
  const chat = useChat();
  const [dialog, setDialog] = useState(null);
  const [dialogError, setDialogError] = useState("");
  const close = () => {
    setDialog(null);
    setDialogError("");
  };
  async function submit(values) {
    try {
      if (dialog === "direct") await chat.createDirect(values.userId);
      if (dialog === "group")
        await chat.createGroup(values.name, values.memberIds);
      if (dialog === "add") await chat.addMember(values.userId);
      close();
    } catch (e) {
      setDialogError(e.message);
    }
  }
  const available =
    dialog === "add"
      ? chat.users.filter(
          (u) => !chat.selected?.members.some((m) => m._id === u._id),
        )
      : chat.users;
  return (
    <main className="h-dvh bg-[#e8eee9] p-0 md:p-5">
      <div className="mx-auto flex h-full max-w-7xl overflow-hidden bg-white shadow-sm md:rounded-xl">
        <Sidebar
          conversations={chat.conversations}
          selected={chat.selected}
          select={chat.select}
          userId={chat.user?.userId}
          onNew={() => setDialog("direct")}
          onGroup={() => setDialog("group")}
          logout={logout}
          mobileHidden={!!chat.selected}
        />
        <section
          className={`${chat.selected ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col`}
        >
          {chat.selected ? (
            <>
              <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <button
                  className="text-xl md:hidden"
                  onClick={() => chat.select(null)}
                >
                  →
                </button>
                <Avatar
                  name={conversationName(chat.selected, chat.user?.userId)}
                />
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-semibold">
                    {conversationName(chat.selected, chat.user?.userId)}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {chat.selected.type === "group"
                      ? `${chat.selected.members.length} משתתפים`
                      : chat.connected
                        ? "מחובר"
                        : "מתחבר..."}
                  </p>
                </div>
                {chat.selected.type === "group" &&
                  String(chat.selected.createdBy) ===
                    String(chat.user?.userId) && (
                    <button
                      className="text-sm text-brand"
                      onClick={() => setDialog("add")}
                    >
                      + משתתף
                    </button>
                  )}
              </header>
              {chat.error && (
                <button
                  onClick={() => chat.setError("")}
                  className="bg-red-50 p-2 text-center text-xs text-red-700"
                >
                  {chat.error} ✕
                </button>
              )}
              <MessageList
                messages={chat.messages}
                userId={chat.user?.userId}
              />
              <MessageInput send={chat.send} disabled={!chat.connected} />
            </>
          ) : (
            <div className="grid h-full place-items-center bg-paper text-center text-slate-500">
              <div>
                <h2 className="text-xl font-semibold text-brand-dark">
                  ברוכים הבאים ל־WhatsTalk
                </h2>
                <p className="mt-2 text-sm">בחרו שיחה או צרו שיחה חדשה</p>
              </div>
            </div>
          )}
        </section>
      </div>
      {dialog && (
        <PeopleDialog
          key={dialog}
          mode={dialog}
          users={available}
          close={close}
          submit={submit}
          error={dialogError}
        />
      )}
    </main>
  );
}
