import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Surfaced clearly in the console if env vars are missing at build/runtime.
  console.error(
    "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );
}

// "Remember me" controls which browser storage holds the session.
// localStorage  -> survives closing the browser (stays logged in for weeks)
// sessionStorage -> cleared when the browser/tab is closed (log in each time)
// We default to remembering. The login screen flips this before signing in.
const REMEMBER_KEY = "pc-remember";

function remembering() {
  try { return localStorage.getItem(REMEMBER_KEY) !== "0"; } catch { return true; }
}

export function setRemember(remember) {
  try { localStorage.setItem(REMEMBER_KEY, remember ? "1" : "0"); } catch {}
}

// A storage adapter that routes to localStorage or sessionStorage based on the
// current "remember me" choice, read live on each call. This means the choice
// made on the login screen takes effect immediately for the new session.
const dynamicStorage = {
  getItem: (k) => {
    try {
      const primary = remembering() ? window.localStorage : window.sessionStorage;
      const fallback = remembering() ? window.sessionStorage : window.localStorage;
      return primary.getItem(k) ?? fallback.getItem(k);
    } catch { return null; }
  },
  setItem: (k, v) => {
    try {
      const store = remembering() ? window.localStorage : window.sessionStorage;
      const other = remembering() ? window.sessionStorage : window.localStorage;
      store.setItem(k, v);
      other.removeItem(k); // keep the session in exactly one place
    } catch {}
  },
  removeItem: (k) => {
    try { window.localStorage.removeItem(k); window.sessionStorage.removeItem(k); } catch {}
  },
};

export const supabase = createClient(url, anon, {
  auth: {
    storage: dynamicStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const OWNER_EMAIL = (import.meta.env.VITE_OWNER_EMAIL || "").toLowerCase();
