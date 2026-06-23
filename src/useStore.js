import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "./supabaseClient";

// ---- row <-> app mappers ----------------------------------------
const taskFromRow = (r) => ({
  id: r.id, title: r.title, portfolioId: r.portfolio_id,
  forWhom: r.for_whom, priority: r.priority, effort: r.effort,
  due: r.due, note: r.note, status: r.status, created: r.created_at,
});
const taskToRow = (t, ownerId) => ({
  id: t.id, title: t.title, portfolio_id: t.portfolioId,
  for_whom: t.forWhom ?? null, priority: t.priority, effort: t.effort ?? null,
  due: t.due ?? null, note: t.note ?? null, status: t.status ?? "active",
  owner_id: ownerId,
});

const portfolioFromRow = (r) => ({ id: r.id, name: r.name, accent: r.accent, logoUrl: r.logo_url || null });
const portfolioToRow = (p, ownerId, order) => ({
  id: p.id, name: p.name, accent: p.accent, sort_order: order ?? 0,
  logo_url: p.logoUrl ?? null, owner_id: ownerId,
});

const eventFromRow = (r) => ({
  id: r.id, title: r.title, date: r.date, away: r.away,
  allDay: r.all_day, start: r.start_time, end: r.end_time, note: r.note,
});
const eventToRow = (e, ownerId) => ({
  id: e.id, title: e.title, date: e.date, away: e.away,
  all_day: e.allDay ?? false, start_time: e.start ?? null, end_time: e.end ?? null,
  note: e.note ?? null, owner_id: ownerId,
});

const DEFAULT_PORTFOLIOS = [
  { id: "p_ethos",  name: "ETHOS",           accent: 0 },
  { id: "p_oscaid", name: "Oscaid",          accent: 1 },
  { id: "p_jhutch", name: "JHutch Advisory", accent: 2 },
  { id: "p_aven",   name: "Avencera",        accent: 4 },
  { id: "p_arca",   name: "Arca",            accent: 6 },
];

// ============================================================
//  useStore — owner's full data (portfolios, tasks, events)
// ============================================================
export function useStore(session) {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const ownerId = session?.user?.id;
  const seedingRef = useRef(false);

  const load = useCallback(async () => {
    if (!ownerId) return;
    const [{ data: pf }, { data: tk }, { data: ev }] = await Promise.all([
      supabase.from("portfolios").select("*").order("sort_order", { ascending: true }),
      supabase.from("tasks").select("*"),
      supabase.from("events").select("*"),
    ]);

    let portfolios = (pf || []).map(portfolioFromRow);

    // First run: seed the default portfolios for this owner.
    if (portfolios.length === 0 && !seedingRef.current) {
      seedingRef.current = true;
      const rows = DEFAULT_PORTFOLIOS.map((p, i) => portfolioToRow(p, ownerId, i));
      const { error } = await supabase.from("portfolios").insert(rows);
      if (!error) portfolios = DEFAULT_PORTFOLIOS.map((p) => ({ ...p }));
      seedingRef.current = false;
    }

    setData({
      portfolios,
      tasks: (tk || []).map(taskFromRow),
      events: (ev || []).map(eventFromRow),
    });
    setLoaded(true);
  }, [ownerId]);

  useEffect(() => { load(); }, [load]);

  // ---- optimistic helpers --------------------------------------
  const patchLocal = (updater) => setData((d) => (d ? updater(d) : d));

  // ---- task ops ------------------------------------------------
  const addTask = async (t) => {
    patchLocal((d) => ({ ...d, tasks: [...d.tasks, t] }));
    await supabase.from("tasks").insert(taskToRow(t, ownerId));
  };
  const updateTask = async (id, patch) => {
    patchLocal((d) => ({ ...d, tasks: d.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
    const current = data.tasks.find((t) => t.id === id);
    const merged = { ...current, ...patch };
    await supabase.from("tasks").update(taskToRow(merged, ownerId)).eq("id", id);
  };
  const removeTask = async (id) => {
    patchLocal((d) => ({ ...d, tasks: d.tasks.filter((t) => t.id !== id) }));
    await supabase.from("tasks").delete().eq("id", id);
  };

  // ---- portfolio ops -------------------------------------------
  const addPortfolio = async (p, order) => {
    patchLocal((d) => ({ ...d, portfolios: [...d.portfolios, p] }));
    await supabase.from("portfolios").insert(portfolioToRow(p, ownerId, order));
  };
  const removePortfolio = async (id) => {
    patchLocal((d) => ({
      ...d,
      portfolios: d.portfolios.filter((p) => p.id !== id),
      tasks: d.tasks.filter((t) => t.portfolioId !== id),
    }));
    // tasks cascade-delete in the DB via FK on delete cascade
    await supabase.from("portfolios").delete().eq("id", id);
  };

  // Upload an image file for a portfolio logo, store its public URL.
  const setPortfolioLogo = async (id, file) => {
    if (!file) return;
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${ownerId}/${id}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("logos")
      .upload(path, file, { upsert: true, cacheControl: "3600" });
    if (upErr) { console.error("Logo upload failed:", upErr.message); return; }
    const { data: pub } = supabase.storage.from("logos").getPublicUrl(path);
    const logoUrl = pub?.publicUrl || null;
    patchLocal((d) => ({
      ...d,
      portfolios: d.portfolios.map((p) => (p.id === id ? { ...p, logoUrl } : p)),
    }));
    await supabase.from("portfolios").update({ logo_url: logoUrl }).eq("id", id);
  };

  const clearPortfolioLogo = async (id) => {
    patchLocal((d) => ({
      ...d,
      portfolios: d.portfolios.map((p) => (p.id === id ? { ...p, logoUrl: null } : p)),
    }));
    await supabase.from("portfolios").update({ logo_url: null }).eq("id", id);
  };

  // ---- event ops -----------------------------------------------
  const addEvent = async (e) => {
    patchLocal((d) => ({ ...d, events: [...d.events, e] }));
    await supabase.from("events").insert(eventToRow(e, ownerId));
  };
  const updateEvent = async (id, patch) => {
    patchLocal((d) => ({ ...d, events: d.events.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
    const current = data.events.find((e) => e.id === id);
    const merged = { ...current, ...patch };
    await supabase.from("events").update(eventToRow(merged, ownerId)).eq("id", id);
  };
  const removeEvent = async (id) => {
    patchLocal((d) => ({ ...d, events: d.events.filter((e) => e.id !== id) }));
    await supabase.from("events").delete().eq("id", id);
  };

  return {
    data, loaded, reload: load,
    addTask, updateTask, removeTask,
    addPortfolio, removePortfolio, setPortfolioLogo, clearPortfolioLogo,
    addEvent, updateEvent, removeEvent,
  };
}

// ============================================================
//  usePublicSchedule — read-only events for the shared page
//  (no auth required; relies on the public_read_events policy)
// ============================================================
export function usePublicSchedule() {
  const [events, setEvents] = useState(null);
  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("id,title,date,away,all_day,start_time,end_time,note")
        .order("date", { ascending: true });
      if (live) setEvents(error ? [] : (data || []).map(eventFromRow));
    })();
    return () => { live = false; };
  }, []);
  return events;
}
