import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/App.css"; // assuming you have auth-card, input-group styles like Register

export default function PartnershipCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    business_name: "",
    contact_person: "",
    address: "",
    email: "",
    contact_number: "",
    description: "",
    logo: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) payload.append(key, formData[key]);
    }

    try {
      const res = await api.post("/api/partnership/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 201) {
        alert("Partnership created!");
        navigate("/partnerships");
      } else {
        alert("Failed to create partnership.");
      }
    } catch (err) {
      alert(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper" style={{ background: "#000", minHeight: "100vh" }}>
      <div className="auth-card">
        <div className="auth-title-wrapped">Create Partnership</div>

        <form onSubmit={handleSubmit}>
          {[
            { label: "Business Name", name: "business_name", type: "text", placeholder: "Enter business name" },
            { label: "Contact Person", name: "contact_person", type: "text", placeholder: "Enter contact person" },
            { label: "Address", name: "address", type: "text", placeholder: "Enter address" },
            { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
            { label: "Contact Number", name: "contact_number", type: "text", placeholder: "Enter contact number" },
          ].map((field) => (
            <div className="input-group" key={field.name}>
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required
              />
            </div>
          ))}

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={4}
            />
          </div>

          <div className="input-group">
            <label>Logo</label>
            <input type="file" name="logo" accept="image/*" onChange={handleChange} required />
            {formData.logo && (
              <img
                src={URL.createObjectURL(formData.logo)}
                alt="Preview"
                style={{ width: "100%", height: 200, objectFit: "contain", marginTop: 12, borderRadius: 8 }}
              />
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Creating..." : "Create Partnership"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20 }}>
          <button className="btn btn-outline" onClick={() => navigate("/partnerships")}>
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}
