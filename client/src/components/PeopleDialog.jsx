import { useState } from "react";
import Avatar from "../UI/Avatar";
import Button from "../UI/Button";
import Input from "../UI/Input";
export default function PeopleDialog({ mode, users, close, submit, error }) {
  const [name, setName] = useState("");
  const [ids, setIds] = useState([]);
  const toggle = (id) =>
    setIds((list) =>
      list.includes(id) ? list.filter((x) => x !== id) : [...list, id],
    );
  return (
    <div
      className="fixed inset-0 z-10 grid place-items-center bg-black/30 p-4"
      onMouseDown={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex justify-between">
          <h2 className="font-semibold">
            {mode === "group"
              ? "קבוצה חדשה"
              : mode === "add"
                ? "הוספת משתתף"
                : "שיחה חדשה"}
          </h2>
          <button onClick={close} aria-label="סגירה">
            ✕
          </button>
        </div>
        {mode === "group" && (
          <Input
            placeholder="שם הקבוצה"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
          />
        )}
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="my-3 max-h-64 overflow-y-auto">
          {users.map((u) => (
            <button
              key={u._id}
              onClick={() =>
                mode === "group" ? toggle(u._id) : submit({ userId: u._id })
              }
              className="flex w-full items-center gap-3 border-b border-slate-100 p-2 text-right hover:bg-paper"
            >
              <Avatar name={u.name} image={u.profileImage} size="h-9 w-9" />
              <span className="flex-1">
                <span className="block text-sm">{u.name}</span>
                <small className="text-slate-500">{u.email}</small>
              </span>
              {mode === "group" && (
                <input type="checkbox" checked={ids.includes(u._id)} readOnly />
              )}
            </button>
          ))}
          {!users.length && (
            <p className="p-4 text-sm text-slate-500">אין משתמשים להצגה</p>
          )}
        </div>
        {mode === "group" && (
          <Button
            disabled={!name.trim() || !ids.length}
            onClick={() => submit({ name, memberIds: ids })}
          >
            יצירת קבוצה
          </Button>
        )}
      </div>
    </div>
  );
}
