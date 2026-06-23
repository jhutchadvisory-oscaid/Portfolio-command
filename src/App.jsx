import { useState, useMemo } from "react";
import {
  ACCENTS, PRIORITIES, STATUSES, EFFORT, uid, useIsMobile,
  dayDelta, dueMeta,
  ymd, addDays, startOfWeek, DOW, fmtTime,
} from "./shared.js";
import { S, CSS } from "./styles.js";

export default function App({ store, session, onSignOut }) {
  const { data, loaded } = store;
  const {
    addTask, updateTask, removeTask,
    addPortfolio: addPortfolioRow, removePortfolio, setPortfolioLogo, clearPortfolioLogo,
    addEvent, updateEvent, removeEvent,
  } = store;

  const [view, setView] = useState("focus"); // focus | board
  const [tab, setTab] = useState("tasks"); // tasks | schedule
  const [activePortfolio, setActivePortfolio] = useState("all");
  const [adding, setAdding] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [fPriority, setFPriority] = useState("all");
  const [fEffort, setFEffort] = useState("all");
  const isMobile = useIsMobile();
  const [mobileMode, setMobileMode] = useState("capture"); // capture | board (mobile only)

  // Bridge: PortfolioStrip/MobileCapture pass a name string; the store wants an object.
  const addPortfolio = (name) => {
    const used = (data?.portfolios || []).map(p => p.accent);
    let accent = ACCENTS.findIndex((_, i) => !used.includes(i));
    if (accent < 0) accent = (data?.portfolios?.length || 0) % ACCENTS.length;
    addPortfolioRow({ id: uid("p"), name, accent }, data?.portfolios?.length || 0);
  };

  const portfolioById = useMemo(() => {
    const m = {}; (data?.portfolios || []).forEach(p => m[p.id] = p); return m;
  }, [data]);

  if (!loaded || !data) return <Splash />;

  const accentOf = (pid) => ACCENTS[(portfolioById[pid]?.accent ?? 0) % ACCENTS.length];

  // Mobile quick-capture is the default landing on phones
  if (isMobile && mobileMode === "capture") {
    return (
      <MobileCapture
        portfolios={data.portfolios}
        tasks={data.tasks}
        onSave={addTask}
        onAddPortfolio={addPortfolio}
        onOpenBoard={() => setMobileMode("board")}
      />
    );
  }

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      {isMobile && (
        <button style={S.backToCapture} className="addBtn" onClick={() => setMobileMode("capture")}>
          ‹ Quick add
        </button>
      )}

      <TabBar tab={tab} setTab={setTab} taskCount={summary(data.tasks).open} onSignOut={onSignOut} />

      {tab === "tasks" ? (
        <>
          <Header
            view={view} setView={setView}
            counts={summary(data.tasks)}
            onAdd={() => setAdding(true)}
          />

          <PortfolioStrip
            portfolios={data.portfolios}
            active={activePortfolio}
            setActive={setActivePortfolio}
            tasks={data.tasks}
            onAddPortfolio={addPortfolio}
            onRemovePortfolio={removePortfolio}
            onSetLogo={setPortfolioLogo}
            onClearLogo={clearPortfolioLogo}
          />

          <main style={S.main}>
            {view === "focus"
              ? <FocusView
                  data={data} accentOf={accentOf}
                  filter={activePortfolio}
                  onUpdate={updateTask} onRemove={removeTask}
                  onEdit={setEditingTask}
                  portfolioById={portfolioById}
                  fPriority={fPriority} fEffort={fEffort}
                  setFPriority={setFPriority} setFEffort={setFEffort}
                />
              : <BoardView
                  data={data} accentOf={accentOf}
                  filter={activePortfolio}
                  onUpdate={updateTask} onRemove={removeTask}
                  onEdit={setEditingTask}
                />}
          </main>

          <button style={S.fab} className="fab" onClick={() => setAdding(true)} aria-label="Add task">+</button>
        </>
      ) : (
        <ScheduleView
          events={data.events || []}
          onAdd={addEvent}
          onUpdate={updateEvent}
          onRemove={removeEvent}
        />
      )}

      {adding && (
        <AddTask
          portfolios={data.portfolios}
          defaultPortfolio={activePortfolio !== "all" ? activePortfolio : data.portfolios[0]?.id}
          onClose={() => setAdding(false)}
          onSave={(t) => { addTask(t); setAdding(false); }}
        />
      )}

      {editingTask && (
        <AddTask
          portfolios={data.portfolios}
          existing={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(patch) => { updateTask(editingTask.id, patch); setEditingTask(null); }}
          onDelete={() => { removeTask(editingTask.id); setEditingTask(null); }}
        />
      )}
    </div>
  );
}

// ---- summary ----------------------------------------------------
function summary(tasks) {
  const open = tasks.filter(t => t.status !== "done");
  const overdue = open.filter(t => { const n = dayDelta(t.due); return n !== null && n < 0; }).length;
  const today = open.filter(t => dayDelta(t.due) === 0).length;
  return { open: open.length, overdue, today };
}

