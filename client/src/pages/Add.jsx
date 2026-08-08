import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Button from "../components/Button";
import {
  getTimetableSlots,
  getAvailableSubstitutes,
  createExchangeRequest,
} from "../services/exchangeServices";

export default function Add() {
  const [slots, setSlots] = useState([]);
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [substitutes, setSubstitutes] = useState([]);
  const [selectedSubstituteId, setSelectedSubstituteId] = useState("");
  const [reason, setReason] = useState("");
  const [exchangeType, setExchangeType] = useState("one-way");
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  // Load the current faculty's own timetable slots on mount
  useEffect(() => {
    loadSlots();
  }, []);

  async function loadSlots() {
    setLoadingSlots(true);
    try {
      const data = await getTimetableSlots();
      setSlots(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Could not load your timetable." });
    } finally {
      setLoadingSlots(false);
    }
  }

  // Whenever the chosen slot changes, fetch faculty who are free at that time
  useEffect(() => {
    if (!selectedSlotId) {
      setSubstitutes([]);
      setSelectedSubstituteId("");
      return;
    }
    loadSubstitutes(selectedSlotId);
  }, [selectedSlotId]);

  async function loadSubstitutes(slotId) {
    setLoadingSubs(true);
    setSelectedSubstituteId("");
    try {
      const data = await getAvailableSubstitutes(slotId);
      setSubstitutes(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Could not load available faculty." });
    } finally {
      setLoadingSubs(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedSlotId || !selectedSubstituteId || !reason.trim()) {
      setMessage({ type: "error", text: "Fill in slot, substitute, and reason." });
      return;
    }

    setSubmitting(true);
    setMessage(null);
    try {
      await createExchangeRequest({
        timetableSlotId: selectedSlotId,
        substituteFacultyId: selectedSubstituteId,
        reason: reason.trim(),
        exchangeType,
      });
      setMessage({ type: "success", text: "Request sent to the substitute for acceptance." });
      // reset form
      setSelectedSlotId("");
      setSelectedSubstituteId("");
      setReason("");
      setExchangeType("one-way");
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to submit request. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSlot = slots.find((s) => s._id === selectedSlotId);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Request Substitution" />

        <div className="p-6 max-w-xl">
          <Card>
            {message && (
              <div
                className={`mb-4 p-3 rounded text-sm ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Which class do you need covered?
                </label>
                {loadingSlots ? (
                  <p className="text-sm text-gray-500">Loading your timetable…</p>
                ) : (
                  <select
                    className="w-full rounded bg-gray-800 border border-gray-700 text-gray-200 text-sm p-2"
                    value={selectedSlotId}
                    onChange={(e) => setSelectedSlotId(e.target.value)}
                  >
                    <option value="">Select a slot</option>
                    {slots.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.course?.name} — {s.day} {s.startTime}-{s.endTime}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Substitute faculty
                </label>
                {!selectedSlotId ? (
                  <p className="text-sm text-gray-500">Pick a slot first.</p>
                ) : loadingSubs ? (
                  <p className="text-sm text-gray-500">Checking who's free…</p>
                ) : substitutes.length === 0 ? (
                  <p className="text-sm text-gray-500">No faculty available for this slot.</p>
                ) : (
                  <select
                    className="w-full rounded bg-gray-800 border border-gray-700 text-gray-200 text-sm p-2"
                    value={selectedSubstituteId}
                    onChange={(e) => setSelectedSubstituteId(e.target.value)}
                  >
                    <option value="">Select a substitute</option>
                    {substitutes.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.name} — {f.department}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Exchange type</label>
                <div className="flex gap-4 text-sm text-gray-300">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="exchangeType"
                      value="one-way"
                      checked={exchangeType === "one-way"}
                      onChange={(e) => setExchangeType(e.target.value)}
                    />
                    One-way substitution
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="exchangeType"
                      value="mutual"
                      checked={exchangeType === "mutual"}
                      onChange={(e) => setExchangeType(e.target.value)}
                    />
                    Mutual swap
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-1">Reason</label>
                <textarea
                  className="w-full rounded bg-gray-800 border border-gray-700 text-gray-200 text-sm p-2"
                  rows={3}
                  placeholder="e.g. Medical leave, duty leave, admin work"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {selectedSlot && (
                <p className="text-xs text-gray-500">
                  Requesting cover for {selectedSlot.course?.name} on {selectedSlot.day},{" "}
                  {selectedSlot.startTime}-{selectedSlot.endTime}.
                </p>
              )}

              <Button type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send Request"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}