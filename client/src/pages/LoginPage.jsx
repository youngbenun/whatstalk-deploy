import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../UI/Button";
import Input from "../UI/Input";
export default function LoginPage() {
  const { token, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  if (token) return <Navigate to="/chat" replace />;
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">WhatsTalk</h1>
          <p className="mt-1 text-sm text-slate-500">כניסה לחשבון שלך</p>
        </div>
        <Input
          type="email"
          placeholder="אימייל"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="סיסמה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button disabled={busy} className="w-full">
          {busy ? "מתחבר..." : "כניסה"}
        </Button>
        <p className="text-center text-sm text-slate-500">
          אין לך חשבון?{" "}
          <Link className="text-brand" to="/register">
            הרשמה
          </Link>
        </p>
      </form>
    </main>
  );
}