// ================================================================
//  HEADER
// ================================================================
function Header({ view, setView, counts, onAdd }) {
  return (
    <header style={S.header}>
      <div style={S.headInner}>
        <div>
          <div style={S.kicker}>PORTFOLIO COMMAND</div>
          <h1 style={S.h1}>What needs you<span style={S.h1dot}>.</span></h1>
        </div>
        <div style={S.headRight}>
          <Stat n={counts.open} label="open" tone="#A78BFA" />
          <Stat n={counts.today} label="today" tone="#FB5607" />
          <Stat n={counts.overdue} label="overdue" tone="#FF2D78" />
        </div>
      </div>
      <div style={S.toggleRow}>
        <div style={S.toggle}>
          <button
            className="seg"
            style={{ ...S.seg, ...(view === "focus" ? S.segOn : {}) }}
            onClick={() => setView("focus")}
          >Focus</button>
          <button
            className="seg"
            style={{ ...S.seg, ...(view === "board" ? S.segOn : {}) }}
            onClick={() => setView("board")}
          >By portfolio</button>
        </div>
        <button style={S.addBtn} className="addBtn" onClick={onAdd}>+ Add task</button>
      </div>
    </header>
  );
}

function Stat({ n, label, tone }) {
  return (
    <div style={S.stat}>
      <div style={{ ...S.statN, color: tone }}>{n}</div>
      <div style={S.statL}>{label}</div>
    </div>
  );
}

