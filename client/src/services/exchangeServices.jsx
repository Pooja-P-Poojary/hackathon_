const API_BASE = "http://localhost:5000/api";

export async function getPendingApprovals() {
  const res = await fetch(
    `${API_BASE}/exchanges/pending-approval`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch pending approvals");
  }

  return res.json();
}

export async function approveExchange(id, comment) {
  const res = await fetch(`${API_BASE}/exchanges/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "approve",
      comment,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to approve exchange");
  }

  return res.json();
}

export async function rejectExchange(id, comment) {
  const res = await fetch(`${API_BASE}/exchanges/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "reject",
      comment,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to reject exchange");
  }

  return res.json();
}

export async function getTimetableSlots() {
  const res = await fetch(`${API_BASE}/timetable-slots`);

  if (!res.ok) {
    throw new Error("Failed to fetch timetable slots");
  }

  return res.json();
}

export async function getAvailableSubstitutes(slotId) {
  const res = await fetch(
    `${API_BASE}/timetable-slots/${slotId}/available-faculty`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch available faculty");
  }

  return res.json();
}

export async function createExchangeRequest(payload) {
  const res = await fetch(`${API_BASE}/exchanges`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to create exchange request");
  }

  return res.json();
}