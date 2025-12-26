import { useState, useEffect } from "react";
import {
  usePartnerships,
  useCreatePartnership,
  useUpdatePartnership,
  useDeletePartnership,
} from "../hooks/usePartnerships";
import { useDepartments } from "../hooks/useDepartments";
import { useCreateRequest } from "../hooks/useRequests";
import { useAuth } from "../context/AuthProvider";
import Modal from "../components/Modal";
import DeleteAlertDialog from "../components/DeleteAlertDialog";
import { Plus, Edit, Trash2, Eye, Send } from "lucide-react";

export default function Partnerships() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState(null);
  const [editingPartnership, setEditingPartnership] = useState(null);
  const [requestType, setRequestType] = useState("create");
  const [requestMessage, setRequestMessage] = useState("");

  const { user, isAdmin, isStaff } = useAuth();
  const {
    data: partnerships,
    isLoading,
    refetch,
  } = usePartnerships({
    departmentName: selectedDept,
    search: searchQuery,
    type: typeFilter,
    status: statusFilter,
    startDate,
    endDate,
    isAdmin,
    isStaff,
  });
  const { data: departments } = useDepartments();
  const createMutation = useCreatePartnership();
  const updateMutation = useUpdatePartnership();
  const deleteMutation = useDeletePartnership();
  const createRequestMutation = useCreateRequest();

  useEffect(() => {
    refetch();
  }, [selectedDept, searchQuery, typeFilter, statusFilter, startDate, endDate]);

  const [formData, setFormData] = useState({
    department: "",
    business_name: "",
    description: "",
    address: "",
    contact_person: "",
    email: "",
    contact_number: "",
    started_date: "",
    effectivity_date: "",
    status: "active",
    partnership_type: "local",
    logo: null,
  });

  const canEdit = (partnership) => {
    if (isAdmin) return true;
    if (isStaff && user.department === partnership.department) return true;
    return false;
  };

  const openCreateModal = () => {
    setEditingPartnership(null);
    setFormData({
      department: isStaff ? user.department : "",
      business_name: "",
      description: "",
      address: "",
      contact_person: "",
      email: "",
      contact_number: "",
      started_date: "",
      effectivity_date: "",
      status: "active",
      partnership_type: "local",
      logo: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (partnership) => {
    setEditingPartnership(partnership);
    setFormData({
      department: partnership.department,
      business_name: partnership.business_name,
      description: partnership.description || "",
      address: partnership.address || "",
      contact_person: partnership.contact_person || "",
      email: partnership.email || "",
      contact_number: partnership.contact_number || "",
      started_date: partnership.started_date || "",
      effectivity_date: partnership.effectivity_date || "",
      status: partnership.status || "",
      partnership_type: partnership.partnership_type || "",
      logo: null,
    });
    setModalOpen(true);
  };

  const openRequestModal = (type, partnership = null) => {
    setRequestType(type);
    setSelectedPartnership(partnership);
    setRequestMessage("");
    if (type === "create") {
      setFormData({
        department: isStaff ? user.department : "",
        business_name: "",
        description: "",
        address: "",
        contact_person: "",
        email: "",
        contact_number: "",
        started_date: "",
        effectivity_date: "",
        partnership_type: "",
      });
    } else if (partnership) {
      setFormData({
        department: partnership.department,
        business_name: partnership.business_name,
        description: partnership.description || "",
        address: partnership.address || "",
        contact_person: partnership.contact_person || "",
        email: partnership.email || "",
        contact_number: partnership.contact_number || "",
        started_date: partnership.started_date || "",
        effectivity_date: partnership.effectivity_date || "",
        partnership_type: partnership.partnership_type || "local",
      });
    }
    setRequestModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPartnership) {
      await updateMutation.mutateAsync({
        id: editingPartnership.id,
        ...formData,
      });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setModalOpen(false);
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    await createRequestMutation.mutateAsync({
      partnership: selectedPartnership?.id || null,
      request_type: requestType,
      message: requestMessage,
      request_data: formData,
    });
    setRequestModalOpen(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const groupedPartnerships = partnerships?.reduce((acc, p) => {
    const deptName = p.department_name || "Unknown";
    if (!acc[deptName]) acc[deptName] = [];
    acc[deptName].push(p);
    return acc;
  }, {});

  const departmentList = departments?.reduce((acc, p) => {
    const deptName = p.name || "Unknown";
    const deptAcronym = p.acronym || deptName;

    if (!acc[deptName]) {
      acc[deptName] = {
        name: deptName,
        acronym: deptAcronym,
        partnerships: [],
      };
    }
    acc[deptName].partnerships.push(p);
    return acc;
  }, {});

  const departmentNames = [
    { name: "All", acronym: "All" },
    ...Object.values(departmentList || {}),
  ];

  const visiblePartnerships =
    selectedDept === "All"
      ? partnerships
      : groupedPartnerships?.[selectedDept] || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Partnerships</h1>
        <div className="flex gap-2">
          {isStaff && (
            <button
              onClick={() => openRequestModal("create")}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              <Send size={20} />
              Submit Request
            </button>
          )}
          {isAdmin && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Add Partnership
            </button>
          )}
        </div>
      </div>

      <div className="relative -mx-4 px-4 mb-8">
        <div
          className="flex gap-3 overflow-x-auto whitespace-nowrap pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {departmentNames.map((dept) => (
            <button
              key={dept.name}
              onClick={() => setSelectedDept(dept.name)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition
          ${
            selectedDept === dept
              ? "bg-blue-600 text-white shadow"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
            >
              {dept.acronym}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        {/* Search - visible to all */}
        <input
          type="text"
          placeholder="Search partnerships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/3"
        />

        {/* Type filter - visible to all */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 border rounded w-full md:w-1/4"
        >
          <option value="">All Types</option>
          <option value="local">Local</option>
          <option value="international">International</option>
        </select>

        {/* Status filter - staff/admin only */}
        {(isAdmin || isStaff) && (
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/4"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="renewal">For Renewal</option>
            <option value="terminated">Terminated</option>
            <option value="expired">Expired</option>
          </select>
        )}

        {/* Time range filter - staff/admin only, depends on status */}
        {(isAdmin || isStaff) && statusFilter && (
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded"
            />
            <span className="self-center">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visiblePartnerships.length === 0 ? (
          <p className="col-span-full text-center py-10 text-slate-500">
            No partnerships found
          </p>
        ) : (
          visiblePartnerships.map((partnership) => {
            const now = new Date();
            const started = partnership.started_date
              ? new Date(partnership.started_date)
              : null;
            const effectivity = partnership.effectivity_date
              ? new Date(partnership.effectivity_date)
              : null;
            let status, statusColor, borderColor;

            if (partnership.status) {
              switch (partnership.status) {
                case "active":
                  status = "Active";
                  statusColor = "bg-green-500";
                  borderColor = "border-green-400";
                  break;
                case "renewal":
                  status = "For Renewal";
                  statusColor = "bg-yellow-500";
                  borderColor = "border-yellow-400";
                  break;
                case "terminated":
                  status = "Terminated";
                  statusColor = "bg-red-500";
                  borderColor = "border-red-400";
                  break;
                case "expired":
                  status = "Expired";
                  statusColor = "bg-gray-500";
                  borderColor = "border-gray-400";
                  break;
                default:
                  status = "Unknown";
                  statusColor = "bg-gray-400";
                  borderColor = "border-gray-300";
              }
            } else {
              // Fallback if status is somehow null/undefined
              status = "Active";
              statusColor = "bg-green-500";
              borderColor = "border-green-400";
            }
            // Logotype or initials (circle)
            let logoEl = null;
            if (partnership.logo) {
              // Media URL proxied by vite.config.js
              logoEl = (
                <img
                  src={`${partnership.logo}`}
                  alt={partnership.business_name}
                  className="w-12 h-12 rounded-full border-2 border-slate-300 bg-white object-cover"
                />
              );
            } else {
              const initial = partnership.business_name
                ? partnership.business_name
                    .split(" ")
                    .map((w) => w[0] || "")
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()
                : "?";
              logoEl = (
                <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-slate-300 bg-blue-200 text-xl font-bold text-blue-900 drop-shadow-sm">
                  {initial}
                </div>
              );
            }
            // Meta fields
            const sinceYear = started ? started.getFullYear() : "—";
            const location = partnership.address || "N/A";
            // Card rendering

            return (
              <div
                key={partnership.id}
                className={`relative bg-white rounded-xl shadow p-5 border-l-8 ${borderColor}
            flex flex-col min-h-[200px] transition hover:shadow-xl`}
              >
                {(isAdmin ||
                  (isStaff && user.department === partnership.department)) && (
                  <span
                    className={`absolute top-5 right-5 flex items-center`}
                    title={status}
                  >
                    <span
                      className={statusColor}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: "9999px",
                        display: "inline-block",
                        marginRight: 4,
                        border: "2px solid white",
                        boxShadow: "0 0 1px 1px rgba(60,60,60,0.05)",
                      }}
                    />
                    <span className="sr-only">{status}</span>
                  </span>
                )}
                {/* Logo or Initials */}
                <div className="absolute -left-6 top-4">{logoEl}</div>
                <div className="pl-10 pt-2 min-h-[48px]">
                  {/* Business Name */}
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-bold text-xl leading-tight">
                      {partnership.business_name}
                    </h3>
                    <span className="text-xs ml-2 px-2 rounded bg-gray-200 text-gray-700">
                      {partnership.partnership_type === "international"
                        ? "International"
                        : "Local"}
                    </span>
                  </div>
                  {/* Description (truncate, hover to show full in tooltip) */}
                  <div
                    className="mt-1 text-slate-600 text-sm h-10 overflow-hidden text-ellipsis"
                    title={partnership.description || ""}
                  >
                    {partnership.description || "No description provided."}
                  </div>
                </div>
                <hr className="my-3 border-slate-200" />
                <div className="flex justify-between text-xs text-slate-500 pb-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="inline-block mr-1">
                      <svg
                        width="13"
                        height="13"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.484 2 12c0 5.522 4.48 10 10 10s10-4.478 10-10c0-5.516-4.48-10-10-10Zm0 15.625c-1.41 0-2.563-1.042-2.563-2.325 0-1.19.942-2.162 2.181-2.307V8.827a.34.34 0 0 1 .344-.346h.094a.34.34 0 0 1 .344.346v2.166c1.239.145 2.181 1.117 2.181 2.307 0 1.283-1.153 2.325-2.563 2.325Zm0-15.625v.946v-.946Z"
                          fill="#64748b"
                        />
                      </svg>
                    </span>
                    <span>Since {sinceYear}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block mr-1">
                      <svg height="13" viewBox="0 0 24 24" width="13">
                        <path
                          fill="#64748b"
                          d="M15.89 14.648a6.503 6.503 0 0 0 3.27-7.448a6.5 6.5 0 0 0-8.21-4.374A6.492 6.492 0 0 0 4.393 13.163c.232 2.755-2.2 4.28-2.453 4.415a1 1 0 0 0 .03 1.75c1.021.485 2.105.698 3.185.623c1.937-.14 5.223-1.012 8.047-3.303c.499.028.997.038 1.495.026a14.713 14.713 0 0 1 1.506-.026c.075.752.162 1.395.162 1.398a1 1 0 0 0 .995.874h.003a1 1 0 0 0 .967-.935a13.905 13.905 0 0 0-1.066-5.282Z"
                        />
                      </svg>
                    </span>
                    <span>{location}</span>
                  </div>
                  {/* Example bottom tag, comment/uncomment as needed */}
                  {/* <span className="ml-auto bg-orange-200 text-orange-800 px-2 py-1 rounded text-[11px] font-semibold">Ongoing Soon</span> */}
                </div>
                {/* Edit/Config Buttons Under Address Right Corner */}
                <div className="flex justify-end mt-1 pr-1">
                  {canEdit(partnership) && (
                    <div className="flex gap-1">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => openEditModal(partnership)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <DeleteAlertDialog
                            onConfirm={() =>
                              deleteMutation.mutateAsync(partnership.id)
                            }
                          />
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              openRequestModal("update", partnership)
                            }
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            title="Request Update"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() =>
                              openRequestModal("delete", partnership)
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Request Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <Modal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        title="Partnership Details"
      >
        {selectedPartnership && (
          <div className="space-y-3">
            <div>
              <label className="text-sm text-slate-500">Business Name</label>
              <p className="font-medium">{selectedPartnership.business_name}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Department</label>
              <p>{selectedPartnership.department_name}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Description</label>
              <p>{selectedPartnership.description || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Address</label>
              <p>{selectedPartnership.address || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Contact Person</label>
              <p>{selectedPartnership.contact_person || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Email</label>
              <p>{selectedPartnership.email || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Contact Number</label>
              <p>{selectedPartnership.contact_number || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Started Date</label>
              <p>{selectedPartnership.started_date || "-"}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Effectivity Date</label>
              <p>{selectedPartnership.effectivity_date || "-"}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPartnership ? "Edit Partnership" : "Add Partnership"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <select
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isStaff}
            >
              <option value="">Select Department</option>
              {departments?.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Business Name
            </label>
            <input
              type="text"
              value={formData.business_name}
              onChange={(e) =>
                setFormData({ ...formData, business_name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contact_person}
                onChange={(e) =>
                  setFormData({ ...formData, contact_person: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Contact Number
              </label>
              <input
                type="text"
                value={formData.contact_number}
                onChange={(e) =>
                  setFormData({ ...formData, contact_number: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Started Date
              </label>
              <input
                type="date"
                value={formData.started_date}
                onChange={(e) =>
                  setFormData({ ...formData, started_date: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Effectivity Date
              </label>
              <input
                type="date"
                value={formData.effectivity_date}
                onChange={(e) =>
                  setFormData({ ...formData, effectivity_date: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Logo Picker - Attractive Avatar Circle */}
          <div className="flex flex-col items-center mb-4">
            <div className="relative w-28 h-28">
              <label
                htmlFor="partnership-logo-input"
                className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-blue-200 bg-white shadow cursor-pointer transition hover:shadow-lg hover:border-blue-400"
              >
                {formData.logo && typeof formData.logo === "object" ? (
                  <img
                    src={URL.createObjectURL(formData.logo)}
                    alt="Selected Logo"
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 flex flex-col items-center justify-center rounded-full bg-blue-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 text-blue-400 mb-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span className="text-blue-400 text-xs">Add Logo</span>
                  </div>
                )}
                <input
                  id="partnership-logo-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, logo: e.target.files[0] })
                  }
                  className="opacity-0 w-0 h-0 absolute inset-0 cursor-pointer"
                  tabIndex={-1}
                />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-blue-600 flex items-center justify-center rounded-full shadow border-2 border-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
            </div>
            <span className="block text-xs text-gray-500 mt-2">
              Click the circle to select/change a logo
            </span>
          </div>

          {/* Partnership Locality (Type) */}
          <div>
            <label className="block text-sm font-medium mb-1">Locality</label>
            <select
              value={formData.partnership_type}
              onChange={(e) =>
                setFormData({ ...formData, partnership_type: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="local">Local</option>
              <option value="international">International</option>
            </select>
          </div>

          {/* Partnership Status (Request) */}
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="active">Active</option>
              <option value="renewal">For Renewal</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingPartnership ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        title={`Submit ${
          requestType.charAt(0).toUpperCase() + requestType.slice(1)
        } Request`}
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          {requestType !== "delete" && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={isStaff}
                >
                  <option value="">Select Department</option>
                  {departments?.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) =>
                    setFormData({ ...formData, business_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_person: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={formData.contact_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact_number: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Started Date
                  </label>
                  <input
                    type="date"
                    value={formData.started_date}
                    onChange={(e) =>
                      setFormData({ ...formData, started_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Effectivity Date
                  </label>
                  <input
                    type="date"
                    value={formData.effectivity_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        effectivity_date: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">
              Message (Optional)
            </label>
            <textarea
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              placeholder="Add a note for the admin..."
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setRequestModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
