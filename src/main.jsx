import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase, OWNER_EMAIL } from "./supabaseClient";
import { useStore } from "./useStore";
import { S, CSS } from "./styles.js";
import App from "./App.jsx";
import Login from "./Login.jsx";
import PublicSchedule from "./PublicSchedule.jsx";
import ShoppingList from "./ShoppingList.jsx";

function Loading() {
  return (
    <div style={{ ...S.app, display: "grid", placeItems: "center" }}>
      <style>{CSS}</style>
      <div style={{ color: "#A78BFA", fontWeight: 800, letterSpacing: ".2em", fontSize: 13 }}>LOADING…</div>
    </div>
  );
}

// The owner-only dashboard, gated behind auth.
function Dashboard() {
  const [session, setSession] = useState(undefined); // undefined = checking
  const store = useStore(session);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = () => supabase.auth.signOut();

  if (session === undefined) return <Loading />;
  if (!session) return <Login />;

  // Optional guard: if a non-owner email signs in, send them to the read-only page.
  const email = (session.user?.email || "").toLowerCase();
  if (OWNER_EMAIL && email !== OWNER_EMAIL) {
    return <Navigate to="/schedule" replace />;
  }

  if (!store.loaded || !store.data) return <Loading />;

  return <App store={store} session={session} onSignOut={signOut} />;
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/schedule" element={<PublicSchedule />} />
        <Route path="/list" element={<ShoppingList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
