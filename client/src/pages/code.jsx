<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ClassFlow — Workload &amp; Audit</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#1E2A3A;
    --ink-soft:#3A4C63;
    --paper:#FAF9F6;
    --paper-line:#E4E0D6;
    --brass:#B8862E;
    --sage:#4C6B4F;
    --rust:#9C4A3C;
    --charcoal:#2B2B28;
    --charcoal-soft:#6B6A63;
    --card:#FFFFFF;
    --serif: 'Source Serif 4', serif;
    --mono: 'IBM Plex Mono', monospace;
    --sans: 'IBM Plex Sans', sans-serif;
  }
  *{box-sizing:border-box;}
  body{
    margin:0;
    background:var(--paper);
    background-image:
      linear-gradient(var(--paper-line) 1px, transparent 1px);
    background-size: 100% 44px;
    color:var(--charcoal);
    font-family:var(--sans);
    -webkit-font-smoothing:antialiased;
  }
  a{color:inherit;}

  /* ===== Header / Masthead ===== */
  .masthead{
    border-bottom:3px double var(--ink);
    padding:28px 32px 18px;
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    flex-wrap:wrap;
    gap:16px;
    background:var(--paper);
  }
  .masthead .brand{
    display:flex;
    align-items:center;
    gap:14px;
  }
  .crest{
    width:44px;height:44px;
    border:2px solid var(--ink);
    border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-family:var(--serif);
    font-weight:700;
    font-size:18px;
    color:var(--ink);
    flex-shrink:0;
  }
  .brand h1{
    font-family:var(--serif);
    font-size:26px;
    font-weight:700;
    margin:0;
    letter-spacing:0.2px;
    color:var(--ink);
  }
  .brand .sub{
    font-family:var(--mono);
    font-size:11px;
    letter-spacing:1.5px;
    text-transform:uppercase;
    color:var(--charcoal-soft);
    margin-top:2px;
  }
  .masthead .meta{
    font-family:var(--mono);
    font-size:12px;
    color:var(--charcoal-soft);
    text-align:right;
    line-height:1.6;
  }

  /* ===== Tabs (ledger index) ===== */
  .index-nav{
    display:flex;
    gap:0;
    border-bottom:1px solid var(--paper-line);
    padding:0 32px;
    background:var(--paper);
    position:sticky;
    top:0;
    z-index:5;
  }
  .index-nav button{
    font-family:var(--mono);
    font-size:13px;
    letter-spacing:0.5px;
    text-transform:uppercase;
    background:none;
    border:none;
    padding:16px 22px;
    cursor:pointer;
    color:var(--charcoal-soft);
    border-bottom:2px solid transparent;
    transition:color .15s ease, border-color .15s ease;
  }
  .index-nav button .num{
    color:var(--brass);
    margin-right:8px;
  }
  .index-nav button:hover{ color:var(--ink); }
  .index-nav button.active{
    color:var(--ink);
    border-bottom-color:var(--brass);
    font-weight:600;
  }

  main{ padding:32px; max-width:1180px; margin:0 auto; }
  section.view{ display:none; }
  section.view.active{ display:block; animation:fadeIn .25s ease; }
  @keyframes fadeIn{ from{opacity:0; transform:translateY(4px);} to{opacity:1; transform:translateY(0);} }

  .view-title{
    display:flex;
    align-items:baseline;
    justify-content:space-between;
    flex-wrap:wrap;
    gap:10px;
    margin-bottom:24px;
  }
  .view-title h2{
    font-family:var(--serif);
    font-size:22px;
    margin:0;
    color:var(--ink);
  }
  .view-title .caption{
    font-family:var(--mono);
    font-size:11.5px;
    color:var(--charcoal-soft);
  }

  /* ===== Card shell ===== */
  .card{
    background:var(--card);
    border:1px solid var(--paper-line);
    border-radius:2px;
    box-shadow:0 1px 0 rgba(30,42,58,0.03);
  }

  /* ===== ANALYTICS VIEW ===== */
  .stat-strip{
    display:grid;
    grid-template-columns:repeat(5, 1fr);
    gap:1px;
    background:var(--paper-line);
    border:1px solid var(--paper-line);
    margin-bottom:28px;
  }
  .stat-cell{
    background:var(--card);
    padding:18px 20px;
  }
  .stat-cell .label{
    font-family:var(--mono);
    font-size:10.5px;
    letter-spacing:1px;
    text-transform:uppercase;
    color:var(--charcoal-soft);
    margin-bottom:8px;
  }
  .stat-cell .value{
    font-family:var(--serif);
    font-size:30px;
    font-weight:600;
    color:var(--ink);
    line-height:1;
  }
  .stat-cell.approved .value{ color:var(--sage); }
  .stat-cell.declined .value{ color:var(--rust); }
  .stat-cell.withdrawn .value{ color:var(--brass); }

  .section-label{
    font-family:var(--mono);
    font-size:11px;
    letter-spacing:1.5px;
    text-transform:uppercase;
    color:var(--ink-soft);
    display:flex;
    align-items:center;
    gap:10px;
    margin:34px 0 14px;
  }
  .section-label::after{
    content:"";
    flex:1;
    height:1px;
    background:var(--paper-line);
  }

  .workload-table{ padding:6px 0; }
  .wl-row{
    display:grid;
    grid-template-columns: 160px 1fr 190px 90px;
    align-items:center;
    gap:18px;
    padding:14px 20px;
    border-bottom:1px solid var(--paper-line);
  }
  .wl-row:last-child{ border-bottom:none; }
  .wl-row.head{
    font-family:var(--mono);
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:1px;
    color:var(--charcoal-soft);
    padding:10px 20px;
  }
  .wl-name{
    font-family:var(--serif);
    font-weight:600;
    font-size:15px;
    color:var(--ink);
  }
  .wl-name .dept{
    display:block;
    font-family:var(--sans);
    font-weight:400;
    font-size:11.5px;
    color:var(--charcoal-soft);
    margin-top:2px;
  }
  .wl-bar-wrap{
    display:flex;
    align-items:center;
    gap:10px;
  }
  .wl-bar-track{
    flex:1;
    height:8px;
    background:var(--paper-line);
    border-radius:1px;
    overflow:hidden;
    position:relative;
  }
  .wl-bar-fill{
    height:100%;
    background:var(--ink-soft);
    border-radius:1px;
  }
  .wl-hrs{
    font-family:var(--mono);
    font-size:12px;
    color:var(--charcoal-soft);
    width:54px;
    text-align:right;
  }
  .wl-exchange{
    font-family:var(--mono);
    font-size:12.5px;
    display:flex;
    flex-direction:column;
    gap:2px;
  }
  .wl-exchange .given{ color:var(--sage); }
  .wl-exchange .received{ color:var(--brass); }
  .wl-net{
    font-family:var(--mono);
    font-size:14px;
    font-weight:600;
    text-align:right;
  }
  .wl-net.neg{ color:var(--rust); }
  .wl-net.pos{ color:var(--sage); }

  .cancel-freq{
    display:flex;
    gap:14px;
    padding:20px;
    flex-wrap:wrap;
  }
  .freq-chip{
    font-family:var(--mono);
    font-size:12px;
    color:var(--ink-soft);
    border:1px solid var(--paper-line);
    padding:8px 14px;
    display:flex;
    align-items:center;
    gap:8px;
  }
  .freq-chip b{ color:var(--rust); font-size:14px; }

  /* ===== REQUEST DETAILS + AUDIT VIEW ===== */
  .req-layout{
    display:grid;
    grid-template-columns: 1.1fr 1.4fr;
    gap:24px;
    align-items:start;
  }
  @media (max-width: 880px){ .req-layout{ grid-template-columns:1fr; } }

  .req-card{ padding:22px 24px; }
  .req-id{
    font-family:var(--mono);
    font-size:11px;
    color:var(--charcoal-soft);
    letter-spacing:1px;
  }
  .req-course{
    font-family:var(--serif);
    font-size:21px;
    font-weight:700;
    color:var(--ink);
    margin:6px 0 2px;
  }
  .req-when{
    font-family:var(--mono);
    font-size:12.5px;
    color:var(--charcoal-soft);
  }

  .stamp{
    display:inline-block;
    font-family:var(--mono);
    font-weight:600;
    font-size:12px;
    letter-spacing:2px;
    text-transform:uppercase;
    padding:6px 14px;
    border:2px solid currentColor;
    border-radius:3px;
    transform:rotate(-3deg);
    margin-top:14px;
  }
  .stamp.approved{ color:var(--sage); }
  .stamp.pending{ color:var(--brass); }
  .stamp.declined{ color:var(--rust); }
  .stamp.cancelled{ color:var(--rust); }
  .stamp.withdrawn{ color:var(--brass); }

  .req-flow{
    margin-top:22px;
    display:flex;
    flex-direction:column;
    gap:0;
  }
  .flow-node{
    display:grid;
    grid-template-columns:22px 1fr;
    gap:14px;
  }
  .flow-node .rail{
    display:flex;
    flex-direction:column;
    align-items:center;
  }
  .flow-node .dot{
    width:9px;height:9px;
    border-radius:50%;
    background:var(--ink-soft);
    margin-top:5px;
    flex-shrink:0;
  }
  .flow-node .line{
    width:1px;
    flex:1;
    background:var(--paper-line);
    min-height:26px;
  }
  .flow-node:last-child .line{ display:none; }
  .flow-node .body{ padding-bottom:18px; }
  .flow-node .who{
    font-family:var(--sans);
    font-weight:600;
    font-size:13.5px;
    color:var(--ink);
  }
  .flow-node .what{
    font-family:var(--mono);
    font-size:11.5px;
    color:var(--charcoal-soft);
    margin-top:1px;
  }

  .reason-block{
    margin-top:20px;
    padding-top:16px;
    border-top:1px solid var(--paper-line);
  }
  .reason-block .k{
    font-family:var(--mono);
    font-size:10.5px;
    text-transform:uppercase;
    letter-spacing:1px;
    color:var(--charcoal-soft);
  }
  .reason-block .v{
    font-family:var(--sans);
    font-size:13.5px;
    margin-top:4px;
    color:var(--charcoal);
  }

  /* Audit timeline (right column) */
  .audit-card{ padding:22px 24px 10px; }
  .audit-card h3{
    font-family:var(--serif);
    font-size:17px;
    margin:0 0 4px;
    color:var(--ink);
  }
  .audit-card .desc{
    font-family:var(--mono);
    font-size:11px;
    color:var(--charcoal-soft);
    margin-bottom:20px;
  }
  .audit-item{
    position:relative;
    padding-left:26px;
    padding-bottom:22px;
    border-left:1px solid var(--paper-line);
    margin-left:6px;
  }
  .audit-item:last-child{ border-left-color:transparent; padding-bottom:4px; }
  .audit-item::before{
    content:"";
    position:absolute;
    left:-6px;
    top:2px;
    width:11px;height:11px;
    border-radius:50%;
    background:var(--paper);
    border:2px solid var(--ink-soft);
  }
  .audit-item.approve::before{ border-color:var(--sage); }
  .audit-item.decline::before{ border-color:var(--rust); }
  .audit-item.cancel::before{ border-color:var(--rust); }
  .audit-item .top-row{
    display:flex;
    justify-content:space-between;
    align-items:baseline;
    gap:10px;
    flex-wrap:wrap;
  }
  .audit-item .actor{
    font-weight:600;
    font-size:13.5px;
    color:var(--ink);
  }
  .audit-item .ts{
    font-family:var(--mono);
    font-size:11px;
    color:var(--charcoal-soft);
    white-space:nowrap;
  }
  .audit-item .action{
    font-family:var(--mono);
    font-size:12px;
    color:var(--ink-soft);
    margin-top:2px;
  }
  .audit-item .comment{
    font-size:12.5px;
    color:var(--charcoal-soft);
    margin-top:5px;
    font-style:italic;
    border-left:2px solid var(--paper-line);
    padding-left:10px;
  }

  .req-switcher{
    display:flex;
    gap:8px;
    margin-bottom:18px;
    flex-wrap:wrap;
  }
  .req-switcher button{
    font-family:var(--mono);
    font-size:11.5px;
    padding:7px 12px;
    background:var(--card);
    border:1px solid var(--paper-line);
    color:var(--charcoal-soft);
    cursor:pointer;
    border-radius:2px;
  }
  .req-switcher button.active{
    border-color:var(--ink);
    color:var(--ink);
    background:#F1EFE9;
    font-weight:600;
  }

  footer{
    text-align:center;
    font-family:var(--mono);
    font-size:10.5px;
    color:var(--charcoal-soft);
    padding:30px 0 40px;
    letter-spacing:0.5px;
  }
