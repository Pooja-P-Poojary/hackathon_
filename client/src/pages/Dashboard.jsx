import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Sparkles,
  Network,
  Users,
  AlertTriangle,
  FileText,
  Moon,
  Sun,
  DollarSign,
  Image as ImageIcon,
  Award,
  MessageSquare,
  UserPlus,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  Calendar,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
/* ---------------------------------------------------------------------- */
/* Data — stand-in for the MongoDB "Events / Documents / Faculty" model    */
/* ---------------------------------------------------------------------- */

const EVENTS = [
  {
    id: "evt-ai",
    name: "AI Workshop",
    date: "12 Feb 2026",
    dept: "CSE",
    faculty: "Dr. Ramesh",
    docs: [
      { id: "d1", type: "Attendance", status: "verified", uploadedBy: "Office Staff", date: "13 Feb" },
      { id: "d2", type: "Budget", status: "verified", uploadedBy: "Accounts Cell", date: "14 Feb" },
      { id: "d3", type: "Photos", status: "verified", uploadedBy: "Media Club", date: "13 Feb" },
      { id: "d4", type: "Certificates", status: "verified", uploadedBy: "Dr. Ramesh", date: "15 Feb" },
      { id: "d5", type: "Feedback", status: "verified", uploadedBy: "Students", date: "16 Feb" },
      { id: "d6", type: "Report", status: "missing", uploadedBy: "—", date: "—" },
      { id: "d7", type: "Guest Details", status: "verified", uploadedBy: "Dr. Ramesh", date: "12 Feb" },
    ],
  },
  {
    id: "evt-cyber",
    name: "Cyber Security Workshop",
    date: "02 Mar 2026",
    dept: "CSE",
    faculty: "Dr. Ramesh",
    docs: [
      { id: "d1", type: "Attendance", status: "verified", uploadedBy: "Office Staff", date: "03 Mar" },
      { id: "d2", type: "Budget", status: "verified", uploadedBy: "Accounts Cell", date: "04 Mar" },
      { id: "d3", type: "Photos", status: "missing", uploadedBy: "—", date: "—" },
      { id: "d4", type: "Certificates", status: "verified", uploadedBy: "Dr. Ramesh", date: "05 Mar" },
      { id: "d5", type: "Feedback", status: "verified", uploadedBy: "Students", date: "06 Mar" },
      { id: "d6", type: "Report", status: "verified", uploadedBy: "Dr. Ramesh", date: "07 Mar" },
    ],
  },
  {
    id: "evt-robo",
    name: "Robotics Meet",
    date: "19 Mar 2026",
    dept: "ME",
    faculty: "Dr. Shalini Rao",
    docs: [
      { id: "d1", type: "Attendance", status: "verified", uploadedBy: "Office Staff", date: "20 Mar" },
      { id: "d2", type: "Budget", status: "missing", uploadedBy: "—", date: "—" },
      { id: "d3", type: "Photos", status: "verified", uploadedBy: "Media Club", date: "19 Mar" },
      { id: "d4", type: "Certificates", status: "missing", uploadedBy: "—", date: "—" },
      { id: "d5", type: "Feedback", status: "verified", uploadedBy: "Students", date: "21 Mar" },
      { id: "d6", type: "Report", status: "verified", uploadedBy: "Dr. Shalini Rao", date: "22 Mar" },
      { id: "d7", type: "Guest Details", status: "verified", uploadedBy: "Dr. Shalini Rao", date: "19 Mar" },
    ],
  },
];

const DOC_ICONS = {
  Attendance: Users,
  Budget: DollarSign,
  Photos: ImageIcon,
  Certificates: Award,
  Feedback: MessageSquare,
  Report: FileText,
  "Guest Details": UserPlus,
};

const ASK_PROMPTS = [
  {
    q: "Which faculty conducted the most workshops?",
    a: "Dr. Ramesh — 12 workshops logged across CSE, more than any other faculty this year.",
  },
  {
    q: "Show missing documents for AI Workshop.",
    a: "1 file missing: Report. Attendance, budget, photos, certificates, feedback and guest details are all verified.",
  },
  {
    q: "List workshops run by CSE in 2026.",
    a: "2 found so far — AI Workshop (Feb) and Cyber Security Workshop (Mar) — with a third pending upload.",
  },
];

