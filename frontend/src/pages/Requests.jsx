import { useState } from "react";
import {
  useRequests,
  useApproveRequest,
  useDeclineRequest,
} from "../hooks/useRequests";
import { useAuth } from "../context/AuthProvider";
import Modal from "../components/Modal";
import { Check, X, Eye } from "lucide-react";

export default function Requests() {
  const { isAdmin } = useAuth();
  const [page, setPage] = useState(1);
  const { data: requests, isLoading } = useRequests(page);
  const approveMutation = useApproveRequest();
  const declineMutation = useDeclineRequest();

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [remarksModalOpen, setRemarksModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState("");
  const [remarks, setRemarks] = useState("");

  const openRemarksModal = (request, type) => {
    setSelectedRequest(request);
    setActionType(type);
    setRemarks("");
    setRemarksModalOpen(true);
  };

  const handleAction = async (e) => {
    e.preventDefault();
    if (actionType === "approve") {
      await approveMutation.mutateAsync({ id: selectedRequest.id, remarks });
    } else {
      await declineMutation.mutateAsync({ id: selectedRequest.id, remarks });
    }
    setRemarksModalOpen(false);
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      declined: "bg-red-100 text-red-700",
    };
    return colors[status] || colors.pending;
  };

  const getTypeBadge = (type) => {
    const colors = {
      create: "bg-blue-100 text-blue-700",
      update: "bg-purple-100 text-purple-700",
      delete: "bg-red-100 text-red-700",
    };
    return colors[type] || colors.create;
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Partnership Requests</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Partnership</th>
              <th className="text-left px-4 py-3 font-medium">Requested By</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Processed By</th>
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests?.results.map((request) => (
              <tr key={request.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${getTypeBadge(
                      request.request_type
                    )}`}
                  >
                    {request.request_type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {request.partnership_name ||
                    request.request_data?.business_name ||
                    "-"}
                </td>
                <td className="px-4 py-3">{request.requested_by_name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusBadge(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {request.processed_by_name || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {new Date(request.timestamp).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setDetailModalOpen(true);
                      }}
                      className="p-1 text-slate-600 hover:bg-slate-100 rounded"
                    >
                      <Eye size={18} />
                    </button>
                    {isAdmin && request.status === "pending" && (
                      <>
                        <button
                          onClick={() => openRemarksModal(request, "approve")}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => openRemarksModal(request, "decline")}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Decline"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between mt-6">
          <button
            disabled={!requests?.previous}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {requests?.current_page} of {requests?.total_pages}
          </span>

          <button
            disabled={!requests?.next}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {requests?.length === 0 && (
          <p className="text-center py-8 text-slate-500">No requests found</p>
        )}
      </div>

      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Request Details"
      >
        {selectedRequest && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-500">Request Type</label>
              <p className="font-medium capitalize">
                {selectedRequest.request_type}
              </p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Status</label>
              <p className="capitalize">{selectedRequest.status}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Requested By</label>
              <p>{selectedRequest.requested_by_name}</p>
            </div>
            {selectedRequest.processed_by_name && (
              <div>
                <label className="text-sm text-slate-500">Processed By</label>
                <p>{selectedRequest.processed_by_name}</p>
              </div>
            )}
            <div>
              <label className="text-sm text-slate-500">Message</label>
              <p>{selectedRequest.message || "-"}</p>
            </div>
            {selectedRequest.admin_remarks && (
              <div>
                <label className="text-sm text-slate-500">Admin Remarks</label>
                <p>{selectedRequest.admin_remarks}</p>
              </div>
            )}
            {selectedRequest.request_data &&
              Object.keys(selectedRequest.request_data).length > 0 && (
                <div>
                  <label className="text-sm text-slate-500">Request Data</label>
                  <div className="mt-1 p-2 bg-slate-50 rounded text-sm">
                    {Object.entries(selectedRequest.request_data).map(
                      ([key, value]) => (
                        <p key={key}>
                          <span className="font-medium">{key}:</span>{" "}
                          {String(value) || "-"}
                        </p>
                      )
                    )}
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={remarksModalOpen}
        onClose={() => setRemarksModalOpen(false)}
        title={actionType === "approve" ? "Approve Request" : "Decline Request"}
      >
        <form onSubmit={handleAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Remarks (Optional)
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add any remarks..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setRemarksModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded-lg ${
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {actionType === "approve" ? "Approve" : "Decline"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