</style>
</head>
<body>

<header class="masthead">
  <div class="brand">
    <div class="crest">CF</div>
    <div>
      <h1>ClassFlow</h1>
      <div class="sub">Faculty Substitution Registry</div>
    </div>
  </div>
  <div class="meta">
    Academic Term · Odd Sem 2026<br>
    Department of Computer Science
  </div>
</header>

<nav class="index-nav">
  <button class="tab-btn active" data-view="analytics"><span class="num">07</span>Workload &amp; Analytics</button>
  <button class="tab-btn" data-view="audit"><span class="num">08</span>Request Details &amp; Audit</button>
</nav>

<main>

  <!-- ============ VIEW 1: WORKLOAD & ANALYTICS ============ -->
  <section class="view active" id="view-analytics">
    <div class="view-title">
      <h2>Workload &amp; Substitution Audit Report</h2>
      <span class="caption">Odd Sem 2026 · updated today</span>
    </div>

    <div class="stat-strip">
      <div class="stat-cell"><div class="label">Total Requests</div><div class="value">18</div></div>
      <div class="stat-cell approved"><div class="label">Approved</div><div class="value">12</div></div>
      <div class="stat-cell declined"><div class="label">Declined</div><div class="value">3</div></div>
      <div class="stat-cell withdrawn"><div class="label">Withdrawn</div><div class="value">1</div></div>
      <div class="stat-cell"><div class="label">Cancelled</div><div class="value">2</div></div>
    </div>

    <div class="section-label">Faculty Workload Ledger</div>
    <div class="card workload-table" id="workload-table">
      <div class="wl-row head">
        <div>Faculty</div>
        <div>Teaching Load</div>
        <div>Substitution Exchange</div>
        <div>Net</div>
      </div>
      <!-- rows injected by JS -->
    </div>

    <div class="section-label">Cancellation Frequency</div>
    <div class="card">
      <div class="cancel-freq" id="cancel-freq"></div>
    </div>
  </section>

  <!-- ============ VIEW 2: REQUEST DETAILS + AUDIT ============ -->
  <section class="view" id="view-audit">
    <div class="view-title">
      <h2>Request Details &amp; Audit Trail</h2>
      <span class="caption">every stage records actor · timestamp · comment</span>
    </div>

    <div class="req-switcher" id="req-switcher"></div>

    <div class="req-layout">
      <div class="card req-card" id="req-summary"></div>
      <div class="card audit-card">
        <h3>Audit Timeline</h3>
        <div class="desc">Chronological record — cannot be edited or deleted</div>
        <div id="audit-timeline"></div>
      </div>
    </div>
  </section>