/* ---------------------------------------------------------------------- */
/* Theme tokens                                                           */
/* ---------------------------------------------------------------------- */

const THEMES = {
  dark: {
    name: "dark",
    bg: "#0B0F1F",
    bgGrad: "radial-gradient(ellipse 900px 500px at 50% -10%, #1B2350 0%, #0B0F1F 65%)",
    panel: "#131A33",
    panelAlt: "#0F1529",
    border: "#262F52",
    text: "#EAEDFB",
    muted: "#8A93BE",
    accent: "#7DD3FC",
    accent2: "#FBBF24",
    good: "#34D399",
    bad: "#FB7185",
    dot: "rgba(255,255,255,0.05)",
  },
  light: {
    name: "light",
    bg: "#F3F5FC",
    bgGrad: "radial-gradient(ellipse 900px 500px at 50% -10%, #FFFFFF 0%, #EBEEF9 65%)",
    panel: "#FFFFFF",
    panelAlt: "#F7F8FD",
    border: "#DEE3F3",
    text: "#171C36",
    muted: "#6A7295",
    accent: "#0EA5E9",
    accent2: "#D97706",
    good: "#059669",
    bad: "#E11D48",
    dot: "rgba(20,25,60,0.06)",
  },
};

/* ---------------------------------------------------------------------- */

