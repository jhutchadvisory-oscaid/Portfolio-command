import { useState, useMemo } from "react";
import { usePublicSchedule } from "./useStore";
import { S, CSS } from "./styles.js";
import { ymd, addDays, startOfWeek, DOW, fmtTime, useIsMobile } from "./shared.js";
import { ShoppingListBody } from "./ShoppingList.jsx";

// A calm, read-only week view of away-days, plus the shared shopping list.
// No login, no editing of the schedule.
export default function PublicSchedule() {
  const events = usePublicSchedule();
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [pubTab, setPubTab] = useState("schedule"); // schedule | shopping
  const isMobile = useIsMobile();

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const todayKey = ymd(new Date());

  const eventsByDay = useMemo(() => {
    const m = {};
    (events || []).forEach(e => { (m[e.date] = m[e.date] || []).push(e); });
    Object.values(m).forEach(list =>
      list.sort((a, b) => (a.allDay ? "" : a.start || "").localeCompare(b.allDay ? "" : b.start || ""))
    );
    return m;
  }, [events]);

  const rangeLabel = () => {
    const end = addDays(weekStart, 6);
    const sameMonth = weekStart.getMonth() === end.getMonth();
    const a = weekStart.toLocaleDateString("en-GB", { day: "numeric", month: sameMonth ? undefined : "short" });
    const b = end.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    return `${a} – ${b}`;
  };

  const isThisWeek = ymd(weekStart) === ymd(startOfWeek(new Date()));

  if (events === null) {
    return (
      <div style={{ ...S.app, display: "grid", placeItems: "center" }}>
        <style>{CSS}</style>
        <div style={{ color: "#5EEAD4", fontWeight: 800, letterSpacing: ".2em", fontSize: 13 }}>LOADING…</div>
      </div>
    );
  }

  return (
    <div style={S.app}>
      <style>{CSS}</style>

      <div style={S.tabBarWrap}>
        <div style={S.tabBarRow}>
          <div style={S.tabBar}>
            <button
              className="tabBtn"
              style={{ ...S.tabBtn, ...(pubTab === "schedule" ? S.tabOnAlt : {}) }}
              onClick={() => setPubTab("schedule")}
            >Schedule</button>
            <button
              className="tabBtn"
              style={{ ...S.tabBtn, ...(pubTab === "shopping" ? S.tabOnShop : {}) }}
              onClick={() => setPubTab("shopping")}
            >Shopping</button>
          </div>
        </div>
      </div>

      {pubTab === "shopping" ? (
        <ShoppingListBody />
      ) : (
      <div style={S.schedule}>
        <div style={S.schedHeadRow}>
          <div>
            <div style={S.kicker}>SCHEDULE</div>
            <h1 style={S.schedH1}>Josh's week<span style={S.h1dot}>.</span></h1>
          </div>
          <div style={S.weekNav}>
            <button style={S.navBtn} className="navBtn" onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Previous week">‹</button>
            <button
              style={{ ...S.todayBtn, opacity: isThisWeek ? 0.5 : 1 }} className="todayBtn"
              onClick={() => setWeekStart(startOfWeek(new Date()))}
            >Today</button>
            <button style={S.navBtn} className="navBtn" onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Next week">›</button>
          </div>
        </div>

        <div style={S.rangeLabel}>{rangeLabel()}</div>

        <div style={isMobile ? S.weekStack : S.weekScroll}>
          <div style={isMobile ? S.weekCol : S.week}>
            {days.map((d, i) => {
              const key = ymd(d);
              const list = eventsByDay[key] || [];
              const isToday = key === todayKey;
              const isWeekend = i >= 5;
              return (
                <div
                  key={key}
                  style={{
                    ...(isMobile ? S.dayRow : S.day),
                    ...(isToday ? S.dayToday : {}),
                    ...(isWeekend && !isToday ? S.dayWeekend : {}),
                  }}
                >
                  <div style={isMobile ? S.dayHeadRow : S.dayHead}>
                    <div style={isMobile ? S.dayHeadRowInner : undefined}>
                      <div style={{ ...S.dayName, color: isToday ? "#FF6B9D" : "#7C8BA8" }}>{DOW[i]}</div>
                      <div style={{ ...S.dayNum, color: isToday ? "#fff" : "#E8ECF4" }}>{d.getDate()}</div>
                    </div>
                    {isToday && <span style={S.todayDot}>now</span>}
                  </div>

                  <div style={isMobile ? S.dayBodyRow : S.dayBody}>
                    {list.length === 0 && <div style={S.dayEmpty}>—</div>}
                    {list.map(e => (
                      <div
                        key={e.id}
                        style={{ ...S.evt, cursor: "default", background: e.away ? "linear-gradient(135deg,#FF2D78,#FB5607)" : "linear-gradient(135deg,#14B8A6,#22D3EE)" }}
                      >
                        <div style={S.evtTime}>
                          {e.allDay ? "All day" : `${fmtTime(e.start)}${e.end ? "–" + fmtTime(e.end) : ""}`}
                        </div>
                        <div style={S.evtTitle}>{e.title}</div>
                        {e.note && <div style={{ ...S.evtTime, opacity: 0.85, fontWeight: 600, marginTop: 2 }}>{e.note}</div>}
                        {e.away && <div style={S.evtAway}>AWAY</div>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={S.legend}>
          <span style={S.legendItem}><span style={{ ...S.legendDot, background: "linear-gradient(135deg,#FF2D78,#FB5607)" }} />Away</span>
          <span style={S.legendItem}><span style={{ ...S.legendDot, background: "linear-gradient(135deg,#14B8A6,#22D3EE)" }} />Local / in</span>
          <span style={S.legendHint}>Read-only view. Scroll weeks with the arrows.</span>
        </div>
      </div>
      )}
    </div>
  );
}
