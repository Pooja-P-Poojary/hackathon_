import { useState } from "react";
import "./code.css";

const workload = [
  { name: "Prof. A", dept: "Computer Networks", hrs: 16, max: 20, given: 2, received: 1, net: -1 },
  { name: "Prof. B", dept: "Database Systems", hrs: 18, max: 20, given: 1, received: 3, net: 2 },
  { name: "Prof. C", dept: "Operating Systems", hrs: 14, max: 20, given: 0, received: 1, net: 1 },
  { name: "Prof. D", dept: "Java Programming", hrs: 19, max: 20, given: 3, received: 0, net: -3 },
  { name: "Prof. E", dept: "Artificial Intelligence", hrs: 12, max: 20, given: 1, received: 1, net: 0 },
];

const cancellations = [
  { name: "Prof. A", count: 1 },
  { name: "Prof. D", count: 2 },
  { name: "Prof. C", count: 0 },
];

const requests = [
  {
    id: "#1024",
    course: "Computer Networks",
    when: "Tuesday · 10:00–11:00 AM · Lab 2",
    status: "cancelled",
    original: "Prof. A",
    substitute: "Prof. B",
    reason: "Medical leave — requires 2 days off for a scheduled procedure.",
    flow: [
      { who: "Prof. A", what: "Request initiated" },
      { who: "Prof. B", what: "Peer accepted" },
      { who: "HOD", what: "Approved" },
      { who: "Prof. A", what: "Cancelled after approval" },
    ],
    audit: [
      { actor: "Prof. A", action: "Initiated substitution request", ts: "10:02 AM", type: "" },
      { actor: "Prof. B", action: "Accepted request", ts: "10:07 AM", type: "approve" },
      {
        actor: "HOD",
        action: "Approved substitution",
        ts: "10:15 AM",
        type: "approve",
        comment: "Conflict check clear, workload within limit.",
      },
      {
        actor: "Prof. A",
        action: "Cancelled substitution",
        ts: "9:30 AM (next day)",
        type: "cancel",
        comment: "Duty postponed — original class resumed.",
      },
    ],
  },
  {
    id: "#1031",
    course: "Database Systems",
    when: "Thursday · 2:00–3:00 PM · Room 4B",
    status: "pending",
    original: "Prof. C",
    substitute: "Prof. E",
    reason: "Attending departmental workshop off-campus.",
    flow: [
      { who: "Prof. C", what: "Request initiated" },
      { who: "Prof. E", what: "Awaiting response" },
    ],
    audit: [
      { actor: "Prof. C", action: "Initiated substitution request", ts: "9:14 AM", type: "" },
      { actor: "Prof. E", action: "Request pending peer response", ts: "—", type: "" },
    ],
  },
  {
    id: "#1037",
    course: "Operating Systems",
    when: "Friday · 11:00 AM–12:00 PM · Lab 1",
    status: "declined",
    original: "Prof. D",
    substitute: "Prof. C",
    reason: "Personal emergency.",
    flow: [
      { who: "Prof. D", what: "Request initiated" },
      { who: "Prof. C", what: "Declined — schedule conflict" },
    ],
    audit: [
      { actor: "Prof. D", action: "Initiated substitution request", ts: "8:40 AM", type: "" },
      {
        actor: "Prof. C",
        action: "Declined request",
        ts: "8:52 AM",
        type: "decline",
        comment: "Already covering another slot at this time.",
      },
    ],
  },
];

const STAMP_LABELS = {
  approved: "Approved",
  declined: "Declined",
  cancelled: "Cancelled",
  withdrawn: "Withdrawn",
  pending: "Pending",
};

