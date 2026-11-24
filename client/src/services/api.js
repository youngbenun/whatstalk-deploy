// כתובת השרת מגיעה ממשתנה סביבה של Vite (חייב להתחיל ב-VITE_)
// במחשב: אין משתנה, ולכן localhost. ב-Netlify: VITE_API_URL=https://....onrender.com
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";


export async function api(path, { token, ...options } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "x-api-key": token } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "הבקשה נכשלה");
  return data;
}
export const post = (path, body, token) =>
  api(path, { method: "POST", body: JSON.stringify(body), token });
