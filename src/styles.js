const FONT = `"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;

const S = {
  app: {
    minHeight: "100vh", width: "100%", fontFamily: FONT,
    background: "radial-gradient(1200px 600px at 12% -10%, #2A1052 0%, transparent 55%), radial-gradient(1000px 500px at 100% 0%, #07344A 0%, transparent 50%), #070A18",
    color: "#E8ECF4", paddingBottom: 120,
    paddingTop: "calc(20px + env(safe-area-inset-top, 0px))",
  },
  header: { padding: "26px 20px 0", maxWidth: 1600, margin: "0 auto" },
  headInner: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
  kicker: { fontSize: 11, fontWeight: 800, letterSpacing: ".28em", color: "#7C8BA8" },
  h1: { margin: "6px 0 0", fontSize: "clamp(30px, 6vw, 46px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 },
  h1dot: { background: "linear-gradient(135deg,#FF2D78,#A78BFA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  headRight: { display: "flex", gap: 10 },
  stat: {
    background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 16, padding: "10px 16px", minWidth: 70, textAlign: "center",
  },
  statN: { fontSize: 26, fontWeight: 800, lineHeight: 1 },
  statL: { fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "#7C8BA8", marginTop: 4 },

  toggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 22, flexWrap: "wrap" },
  toggle: { display: "inline-flex", background: "rgba(255,255,255,.05)", borderRadius: 14, padding: 4, border: "1px solid rgba(255,255,255,.08)" },
  seg: { border: "none", background: "transparent", color: "#94A3B8", fontWeight: 700, fontSize: 14, padding: "8px 18px", borderRadius: 10, cursor: "pointer", fontFamily: FONT },
  segOn: { background: "linear-gradient(135deg,#7C3AED,#FF2D78)", color: "#fff", boxShadow: "0 8px 20px -8px #7C3AEDcc" },
  addBtn: { border: "none", background: "linear-gradient(135deg,#FF2D78,#FB5607)", color: "#fff", fontWeight: 800, fontSize: 14, padding: "11px 20px", borderRadius: 12, cursor: "pointer", fontFamily: FONT, boxShadow: "0 10px 24px -10px #FF2D78" },

  strip: { maxWidth: 1600, margin: "22px auto 0", padding: "0 20px", display: "flex", alignItems: "center", gap: 12 },
  stripWrap: { width: "100%" },
  chipLogo: { width: 16, height: 16, borderRadius: 4, objectFit: "contain", background: "rgba(255,255,255,.92)", marginRight: 2 },
  managePanel: { maxWidth: 1600, margin: "14px auto 0", padding: "16px 20px", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18 },
  managePanelTitle: { fontSize: 11, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#7C8BA8", marginBottom: 14 },
  logoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 },
  logoRow: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 14, padding: 12 },
  logoPreview: { width: 46, height: 46, borderRadius: 11, display: "grid", placeItems: "center", overflow: "hidden", flexShrink: 0, padding: 4, boxSizing: "border-box" },
  logoName: { fontSize: 14, fontWeight: 700, color: "#E8ECF4", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  logoActions: { display: "flex", gap: 8 },
  logoUpload: { fontSize: 12, fontWeight: 700, color: "#0B1020", background: "linear-gradient(135deg,#84CC16,#BEF264)", borderRadius: 9, padding: "6px 12px", cursor: "pointer", fontFamily: FONT },
  logoClear: { fontSize: 12, fontWeight: 700, color: "#FF6B9D", background: "rgba(255,45,120,.1)", border: "1px solid rgba(255,45,120,.3)", borderRadius: 9, padding: "6px 12px", cursor: "pointer", fontFamily: FONT },
  manageHint: { fontSize: 12, color: "#64748B", fontWeight: 600, marginTop: 14, lineHeight: 1.5 },
  stripScroll: { display: "flex", gap: 10, overflowX: "auto", paddingTop: 9, paddingBottom: 6, flex: 1 },
  chip: { display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 13, border: "1px solid", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", fontFamily: FONT, transition: "transform .12s ease" },
  chipCount: { fontSize: 12, fontWeight: 800, borderRadius: 8, padding: "1px 7px", minWidth: 20, textAlign: "center" },
  chipKill: { position: "absolute", top: -7, right: -7, width: 20, height: 20, borderRadius: "50%", border: "2px solid #070A18", background: "#FF2D78", color: "#fff", fontSize: 13, lineHeight: 1, cursor: "pointer", display: "grid", placeItems: "center", padding: 0 },
  ghostChip: { padding: "9px 15px", borderRadius: 13, border: "1px dashed rgba(255,255,255,.22)", background: "transparent", color: "#94A3B8", fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", fontFamily: FONT },
  addChip: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.06)", borderRadius: 13, padding: 4, border: "1px solid rgba(255,255,255,.12)" },
  addChipInput: { background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 16, fontWeight: 600, padding: "5px 8px", width: 100, fontFamily: FONT },
  addChipGo: { border: "none", background: "linear-gradient(135deg,#84CC16,#BEF264)", color: "#1A2E03", fontWeight: 800, fontSize: 13, padding: "6px 12px", borderRadius: 10, cursor: "pointer", fontFamily: FONT },
  manageBtn: { border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#94A3B8", fontWeight: 700, fontSize: 13, padding: "9px 14px", borderRadius: 12, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" },
  manageOn: { background: "linear-gradient(135deg,#FF2D78,#FB5607)", color: "#fff", borderColor: "transparent" },

  main: { maxWidth: 1600, margin: "26px auto 0", padding: "0 20px" },

  section: { marginBottom: 30 },
  sectionHead: { display: "flex", alignItems: "center", gap: 11, marginBottom: 14 },
  sectionBar: { width: 4, height: 20, borderRadius: 4 },
  sectionTitle: { margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: "-.01em" },
  sectionN: { fontSize: 13, fontWeight: 800, color: "#64748B", background: "rgba(255,255,255,.05)", borderRadius: 8, padding: "2px 9px" },

  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))", gap: 12 },

  card: { display: "flex", alignItems: "flex-start", gap: 12, background: "rgba(255,255,255,.045)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: "15px 15px 15px 13px", transition: "transform .12s ease, background .12s ease" },
  cardCompact: { padding: "12px 12px 12px 11px" },
  check: { flexShrink: 0, width: 24, height: 24, borderRadius: 8, border: "2px solid", background: "transparent", color: "#07140C", fontWeight: 900, fontSize: 14, cursor: "pointer", display: "grid", placeItems: "center", marginTop: 1 },
  cardTitle: { fontSize: 15, fontWeight: 700, lineHeight: 1.35, color: "#F1F5FB", wordBreak: "break-word" },
  cardTitleRow: { display: "flex", alignItems: "flex-start", gap: 10, justifyContent: "space-between" },
  cardLogo: { width: 26, height: 26, borderRadius: 7, objectFit: "contain", background: "rgba(255,255,255,.9)", padding: 2, flexShrink: 0 },
  tagLogo: { width: 14, height: 14, borderRadius: 4, objectFit: "contain", background: "rgba(255,255,255,.9)", marginRight: 5, verticalAlign: "middle" },
  cardMeta: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 9, alignItems: "center" },
  tag: { fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 8, border: "1px solid", letterSpacing: ".01em" },
  priTag: { fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 8 },
  statusPill: { display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,.05)", border: "none", borderRadius: 8, padding: "3px 9px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: FONT },
  statusDot: { width: 7, height: 7, borderRadius: "50%" },
  duePill: { fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 8, border: "1px solid" },
  noteToggle: { background: "transparent", border: "none", color: "#7C8BA8", fontSize: 11, fontWeight: 700, cursor: "pointer", textDecoration: "underline", fontFamily: FONT },
  note: { marginTop: 10, fontSize: 13, lineHeight: 1.5, color: "#AEB9CC", background: "rgba(0,0,0,.22)", borderRadius: 10, padding: "9px 11px" },
  cardActions: { display: "flex", flexDirection: "column", gap: 4 },
  iconBtn: { width: 28, height: 28, borderRadius: 9, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", color: "#94A3B8", fontSize: 16, lineHeight: 1, cursor: "pointer", display: "grid", placeItems: "center", fontFamily: FONT },

  board: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: 16, alignItems: "start" },
  col: { background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 20, padding: 14 },
  colHead: { display: "flex", alignItems: "center", gap: 9, paddingBottom: 12, marginBottom: 12, borderBottom: "2px solid" },
  colDot: { width: 12, height: 12, borderRadius: 5 },
  colTitle: { margin: 0, fontSize: 15, fontWeight: 800, flex: 1 },
  colN: { fontSize: 12, fontWeight: 800, color: "#64748B", background: "rgba(255,255,255,.05)", borderRadius: 8, padding: "2px 8px" },
  colBody: { display: "flex", flexDirection: "column", gap: 9 },
  colEmpty: { fontSize: 13, color: "#5A6678", textAlign: "center", padding: "18px 0", fontWeight: 600 },

  doneHead: { display: "flex", alignItems: "center", gap: 11, background: "transparent", border: "none", cursor: "pointer", padding: 0, width: "100%", fontFamily: FONT },
  chev: { color: "#64748B", fontSize: 20, fontWeight: 800, transition: "transform .15s ease" },

  fab: { position: "fixed", bottom: 24, right: 24, width: 58, height: 58, borderRadius: 19, border: "none", background: "linear-gradient(135deg,#FF2D78,#7C3AED)", color: "#fff", fontSize: 30, fontWeight: 400, cursor: "pointer", boxShadow: "0 16px 36px -10px #FF2D78cc", zIndex: 40, lineHeight: 1 },

  overlay: { position: "fixed", inset: 0, background: "rgba(4,6,16,.72)", backdropFilter: "blur(8px)", display: "grid", placeItems: "center", padding: 16, zIndex: 60 },
  modal: { position: "relative", width: "100%", maxWidth: 460, background: "linear-gradient(180deg, #141A2E, #0C1020)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 24, padding: 22, overflow: "hidden", maxHeight: "90vh", overflowY: "auto" },
  modalGlow: { position: "absolute", top: -60, right: -40, width: 200, height: 200, background: "radial-gradient(circle, #FF2D7855, transparent 70%)", pointerEvents: "none" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle: { margin: 0, fontSize: 20, fontWeight: 800 },
  modalX: { width: 32, height: 32, borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "#94A3B8", fontSize: 20, cursor: "pointer", fontFamily: FONT },
  titleInput: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 17, fontWeight: 600, outline: "none", fontFamily: FONT, marginBottom: 18 },
  fieldLabel: { display: "block", fontSize: 11, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#7C8BA8", marginBottom: 9 },
  optional: { color: "#556", fontWeight: 600, letterSpacing: 0, textTransform: "none" },
  pickRow: { display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 },
  pick: { border: "1px solid", borderRadius: 11, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: FONT },
  dueRow: { display: "flex", gap: 12, alignItems: "flex-end", marginBottom: 18 },
  dateInput: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 16, fontFamily: FONT, colorScheme: "dark" },
  noteAdd: { border: "1px dashed rgba(255,255,255,.22)", background: "transparent", color: "#94A3B8", fontWeight: 700, fontSize: 13, padding: "11px 16px", borderRadius: 12, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" },
  noteInput: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 16, fontFamily: FONT, resize: "vertical", outline: "none", marginBottom: 18 },
  modalActions: { display: "flex", gap: 10, marginTop: 4 },
  cancelBtn: { flex: 1, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#CBD5E1", fontWeight: 700, fontSize: 14, padding: "13px", borderRadius: 13, cursor: "pointer", fontFamily: FONT },
  saveBtn: { flex: 2, border: "none", background: "linear-gradient(135deg,#FF2D78,#7C3AED)", color: "#fff", fontWeight: 800, fontSize: 15, padding: "13px", borderRadius: 13, cursor: "pointer", fontFamily: FONT, boxShadow: "0 12px 28px -10px #FF2D78" },

  backToCapture: { display: "block", margin: "20px auto -6px", border: "none", background: "rgba(255,255,255,.06)", color: "#CBD5E1", fontWeight: 700, fontSize: 14, padding: "9px 18px", borderRadius: 12, cursor: "pointer", fontFamily: FONT },

  mc: { minHeight: "100vh", boxSizing: "border-box", padding: "calc(24px + env(safe-area-inset-top, 0px)) 18px 40px", display: "flex", flexDirection: "column", gap: 18 },
  mcTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  mcH1: { margin: "6px 0 0", fontSize: 32, fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1, color: "#F1F5FB" },
  mcBoardBtn: { display: "inline-flex", alignItems: "center", gap: 8, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#E8ECF4", fontWeight: 700, fontSize: 14, padding: "10px 14px", borderRadius: 13, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" },
  mcBoardN: { fontSize: 12, fontWeight: 800, background: "linear-gradient(135deg,#FF2D78,#7C3AED)", color: "#fff", borderRadius: 8, padding: "2px 8px" },
  mcCard: { position: "relative", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 22, padding: 18, overflow: "hidden" },
  mcGlow: { position: "absolute", top: -50, right: -30, width: 160, height: 160, pointerEvents: "none", transition: "background .3s ease" },
  mcTitle: { width: "100%", boxSizing: "border-box", background: "transparent", border: "none", color: "#fff", fontSize: 22, fontWeight: 700, outline: "none", fontFamily: FONT, resize: "none", lineHeight: 1.3 },
  mcNote: { width: "100%", boxSizing: "border-box", background: "rgba(0,0,0,.18)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "12px 14px", color: "#D7DEEA", fontSize: 15, outline: "none", fontFamily: FONT, resize: "none", marginTop: 8, marginBottom: 18 },
  mcLabel: { display: "block", fontSize: 11, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase", color: "#7C8BA8", marginBottom: 10 },
  mcChips: { display: "flex", flexWrap: "wrap", gap: 9 },
  mcChip: { border: "1px solid", borderRadius: 13, padding: "11px 16px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT },
  mcChipGhost: { border: "1px dashed rgba(255,255,255,.25)", background: "transparent", color: "#94A3B8", borderRadius: 13, padding: "11px 16px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: FONT },
  mcAddP: { display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,.06)", borderRadius: 13, padding: 5, border: "1px solid rgba(255,255,255,.12)" },
  mcAddPInput: { background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 16, fontWeight: 600, padding: "6px 8px", width: 96, fontFamily: FONT },
  mcMore: { marginTop: 18, border: "1px dashed rgba(255,255,255,.22)", background: "transparent", color: "#94A3B8", fontWeight: 700, fontSize: 14, padding: "12px", borderRadius: 13, cursor: "pointer", fontFamily: FONT, width: "100%" },
  mcMoreWrap: { marginTop: 18 },
  mcDate: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 13, padding: "13px 14px", color: "#fff", fontSize: 16, fontFamily: FONT, colorScheme: "dark" },
  mcSave: { border: "none", background: "linear-gradient(135deg,#FF2D78,#7C3AED)", color: "#fff", fontWeight: 800, fontSize: 17, padding: "17px", borderRadius: 16, cursor: "pointer", fontFamily: FONT, boxShadow: "0 14px 30px -10px #FF2D78", position: "sticky", bottom: 16 },
  mcFlash: { textAlign: "center", fontSize: 13, fontWeight: 600, color: "#4ADE80" },

  forInput: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "11px 14px", color: "#fff", fontSize: 16, fontWeight: 600, outline: "none", fontFamily: FONT, marginBottom: 18 },
  filterBar: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 22, padding: "12px 14px", background: "rgba(255,255,255,.025)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16 },
  filterLabel: { fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#64748B", marginRight: 2 },
  filterChip: { border: "1px solid", borderRadius: 10, padding: "6px 13px", fontSize: 13, cursor: "pointer", fontFamily: FONT },
  filterDivider: { width: 1, height: 22, background: "rgba(255,255,255,.1)", margin: "0 6px" },
  filterCount: { marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#64748B" },
  noMatch: { textAlign: "center", padding: "60px 20px", color: "#7C8BA8", fontSize: 15, fontWeight: 600 },
  clearLink: { background: "none", border: "none", color: "#A78BFA", fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: FONT, textDecoration: "underline" },
  forPill: { display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, fontWeight: 800, padding: "3px 9px 3px 7px", borderRadius: 8, background: "rgba(167,139,250,.15)", color: "#C4B5FD", border: "1px solid rgba(167,139,250,.3)" },
  forPillIcon: { fontWeight: 900, opacity: 0.7 },
  mcFor: { width: "100%", boxSizing: "border-box", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 13, padding: "13px 14px", color: "#fff", fontSize: 16, fontWeight: 600, outline: "none", fontFamily: FONT },

  tabBarWrap: { paddingTop: 14, paddingLeft: 16, paddingRight: 16 },
  signOutRow: { display: "flex", justifyContent: "flex-end", maxWidth: 1600, margin: "0 auto 10px", width: "100%" },
  tabBarRow: { display: "flex", justifyContent: "center", width: "100%" },
  tabBar: { display: "inline-flex", gap: 4, background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 16, padding: 5, flexShrink: 0 },
  tabBtn: { display: "inline-flex", alignItems: "center", gap: 7, border: "none", background: "transparent", color: "#94A3B8", fontWeight: 800, fontSize: 15, padding: "10px 22px", borderRadius: 12, cursor: "pointer", fontFamily: FONT },
  tabOn: { background: "linear-gradient(135deg,#FF2D78,#7C3AED)", color: "#fff", boxShadow: "0 8px 22px -8px #FF2D78cc" },
  tabOnAlt: { background: "linear-gradient(135deg,#14B8A6,#22D3EE)", color: "#06231F", boxShadow: "0 8px 22px -8px #14B8A6cc" },
  tabOnShop: { background: "linear-gradient(135deg,#84CC16,#BEF264)", color: "#1A2E03", boxShadow: "0 8px 22px -8px #84CC16cc" },
  tabCount: { fontSize: 12, fontWeight: 800, background: "rgba(0,0,0,.22)", borderRadius: 7, padding: "1px 7px" },
  signOut: { border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#94A3B8", fontWeight: 700, fontSize: 13, padding: "8px 14px", borderRadius: 12, cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap" },

  schedule: { maxWidth: 1600, margin: "20px auto 0", padding: "0 20px 60px" },

  shop: { maxWidth: 620, margin: "0 auto", padding: "8px 20px 60px" },
  shopLoading: { textAlign: "center", padding: "80px 20px", color: "#BEF264", fontWeight: 800, letterSpacing: ".2em", fontSize: 13 },
  shopH1: { margin: "6px 0 0", fontSize: "clamp(28px, 7vw, 38px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 },
  shopSub: { fontSize: 14, color: "#94A3B8", marginTop: 8, fontWeight: 600 },
  shopAddRow: { display: "flex", gap: 8, marginTop: 20 },
  shopInput: { flex: 1, boxSizing: "border-box", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 14, padding: "14px 16px", color: "#fff", fontSize: 16, fontWeight: 600, outline: "none", fontFamily: FONT },
  shopAddBtn: { border: "none", background: "linear-gradient(135deg,#84CC16,#BEF264)", color: "#1A2E03", fontWeight: 800, fontSize: 15, padding: "0 20px", borderRadius: 14, cursor: "pointer", fontFamily: FONT },
  shopViewToggle: { display: "inline-flex", background: "rgba(255,255,255,.05)", borderRadius: 12, padding: 4, border: "1px solid rgba(255,255,255,.08)", marginTop: 18 },
  shopSeg: { border: "none", background: "transparent", color: "#94A3B8", fontWeight: 700, fontSize: 13, padding: "7px 14px", borderRadius: 9, cursor: "pointer", fontFamily: FONT },
  shopSegOn: { background: "linear-gradient(135deg,#84CC16,#BEF264)", color: "#1A2E03" },
  shopGroup: { marginBottom: 4 },
  shopGroupHead: { fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase", color: "#7C8BA8", margin: "14px 0 8px", display: "flex", alignItems: "center", gap: 8 },
  shopGroupN: { fontSize: 11, fontWeight: 800, color: "#5F6B7E", background: "rgba(255,255,255,.05)", borderRadius: 6, padding: "1px 6px" },
  shopGroupItems: { display: "flex", flexDirection: "column", gap: 8 },
  shopItems: { display: "flex", flexDirection: "column", gap: 8, marginTop: 20 },
  shopItem: { display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,.045)", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: 14 },
  shopItemDone: { background: "rgba(255,255,255,.02)", borderColor: "rgba(255,255,255,.05)", opacity: 0.55 },
  shopCheck: { width: 26, height: 26, borderRadius: 8, border: "2px solid", background: "transparent", color: "#07140C", fontWeight: 900, fontSize: 15, cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 },
  shopItemName: { fontSize: 16, fontWeight: 600, color: "#F1F5FB", flex: 1, wordBreak: "break-word" },
  shopItemKill: { width: 30, height: 30, borderRadius: 9, border: "1px solid rgba(255,255,255,.08)", background: "rgba(255,255,255,.03)", color: "#94A3B8", fontSize: 18, lineHeight: 1, cursor: "pointer", display: "grid", placeItems: "center", fontFamily: FONT, flexShrink: 0 },
  shopEmpty: { textAlign: "center", padding: "50px 20px", color: "#7C8BA8", fontSize: 15, fontWeight: 600 },
  shopActions: { display: "flex", gap: 10, marginTop: 22 },
  shopClearTicked: { flex: 1, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.04)", color: "#CBD5E1", fontWeight: 700, fontSize: 14, padding: "13px", borderRadius: 13, cursor: "pointer", fontFamily: FONT },
  shopClearAll: { flex: 1, border: "1px solid rgba(255,45,120,.3)", background: "rgba(255,45,120,.1)", color: "#FF6B9D", fontWeight: 700, fontSize: 14, padding: "13px", borderRadius: 13, cursor: "pointer", fontFamily: FONT },
  schedHeadRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" },
  schedH1: { margin: "6px 0 0", fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1 },
  weekNav: { display: "inline-flex", alignItems: "center", gap: 8 },
  navBtn: { width: 42, height: 42, borderRadius: 13, border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#E8ECF4", fontSize: 22, fontWeight: 700, cursor: "pointer", fontFamily: FONT, display: "grid", placeItems: "center", lineHeight: 1 },
  todayBtn: { border: "1px solid rgba(255,255,255,.12)", background: "rgba(255,255,255,.05)", color: "#E8ECF4", fontWeight: 700, fontSize: 14, padding: "0 16px", height: 42, borderRadius: 13, cursor: "pointer", fontFamily: FONT },
  rangeLabel: { fontSize: 15, fontWeight: 700, color: "#94A3B8", marginTop: 14, marginBottom: 14 },

  weekScroll: { overflowX: "auto", paddingBottom: 8, margin: "0 -20px", padding: "0 20px 8px" },
  week: { display: "grid", gridTemplateColumns: "repeat(7, minmax(150px, 1fr))", gap: 10, minWidth: 0 },
  day: { position: "relative", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 18, padding: 12, minHeight: 230, display: "flex", flexDirection: "column" },
  dayToday: { background: "rgba(255,45,120,.07)", border: "1px solid rgba(255,45,120,.35)", boxShadow: "0 0 0 1px rgba(255,45,120,.15)" },
  dayWeekend: { background: "rgba(255,255,255,.015)" },
  dayHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  dayName: { fontSize: 11, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" },
  dayNum: { fontSize: 24, fontWeight: 800, lineHeight: 1, marginTop: 2 },
  todayDot: { fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: "#FF6B9D", background: "rgba(255,45,120,.16)", borderRadius: 7, padding: "3px 7px" },
  dayBody: { display: "flex", flexDirection: "column", gap: 7, flex: 1 },
  dayEmpty: { color: "#3A4357", fontSize: 18, textAlign: "center", paddingTop: 16 },
  evt: { textAlign: "left", border: "none", borderRadius: 12, padding: "9px 11px", cursor: "pointer", fontFamily: FONT, color: "#fff", display: "flex", flexDirection: "column", gap: 2 },
  evtTime: { fontSize: 11, fontWeight: 800, opacity: 0.92 },
  evtTitle: { fontSize: 13, fontWeight: 700, lineHeight: 1.3 },
  evtAway: { fontSize: 9, fontWeight: 900, letterSpacing: ".14em", marginTop: 3, opacity: 0.92 },
  dayAdd: { marginTop: 8, border: "1px dashed rgba(255,255,255,.18)", background: "transparent", color: "#7C8BA8", fontSize: 18, fontWeight: 600, borderRadius: 11, padding: "5px 0", cursor: "pointer", fontFamily: FONT, lineHeight: 1 },

  // --- mobile vertical stack (whole week scrolls down) ---
  weekStack: { paddingBottom: 8 },
  weekCol: { display: "flex", flexDirection: "column", gap: 10 },
  dayRow: { position: "relative", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)", borderRadius: 16, padding: 14, display: "flex", flexDirection: "column", gap: 10 },
  dayHeadRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  dayHeadRowInner: { display: "flex", alignItems: "baseline", gap: 10 },
  dayBodyRow: { display: "flex", flexDirection: "column", gap: 8 },
  dayAddRow: { border: "1px dashed rgba(255,255,255,.18)", background: "transparent", color: "#7C8BA8", fontSize: 16, fontWeight: 700, borderRadius: 11, padding: "9px 0", cursor: "pointer", fontFamily: FONT, lineHeight: 1 },

  legend: { display: "flex", alignItems: "center", gap: 18, marginTop: 18, flexWrap: "wrap" },
  legendItem: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, color: "#CBD5E1" },
  legendDot: { width: 14, height: 14, borderRadius: 5 },
  legendHint: { fontSize: 13, color: "#64748B", fontWeight: 600 },

  eventDateChip: { display: "inline-block", fontSize: 13, fontWeight: 800, color: "#5EEAD4", background: "rgba(20,184,166,.12)", border: "1px solid rgba(20,184,166,.3)", borderRadius: 10, padding: "6px 12px", marginBottom: 16 },
  timeRow: { display: "flex", gap: 12, marginTop: 10 },
  miniLabel: { display: "block", fontSize: 10, fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase", color: "#7C8BA8", marginBottom: 7 },
  deleteBtn: { flex: 1, border: "1px solid rgba(255,45,120,.35)", background: "rgba(255,45,120,.1)", color: "#FF6B9D", fontWeight: 700, fontSize: 14, padding: "13px", borderRadius: 13, cursor: "pointer", fontFamily: FONT },

  empty: { textAlign: "center", padding: "80px 20px" },
  emptyMark: { fontSize: 50, color: "#7C3AED", marginBottom: 12 },
  emptyTitle: { fontSize: 22, fontWeight: 800, marginBottom: 6 },
  emptySub: { fontSize: 15, color: "#7C8BA8" },
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');
  :root { color-scheme: dark; }
  html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; -webkit-text-size-adjust: 100%; background: #070A18; color: #E8ECF4; }
  #root { width: 100%; min-height: 100vh; min-height: 100dvh; }
  /* iOS Safari zooms in when you focus an input under 16px — force 16px on touch inputs to stop it */
  input, textarea, select { font-size: 16px; }
  * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
  ::-webkit-scrollbar { height: 7px; width: 7px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,.14); border-radius: 4px; }
  .taskCard:hover { transform: translateY(-2px); background: rgba(255,255,255,.07) !important; }
  .chip:hover { transform: translateY(-1px); }
  .fab:hover { transform: scale(1.06) rotate(90deg); transition: transform .2s ease; }
  .fab { transition: transform .2s ease; }
  .iconBtn:hover { background: rgba(255,45,120,.16) !important; color: #FF6B9D !important; border-color: rgba(255,45,120,.4) !important; }
  .addBtn:hover, .saveBtn:hover, .addChipGo:hover { filter: brightness(1.08); }
  .ghostChip:hover, .noteAdd:hover { border-color: rgba(255,255,255,.4); color: #fff; }
  .manageBtn:hover { color: #fff; }
  .cancelBtn:hover { background: rgba(255,255,255,.08); }
  .pick:hover { filter: brightness(1.12); }
  .seg:hover { color: #fff; }
  .doneHead:hover .chev { color: #94A3B8; }
  .tabBtn:hover { color: #fff; }
  .navBtn:hover, .todayBtn:hover { background: rgba(255,255,255,.1) !important; }
  .evt:hover { filter: brightness(1.08); transform: translateY(-1px); transition: transform .12s ease; }
  .dayAdd:hover { border-color: rgba(255,255,255,.4); color: #fff; }
  .deleteBtn:hover { background: rgba(255,45,120,.18) !important; }
  .filterChip:hover { filter: brightness(1.1); border-color: rgba(255,255,255,.3) !important; }
  .clearLink:hover { color: #C4B5FD; }
  input:focus, textarea:focus { border-color: rgba(167,139,250,.6) !important; }
  @media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
  @media (max-width: 560px) {
    .modal { border-radius: 20px; }
  }
`;

export { S, CSS, FONT };
