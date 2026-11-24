import Avatar from "../UI/Avatar";
export function conversationName(c, userId) {
  return c.type === "group"
    ? c.name
    : c.members.find((m) => String(m._id) !== String(userId))?.name || "שיחה";
}
export default function Sidebar({
  conversations,
  selected,
  select,
  userId,
  onNew,
  onGroup,
  logout,
  mobileHidden,
}) {
  return (
    <aside
      className={`${mobileHidden ? "hidden md:flex" : "flex"} w-full flex-col border-l border-slate-200 bg-white md:w-80 lg:w-96`}
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <h1 className="text-xl font-bold text-brand-dark">WhatsTalk</h1>
        <button
          onClick={logout}
          className="text-xs text-slate-500 hover:text-brand"
        >
          התנתקות
        </button>
      </div>
      <div className="flex gap-2 border-b border-slate-100 p-3">
        <button
          onClick={onNew}
          className="flex-1 rounded-lg border border-green-200 p-2 text-sm text-brand-dark hover:bg-green-50"
        >
          + שיחה
        </button>
        <button
          onClick={onGroup}
          className="flex-1 rounded-lg border border-green-200 p-2 text-sm text-brand-dark hover:bg-green-50"
        >
          + קבוצה
        </button>
      </div>
      <div className="overflow-y-auto">
        {conversations.map((c) => (
          <button
            key={c._id}
            onClick={() => select(c)}
            className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3 text-right hover:bg-paper ${selected?._id === c._id ? "bg-green-50" : ""}`}
          >
            <Avatar
              name={conversationName(c, userId)}
              image={
                c.type === "direct"
                  ? c.members.find((m) => String(m._id) !== String(userId))
                      ?.profileImage
                  : null
              }
            />
            <span className="min-w-0 flex-1">
              <strong className="block truncate text-sm">
                {conversationName(c, userId)}
              </strong>
              <small className="block truncate text-slate-500">
                {c.lastMessage?.text ||
                  (c.type === "group" ? "קבוצה חדשה" : "שיחה חדשה")}
              </small>
            </span>
          </button>
        ))}
        {!conversations.length && (
          <p className="p-6 text-center text-sm text-slate-500">
            אין שיחות עדיין. אפשר להתחיל שיחה חדשה.
          </p>
        )}
      </div>
    </aside>
  );
}