function Analytics() {
  const [activeView, setActiveView] = useState("analytics");
  const [selectedRequest, setSelectedRequest] = useState(0);

  const request = requests[selectedRequest];
  const stampClass = STAMP_LABELS[request.status] ? request.status : "pending";
  const stampText = STAMP_LABELS[request.status] || "Pending";

  return (
    <>
      <header className="masthead">
        <div className="brand">
          <div className="crest">CF</div>
          <div>
            <h1>ClassFlow</h1>
            <div className="sub">Faculty Substitution Registry</div>
          </div>
        </div>

        <div className="meta">
          Academic Term · Odd Sem 2026
          <br />
          Department of Computer Science
        </div>
      </header>

      <nav className="index-nav">
        <button
          className={`tab-btn ${activeView === "analytics" ? "active" : ""}`}
          onClick={() => setActiveView("analytics")}
        >
          <span className="num">07</span>
          Workload &amp; Analytics
        </button>

        <button
          className={`tab-btn ${activeView === "audit" ? "active" : ""}`}
          onClick={() => setActiveView("audit")}
        >
          <span className="num">08</span>
          Request Details &amp; Audit
        </button>
      </nav>

      <main>
        {activeView === "analytics" && (
          <section className="view active">
            <div className="view-title">
              <h2>Workload &amp; Substitution Audit Report</h2>
              <span className="caption">Odd Sem 2026 · updated today</span>
            </div>

            <div className="stat-strip">
              <div className="stat-cell">
                <div className="label">Total Requests</div>
                <div className="value">18</div>
              </div>
              <div className="stat-cell approved">
                <div className="label">Approved</div>
                <div className="value">12</div>
              </div>
              <div className="stat-cell declined">
                <div className="label">Declined</div>
                <div className="value">3</div>
              </div>
              <div className="stat-cell withdrawn">
                <div className="label">Withdrawn</div>
                <div className="value">1</div>
              </div>
              <div className="stat-cell">
                <div className="label">Cancelled</div>
                <div className="value">2</div>
              </div>
            </div>

            <div className="section-label">Faculty Workload Ledger</div>

            <div className="card workload-table">
              <div className="wl-row head">
                <div>Faculty</div>
                <div>Teaching Load</div>
                <div>Substitution Exchange</div>
                <div>Net</div>
              </div>

              {workload.map((faculty) => {
                const pct = Math.round((faculty.hrs / faculty.max) * 100);
                const netClass =
                  faculty.net < 0 ? "neg" : faculty.net > 0 ? "pos" : "";

                return (
                  <div className="wl-row" key={faculty.name}>
                    <div className="wl-name">
                      {faculty.name}
                      <span className="dept">{faculty.dept}</span>
                    </div>

                    <div className="wl-bar-wrap">
                      <div className="wl-bar-track">
                        <div
                          className="wl-bar-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="wl-hrs">{faculty.hrs} hrs</div>
                    </div>

                    <div className="wl-exchange">
                      <span className="given">
                        Given&nbsp; {faculty.given} substitution
                        {faculty.given === 1 ? "" : "s"}
                      </span>
                      <span className="received">
                        Received {faculty.received} substitution
                        {faculty.received === 1 ? "" : "s"}
                      </span>
                    </div>

                    <div className={`wl-net ${netClass}`}>
                      {faculty.net > 0 ? "+" : ""}
                      {faculty.net} hr
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="section-label">Cancellation Frequency</div>

            <div className="card">
              <div className="cancel-freq">
                {cancellations.map((item) => (
                  <div className="freq-chip" key={item.name}>
                    {item.name} <b>{item.count}</b> cancellation
                    {item.count === 1 ? "" : "s"}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeView === "audit" && (
          <section className="view active">
            <div className="view-title">
              <h2>Request Details &amp; Audit Trail</h2>
              <span className="caption">
                every stage records actor · timestamp · comment
              </span>
            </div>

            <div className="req-switcher">
              {requests.map((item, index) => (
                <button
                  key={item.id}
                  className={selectedRequest === index ? "active" : ""}
                  onClick={() => setSelectedRequest(index)}
                >
                  {item.id} · {item.course}
                </button>
              ))}
            </div>

            <div className="req-layout">
              <div className="card req-card">
                <div className="req-id">{request.id}</div>
                <div className="req-course">{request.course}</div>
                <div className="req-when">{request.when}</div>

                <div className={`stamp ${stampClass}`}>{stampText}</div>

                <div className="req-flow">
                  {request.flow.map((flowItem, index) => (
                    <div className="flow-node" key={`${flowItem.who}-${index}`}>
                      <div className="rail">
                        <div className="dot" />
                        <div className="line" />
                      </div>
                      <div className="body">
                        <div className="who">{flowItem.who}</div>
                        <div className="what">{flowItem.what}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="reason-block">
                  <div className="k">Reason</div>
                  <div className="v">{request.reason}</div>
                </div>
              </div>

              <div className="card audit-card">
                <h3>Audit Timeline</h3>
                <div className="desc">
                  Chronological record — cannot be edited or deleted
                </div>

                <div>
                  {request.audit.map((audit, index) => (
                    <div
                      className={`audit-item ${audit.type || ""}`}
                      key={`${audit.actor}-${index}`}
                    >
                      <div className="top-row">
                        <span className="actor">{audit.actor}</span>
                        <span className="ts">{audit.ts}</span>
                      </div>

                      <div className="action">{audit.action}</div>

                      {audit.comment && (
                        <div className="comment">{audit.comment}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer>CLASSFLOW · SUBSTITUTION MANAGEMENT SYSTEM · V18</footer>
    </>
  );
}

export default Analytics;