</main>

<footer>CLASSFLOW · SUBSTITUTION MANAGEMENT SYSTEM · V18</footer>

<script>
/* ---------------- Mock data ---------------- */
const workload = [
  { name:"Prof. A", dept:"Computer Networks", hrs:16, max:20, given:2, received:1, net:-1 },
  { name:"Prof. B", dept:"Database Systems",   hrs:18, max:20, given:1, received:3, net:2 },
  { name:"Prof. C", dept:"Operating Systems",  hrs:14, max:20, given:0, received:1, net:1 },
  { name:"Prof. D", dept:"Java Programming",   hrs:19, max:20, given:3, received:0, net:-3 },
  { name:"Prof. E", dept:"Artificial Intelligence", hrs:12, max:20, given:1, received:1, net:0 },
];

const cancellations = [
  { name:"Prof. A", count:1 },
  { name:"Prof. D", count:2 },
  { name:"Prof. C", count:0 },
];

const requests = [
  {
    id:"#1024",
    course:"Computer Networks",
    when:"Tuesday · 10:00–11:00 AM · Lab 2",
    status:"cancelled",
    original:"Prof. A",
    substitute:"Prof. B",
    reason:"Medical leave — requires 2 days off for a scheduled procedure.",
    flow:[
      { who:"Prof. A", what:"Request initiated" },
      { who:"Prof. B", what:"Peer accepted" },
      { who:"HOD", what:"Approved" },
      { who:"Prof. A", what:"Cancelled after approval" },
    ],
    audit:[
      { actor:"Prof. A", action:"Initiated substitution request", ts:"10:02 AM", type:"" },
      { actor:"Prof. B", action:"Accepted request", ts:"10:07 AM", type:"approve" },
      { actor:"HOD", action:"Approved substitution", ts:"10:15 AM", type:"approve", comment:"Conflict check clear, workload within limit." },
      { actor:"Prof. A", action:"Cancelled substitution", ts:"9:30 AM (next day)", type:"cancel", comment:"Duty postponed — original class resumed." },
    ]
  },
  {
    id:"#1031",
    course:"Database Systems",
    when:"Thursday · 2:00–3:00 PM · Room 4B",
    status:"pending",
    original:"Prof. C",
    substitute:"Prof. E",
    reason:"Attending departmental workshop off-campus.",
    flow:[
      { who:"Prof. C", what:"Request initiated" },
      { who:"Prof. E", what:"Awaiting response" },
    ],
    audit:[
      { actor:"Prof. C", action:"Initiated substitution request", ts:"9:14 AM", type:"" },
      { actor:"Prof. E", action:"Request pending peer response", ts:"—", type:"" },
    ]
  },
  {
    id:"#1037",
    course:"Operating Systems",
    when:"Friday · 11:00 AM–12:00 PM · Lab 1",
    status:"declined",
    original:"Prof. D",
    substitute:"Prof. C",
    reason:"Personal emergency.",
    flow:[
      { who:"Prof. D", what:"Request initiated" },
      { who:"Prof. C", what:"Declined — schedule conflict" },
    ],
    audit:[
      { actor:"Prof. D", action:"Initiated substitution request", ts:"8:40 AM", type:"" },
      { actor:"Prof. C", action:"Declined request", ts:"8:52 AM", type:"decline", comment:"Already covering another slot at this time." },
    ]
  },
];