// ================================================================
//  PORTFOLIO STRIP
// ================================================================
function PortfolioStrip({ portfolios, active, setActive, tasks, onAddPortfolio, onRemovePortfolio, onSetLogo, onClearLogo }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [manage, setManage] = useState(false);

  const openCount = (pid) =>
    tasks.filter(t => t.portfolioId === pid && t.status !== "done").length;

  const submit = () => {
    const v = name.trim();
    if (v) { onAddPortfolio(v); setName(""); setAdding(false); }
  };

  return (
    <div style={S.stripWrap}>
      <div style={S.strip}>
        <div style={S.stripScroll}>
          <Chip
            label="All" count={tasks.filter(t => t.status !== "done").length}
            on={active === "all"} accent={{ from: "#1E293B", to: "#334155" }}
            onClick={() => setActive("all")}
          />
          {portfolios.map(p => {
            const a = ACCENTS[p.accent % ACCENTS.length];
            return (
              <div key={p.id} style={{ position: "relative" }} className="chipWrap">
                <Chip
                  label={p.name} count={openCount(p.id)}
                  on={active === p.id} accent={a} logoUrl={p.logoUrl}
                  onClick={() => setActive(p.id)}
                />
                {manage && (
                  <button
                    style={S.chipKill} className="chipKill"
                    onClick={() => {
                      if (confirm(`Remove ${p.name} and its tasks?`)) {
                        onRemovePortfolio(p.id);
                        if (active === p.id) setActive("all");
                      }
                    }}
                    aria-label={`Remove ${p.name}`}
                  >×</button>
                )}
              </div>
            );
          })}

          {adding ? (
            <div style={S.addChip}>
              <input
                autoFocus value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") { setAdding(false); setName(""); } }}
                placeholder="Name…" style={S.addChipInput}
              />
              <button style={S.addChipGo} className="addChipGo" onClick={submit}>Add</button>
            </div>
          ) : (
            <button style={S.ghostChip} className="ghostChip" onClick={() => setAdding(true)}>+ Portfolio</button>
          )}
        </div>

        <button
          style={{ ...S.manageBtn, ...(manage ? S.manageOn : {}) }}
          className="manageBtn"
          onClick={() => setManage(m => !m)}
        >{manage ? "Done" : "Manage"}</button>
      </div>

      {manage && (
        <div style={S.managePanel}>
          <div style={S.managePanelTitle}>Portfolio logos</div>
          <div style={S.logoGrid}>
            {portfolios.map(p => {
              const a = ACCENTS[p.accent % ACCENTS.length];
              return (
                <div key={p.id} style={S.logoRow}>
                  <div style={{
                    ...S.logoPreview,
                    background: p.logoUrl ? "rgba(255,255,255,.92)" : `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  }}>
                    {p.logoUrl
                      ? <img src={p.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                      : <span style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>{p.name[0]}</span>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={S.logoName}>{p.name}</div>
                    <div style={S.logoActions}>
                      <label style={S.logoUpload} className="logoUpload">
                        {p.logoUrl ? "Replace" : "Upload logo"}
                        <input
                          type="file" accept="image/*" style={{ display: "none" }}
                          onChange={e => { const f = e.target.files?.[0]; if (f) onSetLogo(p.id, f); e.target.value = ""; }}
                        />
                      </label>
                      {p.logoUrl && (
                        <button style={S.logoClear} className="logoClear" onClick={() => onClearLogo(p.id)}>Remove</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={S.manageHint}>Square PNGs with transparent backgrounds look best. They appear as a small mark on every task in that portfolio.</div>
        </div>
      )}
    </div>
  );
}

function Chip({ label, count, on, accent, onClick, logoUrl }) {
  return (
    <button
      onClick={onClick}
      className="chip"
      style={{
        ...S.chip,
        background: on ? `linear-gradient(135deg, ${accent.from}, ${accent.to})` : "rgba(255,255,255,.04)",
        borderColor: on ? "transparent" : "rgba(255,255,255,.10)",
        color: on ? "#fff" : "#CBD5E1",
        boxShadow: on ? `0 8px 24px -8px ${accent.from}AA` : "none",
      }}
    >
      {logoUrl && <img src={logoUrl} alt="" style={S.chipLogo} loading="lazy" />}
      <span>{label}</span>
      <span style={{
        ...S.chipCount,
        background: on ? "rgba(0,0,0,.22)" : "rgba(255,255,255,.07)",
        color: on ? "#fff" : "#94A3B8",
      }}>{count}</span>
    </button>
  );
}

// ================================================================
//  FOCUS VIEW  — cross-portfolio, urgency-first
// ================================================================
function FocusView({ data, accentOf, filter, onUpdate, onRemove, onEdit, portfolioById, fPriority, fEffort, setFPriority, setFEffort }) {
  const tasks = data.tasks.filter(t => filter === "all" ? true : t.portfolioId === filter);
  const matchesFilters = (t) =>
    (fPriority === "all" || t.priority === fPriority) &&
    (fEffort === "all" || t.effort === fEffort);

  const open = tasks.filter(t => t.status !== "done" && matchesFilters(t));
  const done = tasks.filter(t => t.status === "done");
  const filtering = fPriority !== "all" || fEffort !== "all";

  const groups = useMemo(() => {
    const g = { overdue: [], today: [], week: [], later: [], someday: [] };
    open.forEach(t => {
      const n = dayDelta(t.due);
      if (n === null) g.someday.push(t);
      else if (n < 0) g.overdue.push(t);
      else if (n === 0) g.today.push(t);
      else if (n <= 7) g.week.push(t);
      else g.later.push(t);
    });
    const byPriThenDate = (a, b) => {
      const pr = PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank;
      if (pr) return pr;
      const da = dayDelta(a.due), db = dayDelta(b.due);
      if (da === null) return 1; if (db === null) return -1;
      return da - db;
    };
    Object.keys(g).forEach(k => g[k].sort(byPriThenDate));
    return g;
  }, [open]);

  const sections = [
    ["overdue", "Overdue", "#FF2D78"],
    ["today", "Today", "#FB5607"],
    ["week", "This week", "#FBBF24"],
    ["later", "Later", "#A78BFA"],
    ["someday", "No date", "#64748B"],
  ];

  const hasAny = open.length > 0;

  return (
    <div>
      <FilterBar
        fPriority={fPriority} fEffort={fEffort}
        setFPriority={setFPriority} setFEffort={setFEffort}
        count={open.length}
      />
      {!hasAny && (
        filtering
          ? <div style={S.noMatch}>Nothing matches that filter. <button style={S.clearLink} className="clearLink" onClick={() => { setFPriority("all"); setFEffort("all"); }}>Clear filters</button></div>
          : <Empty done={done.length} />
      )}
      {sections.map(([key, title, tone]) =>
        groups[key].length ? (
          <section key={key} style={S.section}>
            <div style={S.sectionHead}>
              <span style={{ ...S.sectionBar, background: tone }} />
              <h2 style={S.sectionTitle}>{title}</h2>
              <span style={S.sectionN}>{groups[key].length}</span>
            </div>
            <div style={S.cardGrid}>
              {groups[key].map(t => (
                <TaskCard
                  key={t.id} task={t}
                  portfolio={portfolioById[t.portfolioId]}
                  accent={accentOf(t.portfolioId)}
                  showPortfolio={filter === "all"}
                  onUpdate={onUpdate} onRemove={onRemove} onEdit={onEdit}
                />
              ))}
            </div>
          </section>
        ) : null
      )}

      {done.length > 0 && !filtering && (
        <DoneDrawer
          done={done} accentOf={accentOf}
          portfolioById={portfolioById}
          onUpdate={onUpdate} onRemove={onRemove} onEdit={onEdit}
        />
      )}
    </div>
  );
}

// ---- filter bar -------------------------------------------------
function FilterBar({ fPriority, fEffort, setFPriority, setFEffort, count }) {
  const Chip = ({ active, color, onClick, children }) => (
    <button
      className="filterChip"
      onClick={onClick}
      style={{
        ...S.filterChip,
        background: active ? color : "rgba(255,255,255,.04)",
        color: active ? "#0B1020" : "#CBD5E1",
        borderColor: active ? "transparent" : "rgba(255,255,255,.1)",
        fontWeight: active ? 800 : 600,
      }}
    >{children}</button>
  );
  return (
    <div style={S.filterBar}>
      <span style={S.filterLabel}>Priority</span>
      <Chip active={fPriority === "all"} color="#64748B" onClick={() => setFPriority("all")}>All</Chip>
      {Object.entries(PRIORITIES).map(([k, v]) => (
        <Chip key={k} active={fPriority === k} color={v.color} onClick={() => setFPriority(fPriority === k ? "all" : k)}>{v.label}</Chip>
      ))}
      <span style={S.filterDivider} />
      <span style={S.filterLabel}>Effort</span>
      <Chip active={fEffort === "all"} color="#64748B" onClick={() => setFEffort("all")}>All</Chip>
      {Object.entries(EFFORT).map(([k, v]) => (
        <Chip key={k} active={fEffort === k} color={v.color} onClick={() => setFEffort(fEffort === k ? "all" : k)}>{v.icon} {v.label}</Chip>
      ))}
      <span style={S.filterCount}>{count} shown</span>
    </div>
  );
}

// ================================================================
//  BOARD VIEW — grouped by portfolio
// ================================================================
function BoardView({ data, accentOf, filter, onUpdate, onRemove, onEdit }) {
  const portfolios = data.portfolios.filter(p => filter === "all" ? true : p.id === filter);
  const sortTasks = (arr) => [...arr].sort((a, b) => {
    if ((a.status === "done") !== (b.status === "done")) return a.status === "done" ? 1 : -1;
    const pr = PRIORITIES[a.priority].rank - PRIORITIES[b.priority].rank;
    if (pr) return pr;
    const da = dayDelta(a.due), db = dayDelta(b.due);
    if (da === null) return 1; if (db === null) return -1;
    return da - db;
  });

  return (
    <div style={S.board}>
      {portfolios.map(p => {
        const a = ACCENTS[p.accent % ACCENTS.length];
        const list = sortTasks(data.tasks.filter(t => t.portfolioId === p.id));
        const open = list.filter(t => t.status !== "done").length;
        return (
          <section key={p.id} style={S.col}>
            <div style={{ ...S.colHead, borderColor: a.from }}>
              <span style={{ ...S.colDot, background: `linear-gradient(135deg, ${a.from}, ${a.to})` }} />
              <h2 style={S.colTitle}>{p.name}</h2>
              <span style={S.colN}>{open}</span>
            </div>
            <div style={S.colBody}>
              {list.length === 0 && <div style={S.colEmpty}>Nothing logged</div>}
              {list.map(t => (
                <TaskCard
                  key={t.id} task={t} portfolio={p} accent={a}
                  showPortfolio={false} compact
                  onUpdate={onUpdate} onRemove={onRemove} onEdit={onEdit}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ================================================================
//  TASK CARD
// ================================================================
function TaskCard({ task, portfolio, accent, showPortfolio, compact, onUpdate, onRemove, onEdit }) {
  const [open, setOpen] = useState(false);
  const pri = PRIORITIES[task.priority];
  const eff = task.effort ? EFFORT[task.effort] : null;
  const due = dueMeta(task.due);
  const isDone = task.status === "done";

  const cycleStatus = () => {
    const order = ["active", "waiting", "done"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    onUpdate(task.id, { status: next });
  };

  return (
    <div
      className="taskCard"
      style={{
        ...S.card,
        ...(compact ? S.cardCompact : {}),
        opacity: isDone ? 0.55 : 1,
        borderLeft: `4px solid ${accent.from}`,
      }}
    >
      <button
        className="check"
        onClick={cycleStatus}
        style={{
          ...S.check,
          borderColor: STATUSES[task.status].dot,
          background: isDone ? STATUSES.done.dot : "transparent",
        }}
        aria-label="Cycle status"
      >{isDone ? "✓" : ""}</button>

      <div style={{ flex: 1, minWidth: 0, cursor: "pointer" }} onClick={() => onEdit && onEdit(task)}>
        <div style={S.cardTitleRow}>
          <div style={{ ...S.cardTitle, textDecoration: isDone ? "line-through" : "none" }}>
            {task.title}
          </div>
          {portfolio?.logoUrl && (
            <img src={portfolio.logoUrl} alt="" style={S.cardLogo} loading="lazy" />
          )}
        </div>

        <div style={S.cardMeta}>
          {showPortfolio && portfolio && (
            <span style={{
              ...S.tag,
              background: `linear-gradient(135deg, ${accent.from}22, ${accent.to}22)`,
              color: accent.to, borderColor: `${accent.from}55`,
            }}>
              {portfolio.logoUrl && <img src={portfolio.logoUrl} alt="" style={S.tagLogo} loading="lazy" />}
              {portfolio.name}
            </span>
          )}
          <span style={{ ...S.priTag, background: `${pri.color}1F`, color: pri.color }}>
            {pri.label}
          </span>
          {eff && (
            <span style={{ ...S.priTag, background: `${eff.color}1F`, color: eff.color }}>
              {eff.icon} {eff.label}
            </span>
          )}
          <button
            className="statusPill"
            onClick={(e) => { e.stopPropagation(); cycleStatus(); }}
            style={{ ...S.statusPill, color: STATUSES[task.status].dot }}
          >
            <span style={{ ...S.statusDot, background: STATUSES[task.status].dot }} />
            {STATUSES[task.status].label}
          </button>
          {due && <span style={{ ...S.duePill, color: due.tone, borderColor: `${due.tone}44` }}>{due.text}</span>}
          {task.forWhom && (
            <span style={S.forPill}>
              <span style={S.forPillIcon}>›</span>{task.forWhom}
            </span>
          )}
          {task.note && !open && (
            <button className="noteToggle" style={S.noteToggle} onClick={(e) => { e.stopPropagation(); setOpen(true); }}>note</button>
          )}
        </div>

        {open && task.note && <div style={S.note}>{task.note}</div>}
      </div>

      <div style={S.cardActions}>
        <button
          className="iconBtn" style={S.iconBtn}
          onClick={() => onEdit && onEdit(task)}
          aria-label="Edit"
        >✎</button>
        <button
          className="iconBtn" style={S.iconBtn}
          onClick={() => { if (confirm("Delete this task?")) onRemove(task.id); }}
          aria-label="Delete"
        >×</button>
      </div>
    </div>
  );
}

// ================================================================
//  DONE DRAWER
// ================================================================
function DoneDrawer({ done, accentOf, portfolioById, onUpdate, onRemove, onEdit }) {
  const [open, setOpen] = useState(false);
  return (
    <section style={{ ...S.section, marginTop: 36 }}>
      <button style={S.doneHead} className="doneHead" onClick={() => setOpen(o => !o)}>
        <span style={{ ...S.sectionBar, background: "#4ADE80" }} />
        <h2 style={S.sectionTitle}>Done</h2>
        <span style={S.sectionN}>{done.length}</span>
        <span style={{ ...S.chev, transform: open ? "rotate(90deg)" : "none" }}>›</span>
      </button>
      {open && (
        <div style={S.cardGrid}>
          {done.map(t => (
            <TaskCard
              key={t.id} task={t}
              portfolio={portfolioById[t.portfolioId]}
              accent={accentOf(t.portfolioId)}
              showPortfolio onUpdate={onUpdate} onRemove={onRemove} onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ================================================================
//  ADD TASK MODAL
// ================================================================
function AddTask({ portfolios, defaultPortfolio, existing, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [portfolioId, setPortfolioId] = useState(existing?.portfolioId || defaultPortfolio || portfolios[0]?.id);
  const [forWhom, setForWhom] = useState(existing?.forWhom || "");
  const [priority, setPriority] = useState(existing?.priority || "medium");
  const [effort, setEffort] = useState(existing?.effort || null);
  const [due, setDue] = useState(existing?.due || "");
  const [note, setNote] = useState(existing?.note || "");
  const [showNote, setShowNote] = useState(!!existing?.note);

  const save = () => {
    const v = title.trim();
    if (!v || !portfolioId) return;
    if (existing) {
      onSave({
        title: v, portfolioId, priority, effort,
        forWhom: forWhom.trim() || null,
        due: due || null, note: note.trim() || null,
      });
    } else {
      onSave({
        id: uid(), title: v, portfolioId, priority, effort,
        forWhom: forWhom.trim() || null,
        due: due || null, note: note.trim() || null,
        status: "active", created: Date.now(),
      });
    }
  };

  return (
    <div style={S.overlay} className="overlay" onClick={onClose}>
      <div style={S.modal} className="modal" onClick={e => e.stopPropagation()}>
        <div style={S.modalGlow} />
        <div style={S.modalHead}>
          <h3 style={S.modalTitle}>{existing ? "Edit task" : "New task"}</h3>
          <button style={S.modalX} className="iconBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <input
          autoFocus value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && (e.metaKey || !showNote)) save(); }}
          placeholder="What needs doing?"
          style={S.titleInput}
        />

        <label style={S.fieldLabel}>Portfolio</label>
        <div style={S.pickRow}>
          {portfolios.map(p => {
            const a = ACCENTS[p.accent % ACCENTS.length];
            const on = portfolioId === p.id;
            return (
              <button
                key={p.id} className="pick"
                onClick={() => setPortfolioId(p.id)}
                style={{
                  ...S.pick,
                  background: on ? `linear-gradient(135deg, ${a.from}, ${a.to})` : "rgba(255,255,255,.04)",
                  color: on ? "#fff" : "#CBD5E1",
                  borderColor: on ? "transparent" : "rgba(255,255,255,.1)",
                }}
              >{p.name}</button>
            );
          })}
        </div>

        <label style={S.fieldLabel}>For <span style={S.optional}>(optional — who it's for)</span></label>
        <input
          value={forWhom}
          onChange={e => setForWhom(e.target.value)}
          placeholder="e.g. Stuart, Luke, the board…"
          style={S.forInput}
        />

        <label style={S.fieldLabel}>Priority</label>
        <div style={S.pickRow}>
          {Object.entries(PRIORITIES).map(([k, v]) => {
            const on = priority === k;
            return (
              <button
                key={k} className="pick"
                onClick={() => setPriority(k)}
                style={{
                  ...S.pick,
                  background: on ? v.color : "rgba(255,255,255,.04)",
                  color: on ? "#0B1020" : "#CBD5E1",
                  borderColor: on ? "transparent" : "rgba(255,255,255,.1)",
                  fontWeight: on ? 800 : 600,
                }}
              >{v.label}</button>
            );
          })}
        </div>

        <label style={S.fieldLabel}>Effort <span style={S.optional}>(optional)</span></label>
        <div style={S.pickRow}>
          {Object.entries(EFFORT).map(([k, v]) => {
            const on = effort === k;
            return (
              <button
                key={k} className="pick"
                onClick={() => setEffort(on ? null : k)}
                style={{
                  ...S.pick,
                  background: on ? v.color : "rgba(255,255,255,.04)",
                  color: on ? "#0B1020" : "#CBD5E1",
                  borderColor: on ? "transparent" : "rgba(255,255,255,.1)",
                  fontWeight: on ? 800 : 600,
                }}
              >{v.icon} {v.label}</button>
            );
          })}
        </div>

        <div style={S.dueRow}>
          <div style={{ flex: 1 }}>
            <label style={S.fieldLabel}>Date <span style={S.optional}>(optional)</span></label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)} style={S.dateInput} />
          </div>
          {!showNote && (
            <button style={S.noteAdd} className="noteAdd" onClick={() => setShowNote(true)}>+ Note</button>
          )}
        </div>

        {showNote && (
          <>
            <label style={S.fieldLabel}>Note</label>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="One line of context…" rows={2} style={S.noteInput}
            />
          </>
        )}

        <div style={S.modalActions}>
          {existing && onDelete ? (
            <button style={S.deleteBtn} className="deleteBtn" onClick={() => { if (confirm("Delete this task?")) onDelete(); }}>Delete</button>
          ) : (
            <button style={S.cancelBtn} className="cancelBtn" onClick={onClose}>Cancel</button>
          )}
          <button
            style={{ ...S.saveBtn, opacity: title.trim() ? 1 : 0.5 }}
            className="saveBtn" onClick={save} disabled={!title.trim()}
          >{existing ? "Save" : "Add task"}</button>
        </div>
      </div>
    </div>
  );
}

// ================================================================
//  MOBILE CAPTURE  — fast, thumb-friendly task entry
// ================================================================
function MobileCapture({ portfolios, tasks, onSave, onAddPortfolio, onOpenBoard }) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [portfolioId, setPortfolioId] = useState(portfolios[0]?.id || "");
  const [forWhom, setForWhom] = useState("");
  const [priority, setPriority] = useState("medium");
  const [effort, setEffort] = useState(null);
  const [due, setDue] = useState("");
  const [more, setMore] = useState(false);
  const [flash, setFlash] = useState(0); // recent adds this session
  const [justAdded, setJustAdded] = useState(false);
  const [addingP, setAddingP] = useState(false);
  const [newP, setNewP] = useState("");

  const openCount = tasks.filter(t => t.status !== "done").length;
  const accent = ACCENTS[(portfolios.find(p => p.id === portfolioId)?.accent ?? 0) % ACCENTS.length];

  const save = () => {
    const v = title.trim();
    if (!v || !portfolioId) return;
    onSave({
      id: uid(), title: v, portfolioId, priority, effort,
      forWhom: forWhom.trim() || null,
      due: due || null, note: note.trim() || null,
      status: "active", created: Date.now(),
    });
    setTitle(""); setNote(""); setDue(""); setForWhom(""); setPriority("medium"); setEffort(null); setMore(false);
    setFlash(f => f + 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const submitPortfolio = () => {
    const v = newP.trim();
    if (v) { onAddPortfolio(v); setNewP(""); setAddingP(false); }
  };

  return (
    <div style={S.mc}>
      <style>{CSS}</style>

      <div style={S.mcTop}>
        <div>
          <div style={S.kicker}>QUICK ADD</div>
          <h1 style={S.mcH1}>Drop it here<span style={S.h1dot}>.</span></h1>
        </div>
        <button style={S.mcBoardBtn} className="mcBoardBtn" onClick={onOpenBoard}>
          Dashboard
          <span style={S.mcBoardN}>{openCount}</span>
        </button>
      </div>

      <div style={S.mcCard}>
        <div style={{ ...S.mcGlow, background: `radial-gradient(circle, ${accent.from}44, transparent 70%)` }} />

        <textarea
          autoFocus value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What needs doing?"
          rows={2} style={S.mcTitle}
        />

        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Add a description (optional)"
          rows={2} style={S.mcNote}
        />

        <label style={S.mcLabel}>Portfolio</label>
        <div style={S.mcChips}>
          {portfolios.map(p => {
            const a = ACCENTS[p.accent % ACCENTS.length];
            const on = portfolioId === p.id;
            return (
              <button
                key={p.id} className="pick"
                onClick={() => setPortfolioId(p.id)}
                style={{
                  ...S.mcChip,
                  background: on ? `linear-gradient(135deg, ${a.from}, ${a.to})` : "rgba(255,255,255,.05)",
                  color: on ? "#fff" : "#CBD5E1",
                  borderColor: on ? "transparent" : "rgba(255,255,255,.12)",
                  boxShadow: on ? `0 8px 20px -8px ${a.from}AA` : "none",
                }}
              >{p.name}</button>
            );
          })}
          {addingP ? (
            <span style={S.mcAddP}>
              <input
                autoFocus value={newP}
                onChange={e => setNewP(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") submitPortfolio(); if (e.key === "Escape") setAddingP(false); }}
                placeholder="Name…" style={S.mcAddPInput}
              />
              <button style={S.addChipGo} className="addChipGo" onClick={submitPortfolio}>Add</button>
            </span>
          ) : (
            <button style={S.mcChipGhost} className="ghostChip" onClick={() => setAddingP(true)}>+ New</button>
          )}
        </div>

        <label style={{ ...S.mcLabel, marginTop: 18 }}>For <span style={S.optional}>(optional)</span></label>
        <input
          value={forWhom}
          onChange={e => setForWhom(e.target.value)}
          placeholder="Who's it for?"
          style={S.mcFor}
        />

        {!more ? (
          <button style={S.mcMore} className="noteAdd" onClick={() => setMore(true)}>
            + Priority, effort & date
          </button>
        ) : (
          <div style={S.mcMoreWrap}>
            <label style={S.mcLabel}>Priority</label>
            <div style={S.mcChips}>
              {Object.entries(PRIORITIES).map(([k, v]) => {
                const on = priority === k;
                return (
                  <button
                    key={k} className="pick" onClick={() => setPriority(k)}
                    style={{
                      ...S.mcChip,
                      background: on ? v.color : "rgba(255,255,255,.05)",
                      color: on ? "#0B1020" : "#CBD5E1",
                      borderColor: on ? "transparent" : "rgba(255,255,255,.12)",
                      fontWeight: on ? 800 : 700,
                    }}
                  >{v.label}</button>
                );
              })}
            </div>
            <label style={{ ...S.mcLabel, marginTop: 16 }}>Effort</label>
            <div style={S.mcChips}>
              {Object.entries(EFFORT).map(([k, v]) => {
                const on = effort === k;
                return (
                  <button
                    key={k} className="pick" onClick={() => setEffort(on ? null : k)}
                    style={{
                      ...S.mcChip,
                      background: on ? v.color : "rgba(255,255,255,.05)",
                      color: on ? "#0B1020" : "#CBD5E1",
                      borderColor: on ? "transparent" : "rgba(255,255,255,.12)",
                      fontWeight: on ? 800 : 700,
                    }}
                  >{v.icon} {v.label}</button>
                );
              })}
            </div>
            <label style={{ ...S.mcLabel, marginTop: 16 }}>Date</label>
            <input type="date" value={due} onChange={e => setDue(e.target.value)} style={S.mcDate} />
          </div>
        )}
      </div>

      <button
        style={{ ...S.mcSave, opacity: title.trim() ? 1 : 0.45 }}
        className="saveBtn" onClick={save} disabled={!title.trim()}
      >
        {justAdded ? "✓ Added" : "Add task"}
      </button>

      {flash > 0 && (
        <div style={S.mcFlash}>
          {flash} added this session — they're on your dashboard
        </div>
      )}
    </div>
  );
}

// ================================================================
//  TAB BAR  — top-level Tasks / Schedule switch
// ================================================================
function TabBar({ tab, setTab, taskCount, onSignOut }) {
  return (
    <div style={S.tabBarWrap}>
      {onSignOut && (
        <div style={S.signOutRow}>
          <button style={S.signOut} className="manageBtn" onClick={onSignOut} aria-label="Sign out">Sign out</button>
        </div>
      )}
      <div style={S.tabBarRow}>
        <div style={S.tabBar}>
          <button
            className="tabBtn"
            style={{ ...S.tabBtn, ...(tab === "tasks" ? S.tabOn : {}) }}
            onClick={() => setTab("tasks")}
          >
            Tasks
            {taskCount > 0 && <span style={S.tabCount}>{taskCount}</span>}
          </button>
          <button
            className="tabBtn"
            style={{ ...S.tabBtn, ...(tab === "schedule" ? S.tabOnAlt : {}) }}
            onClick={() => setTab("schedule")}
          >
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
}

// ================================================================
//  SCHEDULE VIEW  — scrollable 7-day calendar, away-day planner
// ================================================================
function ScheduleView({ events, onAdd, onUpdate, onRemove }) {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [composing, setComposing] = useState(null); // a date string to add an event to
  const [editing, setEditing] = useState(null);
  const isMobile = useIsMobile();

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );
  const todayKey = ymd(new Date());

  const eventsByDay = useMemo(() => {
    const m = {};
    events.forEach(e => { (m[e.date] = m[e.date] || []).push(e); });
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

  return (
    <div style={S.schedule}>
      <div style={S.schedHeadRow}>
        <div>
          <div style={S.kicker}>SCHEDULE</div>
          <h1 style={S.schedH1}>Where I'll be<span style={S.h1dot}>.</span></h1>
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
                    <button
                      key={e.id}
                      className="evt"
                      style={{ ...S.evt, background: e.away ? "linear-gradient(135deg,#FF2D78,#FB5607)" : "linear-gradient(135deg,#14B8A6,#22D3EE)" }}
                      onClick={() => setEditing(e)}
                    >
                      <div style={S.evtTime}>
                        {e.allDay ? "All day" : `${fmtTime(e.start)}${e.end ? "–" + fmtTime(e.end) : ""}`}
                      </div>
                      <div style={S.evtTitle}>{e.title}</div>
                      {e.away && <div style={S.evtAway}>AWAY</div>}
                    </button>
                  ))}
                  <button style={isMobile ? S.dayAddRow : S.dayAdd} className="dayAdd" onClick={() => setComposing(key)} aria-label={`Add to ${DOW[i]}`}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={S.legend}>
        <span style={S.legendItem}><span style={{ ...S.legendDot, background: "linear-gradient(135deg,#FF2D78,#FB5607)" }} />Away</span>
        <span style={S.legendItem}><span style={{ ...S.legendDot, background: "linear-gradient(135deg,#14B8A6,#22D3EE)" }} />Local / in</span>
        <span style={S.legendHint}>Tap a day's + to add. Tap an entry to edit.</span>
      </div>

      {composing && (
        <AddEvent
          date={composing}
          onClose={() => setComposing(null)}
          onSave={(e) => { onAdd(e); setComposing(null); }}
        />
      )}
      {editing && (
        <AddEvent
          date={editing.date}
          existing={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => { onUpdate(editing.id, patch); setEditing(null); }}
          onDelete={() => { onRemove(editing.id); setEditing(null); }}
        />
      )}
    </div>
  );
}

// ================================================================
//  ADD / EDIT EVENT MODAL
// ================================================================
function AddEvent({ date, existing, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [day, setDay] = useState(date);
  const [away, setAway] = useState(existing?.away ?? true);
  const [allDay, setAllDay] = useState(existing?.allDay ?? false);
  const [start, setStart] = useState(existing?.start || "09:00");
  const [end, setEnd] = useState(existing?.end || "17:00");
  const [note, setNote] = useState(existing?.note || "");

  const save = () => {
    const v = title.trim();
    if (!v) return;
    onSave({
      id: existing?.id || uid("e"),
      title: v, date: day, away, allDay,
      start: allDay ? null : start,
      end: allDay ? null : end,
      note: note.trim() || null,
    });
  };

  const niceDate = new Date(day + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={S.overlay} className="overlay" onClick={onClose}>
      <div style={S.modal} className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ ...S.modalGlow, background: "radial-gradient(circle, #14B8A655, transparent 70%)" }} />
        <div style={S.modalHead}>
          <h3 style={S.modalTitle}>{existing ? "Edit entry" : "New entry"}</h3>
          <button style={S.modalX} className="iconBtn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <div style={S.eventDateChip}>{niceDate}</div>

        <input
          autoFocus value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. London — ETHOS onsite"
          style={S.titleInput}
        />

        <label style={S.fieldLabel}>Type</label>
        <div style={S.pickRow}>
          <button
            className="pick" onClick={() => setAway(true)}
            style={{ ...S.pick, background: away ? "linear-gradient(135deg,#FF2D78,#FB5607)" : "rgba(255,255,255,.04)", color: away ? "#fff" : "#CBD5E1", borderColor: away ? "transparent" : "rgba(255,255,255,.1)", fontWeight: away ? 800 : 600 }}
          >Away</button>
          <button
            className="pick" onClick={() => setAway(false)}
            style={{ ...S.pick, background: !away ? "linear-gradient(135deg,#14B8A6,#22D3EE)" : "rgba(255,255,255,.04)", color: !away ? "#06231F" : "#CBD5E1", borderColor: !away ? "transparent" : "rgba(255,255,255,.1)", fontWeight: !away ? 800 : 600 }}
          >Local / in</button>
        </div>

        <label style={S.fieldLabel}>Date</label>
        <input type="date" value={day} onChange={e => setDay(e.target.value)} style={S.dateInput} />

        <div style={{ ...S.dueRow, marginTop: 18, alignItems: "center" }}>
          <label style={{ ...S.fieldLabel, margin: 0 }}>Times</label>
          <button
            className="pick" onClick={() => setAllDay(a => !a)}
            style={{ ...S.pick, marginLeft: "auto", background: allDay ? "linear-gradient(135deg,#7C3AED,#A78BFA)" : "rgba(255,255,255,.04)", color: allDay ? "#fff" : "#CBD5E1", borderColor: allDay ? "transparent" : "rgba(255,255,255,.1)" }}
          >{allDay ? "✓ All day" : "All day"}</button>
        </div>

        {!allDay && (
          <div style={S.timeRow}>
            <div style={{ flex: 1 }}>
              <label style={S.miniLabel}>From</label>
              <input type="time" value={start} onChange={e => setStart(e.target.value)} style={S.dateInput} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.miniLabel}>To</label>
              <input type="time" value={end} onChange={e => setEnd(e.target.value)} style={S.dateInput} />
            </div>
          </div>
        )}

        <label style={{ ...S.fieldLabel, marginTop: 18 }}>Notes <span style={S.optional}>(optional)</span></label>
        <textarea
          value={note} onChange={e => setNote(e.target.value)}
          placeholder="Hotel, travel, who's covering home…" rows={2} style={S.noteInput}
        />

        <div style={S.modalActions}>
          {existing && onDelete ? (
            <button style={S.deleteBtn} className="deleteBtn" onClick={() => { if (confirm("Delete this entry?")) onDelete(); }}>Delete</button>
          ) : (
            <button style={S.cancelBtn} className="cancelBtn" onClick={onClose}>Cancel</button>
          )}
          <button
            style={{ ...S.saveBtn, opacity: title.trim() ? 1 : 0.5 }}
            className="saveBtn" onClick={save} disabled={!title.trim()}
          >{existing ? "Save" : "Add entry"}</button>
        </div>
      </div>
    </div>
  );
}

// ================================================================
//  EMPTY / SPLASH
// ================================================================
function Empty({ done }) {
  return (
    <div style={S.empty}>
      <div style={S.emptyMark}>✻</div>
      <div style={S.emptyTitle}>Clear runway</div>
      <div style={S.emptySub}>
        {done > 0 ? `Nothing open. ${done} done.` : "Nothing logged yet. Hit + to add your first task."}
      </div>
    </div>
  );
}

function Splash() {
  return (
    <div style={{ ...S.app, display: "grid", placeItems: "center" }}>
      <style>{CSS}</style>
      <div style={{ color: "#A78BFA", fontWeight: 800, letterSpacing: ".2em", fontSize: 13 }}>
        LOADING…
      </div>
    </div>
  );
}
