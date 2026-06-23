import { useState } from "react";
import { supabase } from "./supabaseClient";
import { S, CSS } from "./styles.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("password"); // password | magic
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const signIn = async () => {
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setMsg({ tone: "#FF6B9D", text: error.message });
  };

  const magic = async () => {
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    setMsg(error
      ? { tone: "#FF6B9D", text: error.message }
      : { tone: "#4ADE80", text: "Check your email for the sign-in link." });
  };

  return (
    <div style={{ ...S.app, display: "grid", placeItems: "center", padding: 20 }}>
      <style>{CSS}</style>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <div style={S.kicker}>PORTFOLIO COMMAND</div>
        <h1 style={{ ...S.h1, marginBottom: 24 }}>Sign in<span style={S.h1dot}>.</span></h1>

        <input
          type="email" value={email} autoFocus
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          style={{ ...S.titleInput, fontSize: 16, marginBottom: 12 }}
        />

        {mode === "password" && (
          <input
            type="password" value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") signIn(); }}
            placeholder="Password"
            style={{ ...S.titleInput, fontSize: 16, marginBottom: 12 }}
          />
        )}

        <button
          style={{ ...S.saveBtn, width: "100%", opacity: busy ? 0.6 : 1, marginTop: 4 }}
          className="saveBtn"
          onClick={mode === "password" ? signIn : magic}
          disabled={busy}
        >
          {busy ? "…" : mode === "password" ? "Sign in" : "Email me a link"}
        </button>

        <button
          style={{ ...S.signOut, position: "static", marginTop: 14, width: "100%", textAlign: "center" }}
          className="manageBtn"
          onClick={() => { setMode(m => m === "password" ? "magic" : "password"); setMsg(null); }}
        >
          {mode === "password" ? "Use a magic link instead" : "Use a password instead"}
        </button>

        {msg && <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: msg.tone, textAlign: "center" }}>{msg.text}</div>}

        <div style={{ marginTop: 28, textAlign: "center" }}>
          <a href="/schedule" style={{ color: "#64748B", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            View shared schedule →
          </a>
        </div>
      </div>
    </div>
  );
}
