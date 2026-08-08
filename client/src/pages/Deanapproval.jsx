import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import { getPendingApprovals, approveExchange, rejectExchange } from "../services/exchangeServices";
export default function DeanApproval() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRequest, setActiveRequest] = useState(null); // request being approved/rejected
  const [actionType, setActionType] = useState(null); // "approve" | "reject"
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await getPendingApprovals();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function openModal(request, type) {
    setActiveRequest(request);
    setActionType(type);
    setComment("");
  }

  function closeModal() {
    setActiveRequest(null);
    setActionType(null);
    setComment("");
  }

  async function handleSubmit() {
    if (!activeRequest) return;
    setSubmitting(true);
    try {
      if (actionType === "approve") {
        await approveExchange(activeRequest._id, comment);
      } else {
        await rejectExchange(activeRequest._id, comment);
      }
      closeModal();
      loadRequests(); // refresh list — approved/rejected item drops off
    } catch (err) {
      console.error(err);
      alert("Action failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const columns = [
  { header: "Course", accessor: "courseName" },
  { header: "Original Faculty", accessor: "requestingFacultyName" },
  { header: "Substitute", accessor: "substituteFacultyName" },
  { header: "Day / Time", accessor: "slotLabel" },
  { header: "Reason", accessor: "reason" },
  { header: "Status", accessor: "status" },
];
  const rows = requests.map((r) => ({
  ...r,

  courseName: r.course,

  requestingFacultyName: r.originalFaculty,

  substituteFacultyName: r.substituteFaculty,

  slotLabel: `${r.date} ${r.startTime}-${r.endTime}`,

  actions: (
    <div className="flex gap-2">
      <Button
        variant="success"
        onClick={() => openModal(r, "approve")}
      >
        Approve
      </Button>

      <Button
        variant="danger"
        onClick={() => openModal(r, "reject")}
      >
        Reject
      </Button>
    </div>
  ),
}));

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar title="Dean Approval Dashboard" />

        <div className="p-6">
          <Card>
            <h2 className="text-lg font-semibold mb-4">
              Pending HOD/Dean Approval ({requests.length})
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-400">No exchange requests awaiting approval.</p>
            ) : (
              <Table columns={[...columns, { header: "Actions", accessor: "actions" }]} data={rows} />
            )}
          </Card>
        </div>

        {activeRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-96">
              <h3 className="text-md font-semibold mb-2">
                {actionType === "approve" ? "Approve" : "Reject"} Exchange Request
              </h3>
              <p className="text-sm mb-3">
                {activeRequest.requestingFaculty?.name} → {activeRequest.substituteFaculty?.name},{" "}
                {activeRequest.timetableSlot?.day} {activeRequest.timetableSlot?.startTime}
              </p>
              <textarea
                className="w-full border rounded p-2 mb-3 text-black"
                rows={3}
                placeholder="Comment (optional)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button
                  variant={actionType === "approve" ? "success" : "danger"}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Confirm"}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}