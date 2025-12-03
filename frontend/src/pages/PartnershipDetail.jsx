import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/App.css"; // Make sure this has your shared styles

export default function PartnershipDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState({
    business_name: "",
    contact_person: "",
    address: "",
    email: "",
    contact_number: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/api/partnership/${id}/`)
      .then((res) => setDetail(res.data))
      .catch(() => alert("Failed to load partnership details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setDetail({ ...detail, [e.target.name]: e.target.value });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/api/partnership/${id}/`, detail);
      alert("Updated successfully");
    } catch {
      alert("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  const deletePartnership = async () => {
    if (!window.confirm("Delete this partnership?")) return;

    try {
      await api.delete(`/api/partnership/${id}/`);
      alert("Deleted successfully");
      navigate("/partnerships");
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p style={{ color: "white", textAlign: "center" }}>Loading...</p>;

  return (
    <div className="auth-wrapper" style={{ background: "#000", minHeight: "100vh" }}>
      <div className="auth-card">
        {detail.logo && (
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={detail.logo}
              alt={detail.business_name}
              style={{ width: "100%", height: 200, objectFit: "contain", borderRadius: 12, background: "#111" }}
            />
          </div>
        )}

        <div className="auth-title-wrapped">Edit Partnership</div>

        <form onSubmit={saveEdit}>
          {[
            { label: "Business Name", name: "business_name", type: "text" },
            { label: "Contact Person", name: "contact_person", type: "text" },
            { label: "Address", name: "address", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Contact Number", name: "contact_number", type: "text" },
          ].map((field) => (
            <div className="input-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={detail[field.name] || ""}
                onChange={handleChange}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                required
              />
            </div>
          ))}

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={detail.description || ""}
              onChange={handleChange}
              rows={4}
              placeholder="Enter description..."
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            Save Changes
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={deletePartnership}
            style={{ marginTop: 10 }}
            disabled={loading}
          >
            Delete Partnership
          </button>
        </form>

        {loading && <span style={{ color: "white", fontWeight: "bold", display: "block", marginTop: 10 }}>Loading...</span>}

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="btn btn-outline" onClick={() => navigate("/partnerships")}>
            Back to Partnerships
          </button>
        </div>
      </div>
    </div>
  );
}