/* ---------------- Render: Workload ---------------- */
const wlTable = document.getElementById("workload-table");
workload.forEach(f=>{
  const pct = Math.round((f.hrs/f.max)*100);
  const row = document.createElement("div");
  row.className = "wl-row";
  row.innerHTML = `
    <div class="wl-name">${f.name}<span class="dept">${f.dept}</span></div>
    <div class="wl-bar-wrap">
      <div class="wl-bar-track"><div class="wl-bar-fill" style="width:${pct}%"></div></div>
      <div class="wl-hrs">${f.hrs} hrs</div>
    </div>
    <div class="wl-exchange">
      <span class="given">Given &nbsp;${f.given} substitution${f.given===1?'':'s'}</span>
      <span class="received">Received ${f.received} substitution${f.received===1?'':'s'}</span>
    </div>
    <div class="wl-net ${f.net<0?'neg':f.net>0?'pos':''}">${f.net>0?'+':''}${f.net} hr</div>
  `;
  wlTable.appendChild(row);
});

const freqWrap = document.getElementById("cancel-freq");
cancellations.forEach(c=>{
  const chip = document.createElement("div");
  chip.className = "freq-chip";
  chip.innerHTML = `${c.name} <b>${c.count}</b> cancellation${c.count===1?'':'s'}`;
  freqWrap.appendChild(chip);
});

