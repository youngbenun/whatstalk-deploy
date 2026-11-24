import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";
import Button from "../UI/Button";
import Input from "../UI/Input";
export default function RegisterPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    city: "",
  });
  const change = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await post("/users/register", { ...form, age: Number(form.age) });
      navigate("/login");
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
        className="w-full max-w-sm space-y-3 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
      >
        <h1 className="text-xl font-bold text-brand-dark">
          יצירת חשבון ב־WhatsTalk
        </h1>
        {[
          ["name", "שם מלא", "text"],
          ["email", "אימייל", "email"],
          ["password", "סיסמה", "password"],
          ["age", "גיל", "number"],
          ["phone", "טלפון", "tel"],
          ["city", "עיר", "text"],
        ].map(([name, label, type]) => (
          <Input
            key={name}
            name={name}
            aria-label={label}
            placeholder={label}
            type={type}
            value={form[name]}
            onChange={change}
            required
          />
        ))}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <Button disabled={busy} className="w-full">
          {busy ? "נרשם..." : "הרשמה"}
        </Button>
        <Link to="/login" className="block text-center text-sm text-brand">
          כבר יש לי חשבון
        </Link>
      </form>
    </main>
  );
}