export default function Dashboard() {
  const [themeName, setThemeName] = useState("dark");
  const t = THEMES[themeName];

  const [activeEventId, setActiveEventId] = useState(EVENTS[0].id);
  const activeEvent = EVENTS.find((e) => e.id === activeEventId);

  const [selectedDocId, setSelectedDocId] = useState(null);
  const [search, setSearch] = useState("");
  const [dragOffsets, setDragOffsets] = useState({});
  const draggingKey = useRef(null);

  const [askInput, setAskInput] = useState("");
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    setSelectedDocId(null);
  }, [activeEventId]);

  const totalDocs = EVENTS.reduce((s, e) => s + e.docs.length, 0);
  const missingDocs = EVENTS.reduce((s, e) => s + e.docs.filter((d) => d.status === "missing").length, 0);
  const facultySet = new Set(EVENTS.map((e) => e.faculty));

  const verifiedCount = activeEvent.docs.filter((d) => d.status === "verified").length;
  const completion = Math.round((verifiedCount / activeEvent.docs.length) * 100);
  const selectedDoc = activeEvent.docs.find((d) => d.id === selectedDocId) || null;

  /* ---- graph geometry ---- */
  const W = 700;
  const H = 460;
  const center = { x: W / 2, y: H / 2 + 6 };
  const radius = 175;

  function basePos(i, total) {
    const angle = -Math.PI / 2 + (i / total) * Math.PI * 2;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  }

  function nodePos(doc, i) {
    const key = `${activeEvent.id}:${doc.id}`;
    const off = dragOffsets[key] || { dx: 0, dy: 0 };
    const base = basePos(i, activeEvent.docs.length);
    return { x: base.x + off.dx, y: base.y + off.dy, key };
  }

  function onPointerDown(e, key) {
    e.stopPropagation();
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}
    draggingKey.current = key;
  }
  function onPointerMove(e) {
    const key = draggingKey.current;
    if (!key) return;
    setDragOffsets((prev) => {
      const cur = prev[key] || { dx: 0, dy: 0 };
      return { ...prev, [key]: { dx: cur.dx + e.movementX, dy: cur.dy + e.movementY } };
    });
  }
  function onPointerUp() {
    draggingKey.current = null;
  }

  function ask(promptObj) {
    setAnswer(null);
    setTimeout(() => setAnswer(promptObj), 260);
  }
  function askCustom() {
    if (!askInput.trim()) return;
    ask({
      q: askInput.trim(),
      a: "I looked across the graph — try asking about a specific event, a faculty member, or a missing document type.",
    });
    setAskInput("");
  }

  const query = search.trim().toLowerCase();

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: t.bgGrad, backgroundColor: t.bg, color: t.text, fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes dv-draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
        @keyframes dv-pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes dv-pulse { 0%,100% { opacity: 0.35; transform: scale(1); } 50% { opacity: 0.15; transform: scale(1.18); } }
        @keyframes dv-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
        .dv-node { cursor: grab; }
        .dv-node:active { cursor: grabbing; }
      `}</style>

      <div className="flex">
        {/* ---------------- Sidebar ---------------- */}
        <aside
          className="hidden md:flex flex-col items-center py-6 gap-7 shrink-0"
          style={{ width: "72px", borderRight: `1px solid ${t.border}` }}
        >
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 38, height: 38, background: t.accent, fontFamily: "Space Grotesk", fontWeight: 700, color: t.bg, fontSize: 15 }}
          >
            DV
          </div>
          <Link to="/faculty/timetable">
  <SideIcon
    icon={Calendar}
    t={t}
    label="Timetable"
  />
</Link>

<Link to="/dean-approval">
  <SideIcon
    icon={ClipboardCheck}
    t={t}
    label="Dean Approval"
  />
</Link>

<Link to="/analytics">
  <SideIcon
    icon={BarChart3}
    t={t}
    label="Analytics"
  />
</Link>

<SideIcon
  icon={AlertTriangle}
  t={t}
  label="Alerts"
  badge={missingDocs}
/>

<SideIcon
  icon={FileText}
  t={t}
  label="Documents"
/>
        </aside>

        {/* ---------------- Main ---------------- */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <header className="flex flex-wrap items-center gap-4 px-5 md:px-7 py-5" style={{ borderBottom: `1px solid ${t.border}` }}>
            <div>
              <div className="flex items-center gap-2">
                <h1 style={{ fontFamily: "Space Grotesk", fontSize: 22, fontWeight: 700, letterSpacing: "-0.01em" }}>DocVerse</h1>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ border: `1px solid ${t.border}`, color: t.accent2, fontFamily: "JetBrains Mono, monospace" }}
                >
                  FreeDox build
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: t.muted }}>
                Navigate knowledge, not folders.
              </p>
            </div>

            <div className="relative flex-1 min-w-[180px] max-w-md">
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: t.muted }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search documents, events, faculty…"
                className="w-full text-sm outline-none rounded-full py-2.5"
                style={{ paddingLeft: 36, paddingRight: 14, background: t.panelAlt, border: `1px solid ${t.border}`, color: t.text }}
              />
            </div>

            <button
              onClick={() => setThemeName(themeName === "dark" ? "light" : "dark")}
              className="flex items-center justify-center rounded-full shrink-0"
              style={{ width: 38, height: 38, border: `1px solid ${t.border}`, background: t.panelAlt }}
              aria-label="Toggle theme"
            >
              {themeName === "dark" ? <Sun size={16} color={t.accent2} /> : <Moon size={16} color={t.accent} />}
            </button>

            <div
              className="rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ width: 38, height: 38, background: t.panelAlt, border: `1px solid ${t.border}`, color: t.muted }}
            >
              SA
            </div>
          </header>

          {/* Missing docs banner */}
          {missingDocs > 0 && (
            <div
              className="mx-5 md:mx-7 mt-4 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm"
              style={{ background: `${t.bad}14`, border: `1px solid ${t.bad}40`, color: t.text }}
            >
              <span
                className="rounded-full"
                style={{ width: 7, height: 7, background: t.bad, animation: "dv-blink 1.6s ease-in-out infinite" }}
              />
              <span>
                <b style={{ color: t.bad }}>{missingDocs} documents</b> are missing across {EVENTS.length} events — highlighted in red on the graph below.
              </span>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-5 md:px-7 mt-5">
            <StatCard t={t} label="Events tracked" value={EVENTS.length} icon={Network} />
            <StatCard t={t} label="Connected documents" value={totalDocs} icon={FileText} />
            <StatCard t={t} label="Missing documents" value={missingDocs} icon={AlertTriangle} accent={t.bad} />
            <StatCard t={t} label="Faculty in graph" value={facultySet.size} icon={Users} />
          </div>

          {/* Event tabs */}
          <div className="flex gap-2 px-5 md:px-7 mt-6 overflow-x-auto pb-1">
            {EVENTS.map((ev) => {
              const isActive = ev.id === activeEventId;
              const evMissing = ev.docs.filter((d) => d.status === "missing").length;
              return (
                <button
                  key={ev.id}
                  onClick={() => setActiveEventId(ev.id)}
                  className="shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors"
                  style={{
                    background: isActive ? t.accent : t.panelAlt,
                    color: isActive ? t.bg : t.text,
                    border: `1px solid ${isActive ? t.accent : t.border}`,
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {ev.name}
                  {evMissing > 0 && (
                    <span
                      className="rounded-full text-[10px] flex items-center justify-center"
                      style={{
                        width: 16,
                        height: 16,
                        background: isActive ? t.bg : t.bad,
                        color: isActive ? t.bad : "#fff",
                      }}
                    >
                      {evMissing}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Graph + side panels */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 px-5 md:px-7 py-5 flex-1">
            {/* Graph canvas */}
            <div
              className="relative rounded-2xl overflow-auto"
              style={{ background: t.panelAlt, border: `1px solid ${t.border}`, minHeight: 480 }}
            >
              <svg
                key={activeEvent.id}
                width={W}
                height={H}
                viewBox={`0 0 ${W} ${H}`}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
                style={{
                  backgroundImage: `radial-gradient(${t.dot} 1px, transparent 1px)`,
                  backgroundSize: "22px 22px",
                }}
              >
                {/* edges */}
                {activeEvent.docs.map((doc, i) => {
                  const pos = nodePos(doc, i);
                  const bad = doc.status === "missing";
                  const dim = query && !doc.type.toLowerCase().includes(query);
                  return (
                    <line
                      key={"line-" + doc.id}
                      x1={center.x}
                      y1={center.y}
                      x2={pos.x}
                      y2={pos.y}
                      pathLength="1"
                      stroke={bad ? t.bad : t.accent}
                      strokeWidth={selectedDocId === doc.id ? 2.4 : 1.4}
                      strokeDasharray={bad ? "5 4" : "1"}
                      opacity={dim ? 0.15 : bad ? 0.55 : 0.4}
                      style={
                        bad
                          ? {}
                          : { strokeDasharray: 1, strokeDashoffset: 1, animation: `dv-draw 0.8s ease ${i * 0.08}s both` }
                      }
                    />
                  );
                })}

                {/* center node */}
                <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "dv-pop 0.5s ease both" }}>
                  <circle cx={center.x} cy={center.y} r={40} fill="none" stroke={t.accent} strokeWidth={1.5} opacity={0.4}>
                    <animate attributeName="r" values="40;50;40" dur="2.6s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.6s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={center.x} cy={center.y} r={34} fill={t.panel} stroke={t.accent} strokeWidth={2} />
                  <foreignObject x={center.x - 16} y={center.y - 16} width={32} height={32}>
                    <div className="w-full h-full flex items-center justify-center">
                      <Network size={18} color={t.accent} />
                    </div>
                  </foreignObject>
                  <text
                    x={center.x}
                    y={center.y + 56}
                    textAnchor="middle"
                    fill={t.text}
                    style={{ fontFamily: "Space Grotesk", fontSize: 13, fontWeight: 700 }}
                  >
                    {activeEvent.name}
                  </text>
                  <text x={center.x} y={center.y + 72} textAnchor="middle" fill={t.muted} style={{ fontSize: 10 }}>
                    {activeEvent.date} · {activeEvent.dept}
                  </text>
                </g>

                {/* satellite nodes */}
                {activeEvent.docs.map((doc, i) => {
                  const pos = nodePos(doc, i);
                  const Icon = DOC_ICONS[doc.type] || FileText;
                  const bad = doc.status === "missing";
                  const isSelected = selectedDocId === doc.id;
                  const dim = query && !doc.type.toLowerCase().includes(query);
                  return (
                    <g
                      key={pos.key}
                      className="dv-node"
                      onPointerDown={(e) => onPointerDown(e, pos.key)}
                      onClick={() => setSelectedDocId(doc.id)}
                      opacity={dim ? 0.25 : 1}
                      style={{ transformBox: "fill-box", transformOrigin: "center", animation: `dv-pop 0.45s ease ${i * 0.07 + 0.15}s both` }}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={26}
                        fill={t.panel}
                        stroke={bad ? t.bad : isSelected ? t.accent : t.border}
                        strokeWidth={isSelected ? 2.5 : bad ? 2 : 1.5}
                        strokeDasharray={bad ? "4 3" : "0"}
                      />
                      <foreignObject x={pos.x - 12} y={pos.y - 12} width={24} height={24}>
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon size={14} color={bad ? t.bad : t.text} />
                        </div>
                      </foreignObject>
                      {bad && (
                        <circle cx={pos.x + 18} cy={pos.y - 18} r={7} fill={t.bad}>
                          <animate attributeName="opacity" values="1;0.4;1" dur="1.6s" repeatCount="indefinite" />
                        </circle>
                      )}
                      <text
                        x={pos.x}
                        y={pos.y + 40}
                        textAnchor="middle"
                        fill={dim ? t.muted : t.text}
                        style={{ fontSize: 10.5, fontWeight: 500 }}
                      >
                        {doc.type}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* legend */}
              <div
                className="absolute bottom-3 left-3 flex items-center gap-4 text-[11px] rounded-full px-3 py-1.5"
                style={{ background: t.panel, border: `1px solid ${t.border}`, color: t.muted }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="rounded-full" style={{ width: 8, height: 8, background: t.accent }} /> verified link
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="rounded-full" style={{ width: 8, height: 8, background: t.bad }} /> missing document
                </span>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4 min-w-0">
              {/* Detail panel */}
              <div className="rounded-2xl p-4" style={{ background: t.panel, border: `1px solid ${t.border}` }}>
                {selectedDoc ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide" style={{ color: t.muted }}>
                        Document
                      </span>
                      <button onClick={() => setSelectedDocId(null)} className="text-xs" style={{ color: t.muted }}>
                        close
                      </button>
                    </div>
                    <h3 style={{ fontFamily: "Space Grotesk", fontSize: 18, fontWeight: 700 }} className="mt-1">
                      {selectedDoc.type}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2 text-xs" style={{ color: selectedDoc.status === "verified" ? t.good : t.bad }}>
                      {selectedDoc.status === "verified" ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                      {selectedDoc.status === "verified" ? "Verified" : "Missing"}
                    </div>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <Row t={t} k="Event" v={activeEvent.name} />
                      <Row t={t} k="Uploaded by" v={selectedDoc.uploadedBy} />
                      <Row t={t} k="Date" v={selectedDoc.date} />
                      <Row t={t} k="Doc ID" v={`${activeEvent.id}-${selectedDoc.id}`} mono />
                    </dl>
                    <div className="flex gap-2 mt-4">
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg py-2"
                        style={{ background: t.accent, color: t.bg, fontWeight: 600, opacity: selectedDoc.status === "missing" ? 0.4 : 1 }}
                        disabled={selectedDoc.status === "missing"}
                      >
                        <Eye size={13} /> Preview
                      </button>
                      <button
                        className="flex-1 flex items-center justify-center gap-1.5 text-xs rounded-lg py-2"
                        style={{ border: `1px solid ${t.border}`, opacity: selectedDoc.status === "missing" ? 0.4 : 1 }}
                        disabled={selectedDoc.status === "missing"}
                      >
                        <Download size={13} /> Download
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-xs uppercase tracking-wide" style={{ color: t.muted }}>
                      Event overview
                    </span>
                    <h3 style={{ fontFamily: "Space Grotesk", fontSize: 18, fontWeight: 700 }} className="mt-1">
                      {activeEvent.name}
                    </h3>
                    <dl className="mt-3 space-y-1.5 text-sm">
                      <Row t={t} k="Faculty" v={activeEvent.faculty} />
                      <Row t={t} k="Department" v={activeEvent.dept} />
                      <Row t={t} k="Date" v={activeEvent.date} />
                    </dl>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: t.muted }}>
                        <span>Documentation complete</span>
                        <span style={{ color: completion === 100 ? t.good : t.accent2, fontWeight: 600 }}>{completion}%</span>
                      </div>
                      <div className="rounded-full h-1.5 w-full overflow-hidden" style={{ background: t.border }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${completion}%`, background: completion === 100 ? t.good : t.accent2, transition: "width 0.6s ease" }}
                        />
                      </div>
                    </div>
                    <p className="text-xs mt-3" style={{ color: t.muted }}>
                      Click any node in the graph to open its record — no folders to dig through.
                    </p>
                  </>
                )}
              </div>

              {/* Ask DocVerse */}
              <div className="rounded-2xl p-4 flex-1 flex flex-col" style={{ background: t.panel, border: `1px solid ${t.border}` }}>
                <div className="flex items-center gap-2">
                  <Sparkles size={15} color={t.accent2} />
                  <h3 style={{ fontFamily: "Space Grotesk", fontSize: 15, fontWeight: 700 }}>Ask DocVerse</h3>
                </div>

                <div className="flex flex-col gap-1.5 mt-3">
                  {ASK_PROMPTS.map((p) => (
                    <button
                      key={p.q}
                      onClick={() => ask(p)}
                      className="text-left text-xs rounded-lg px-3 py-2"
                      style={{ background: t.panelAlt, border: `1px solid ${t.border}`, color: t.text }}
                    >
                      {p.q}
                    </button>
                  ))}
                </div>

                {answer && (
                  <div
                    className="mt-3 text-sm rounded-lg px-3 py-2.5"
                    style={{ background: `${t.accent}14`, border: `1px solid ${t.accent}35`, animation: "dv-pop 0.3s ease both" }}
                  >
                    {answer.a}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-auto pt-3">
                  <input
                    value={askInput}
                    onChange={(e) => setAskInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && askCustom()}
                    placeholder="Ask a question…"
                    className="flex-1 text-xs rounded-lg px-3 py-2 outline-none"
                    style={{ background: t.panelAlt, border: `1px solid ${t.border}`, color: t.text }}
                  />
                  <button
                    onClick={askCustom}
                    className="text-xs rounded-lg px-3 py-2"
                    style={{ background: t.accent, color: t.bg, fontWeight: 600 }}
                  >
                    Ask
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Small building blocks                                                  */
/* ---------------------------------------------------------------------- */

function SideIcon({ icon: Icon, active, t, label, badge }) {
  return (
    <div className="relative flex flex-col items-center gap-1" title={label}>
      <div
        className="flex items-center justify-center rounded-xl"
        style={{ width: 40, height: 40, background: active ? `${t.accent}20` : "transparent" }}
      >
        <Icon size={17} color={active ? t.accent : t.muted} />
      </div>
      {badge > 0 && (
        <span
          className="absolute -top-0.5 right-0 rounded-full text-[9px] flex items-center justify-center"
          style={{ width: 14, height: 14, background: t.bad, color: "#fff" }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function StatCard({ t, label, value, icon: Icon, accent }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: t.panel, border: `1px solid ${t.border}` }}>
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: t.muted }}>
          {label}
        </span>
        <Icon size={14} color={accent || t.muted} />
      </div>
      <div className="mt-2" style={{ fontFamily: "Space Grotesk", fontSize: 26, fontWeight: 700, color: accent || t.text }}>
        {value}
      </div>
    </div>
  );
}

function Row({ t, k, v, mono }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt style={{ color: t.muted }}>{k}</dt>
      <dd style={{ fontFamily: mono ? "JetBrains Mono, monospace" : undefined, fontSize: mono ? 11 : 13 }}>{v}</dd>
    </div>
  );
}