/* ---------------- Render: Request Details + Audit ---------------- */
const switcher = document.getElementById("req-switcher");
const reqSummary = document.getElementById("req-summary");
const auditTimeline = document.getElementById("audit-timeline");

const STAMP_LABELS = {
  approved:  "Approved",
  declined:  "Declined",
  cancelled: "Cancelled",
  withdrawn: "Withdrawn",
  pending:   "Pending",
};

function renderRequest(idx){
  const r = requests[idx];

  [...switcher.children].forEach((b,i)=>b.classList.toggle("active", i===idx));

  const stampClass = STAMP_LABELS[r.status] ? r.status : "pending";
  const stampText = STAMP_LABELS[r.status] || "Pending";

  reqSummary.innerHTML = `
    <div class="req-id">${r.id}</div>
    <div class="req-course">${r.course}</div>
    <div class="req-when">${r.when}</div>
    <div class="stamp ${stampClass}">${stampText}</div>

    <div class="req-flow">
      ${r.flow.map(f=>`
        <div class="flow-node">
          <div class="rail"><div class="dot"></div><div class="line"></div></div>
          <div class="body">
            <div class="who">${f.who}</div>
            <div class="what">${f.what}</div>
          </div>
        </div>
      `).join("")}
    </div>

    <div class="reason-block">
      <div class="k">Reason</div>
      <div class="v">${r.reason}</div>
    </div>
  `;

  auditTimeline.innerHTML = r.audit.map(a=>`
    <div class="audit-item ${a.type}">
      <div class="top-row">
        <span class="actor">${a.actor}</span>
        <span class="ts">${a.ts}</span>
      </div>
      <div class="action">${a.action}</div>
      ${a.comment ? `<div class="comment">${a.comment}</div>` : ""}
    </div>
  `).join("");
}

requests.forEach((r,i)=>{
  const btn = document.createElement("button");
  btn.textContent = `${r.id} · ${r.course}`;
  btn.addEventListener("click", ()=>renderRequest(i));
  switcher.appendChild(btn);
});
renderRequest(0);

/* ---------------- Tab switching ---------------- */
const tabBtns = document.querySelectorAll(".tab-btn");
const views = { analytics: document.getElementById("view-analytics"), audit: document.getElementById("view-audit") };
tabBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    tabBtns.forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    Object.values(views).forEach(v=>v.classList.remove("active"));
    views[btn.dataset.view].classList.add("active");
  });
});
</script>

</body>
</html>