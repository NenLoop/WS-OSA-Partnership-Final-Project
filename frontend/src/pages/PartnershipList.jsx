import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Plus } from "lucide-react";
import api from "../api";
import "../styles/App.css";

export default function PartnershipList() {
  const [partnerships, setPartnerships] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDepartments();
    loadPartnerships();
  }, []);

  const loadDepartments = () => {
    api
      .get("/api/department/")
      .then((res) => setDepartments(res.data))
      .catch(() => alert("Failed to load departments"));
  };

  const loadPartnerships = () => {
    api
      .get("/api/partnership/")
      .then((res) => setPartnerships(res.data))
      .catch(() => alert("Failed to load partnerships"));
  };

  const getDepartmentName = (deptId) => {
    const found = departments.find((d) => d.id === deptId);
    return found ? found.name : "No Department";
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/logout");
    }
  };

  const filteredPartnerships = selectedDept
    ? partnerships.filter((p) => p.department_id === selectedDept)
    : partnerships;

  const grouped = filteredPartnerships.reduce((acc, p) => {
    const key = getDepartmentName(p.department_id);
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  return (
    <div className="partnership-page">
      <nav className="partnership-nav">
        <div className="nav-brand">
          <User size={20} />
          <span>User Portal</span>
        </div>
        <div className="nav-actions">
          <button className="btn-icon" onClick={() => navigate("/partnerships-create")}>
            <Plus size={20} />
            <span>Create Partnership</span>
          </button>
          <button className="btn-icon btn-logout" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      <section className="hero-partnerships">
        <div className="hero-overlay"></div>
        <div className="hero-content-partnerships">
          <h1>PARTNERSHIPS</h1>
          <p>Building bridges between academia and industry for a brighter future</p>
        </div>
      </section>

      <section className="departments-filter">
        <h3>DEPARTMENTS</h3>
        <div className="dept-badges">
          <button
            className={`dept-badge ${!selectedDept ? 'active' : ''}`}
            onClick={() => setSelectedDept(null)}
          >
            ALL
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              className={`dept-badge ${selectedDept === dept.id ? 'active' : ''}`}
              onClick={() => setSelectedDept(dept.id)}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </section>

      <section className="partnerships-section">
        {Object.entries(grouped).map(([dept, partners]) => (
          <div key={dept} className="dept-group">
            <h2 className="dept-group-title">{dept}</h2>
            <div className="partnerships-grid">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="partnership-card"
                  onClick={() => navigate(`/partnerships/${p.id}`)}
                >
                  {p.logo && (
                    <div className="partnership-logo-container">
                      <img src={p.logo} alt={p.business_name} />
                    </div>
                  )}
                  <div className="partnership-info">
                    <h4>{p.business_name}</h4>
                    <p className="contact-person">{p.contact_person}</p>
                    <p className="address">{p.address}</p>
                    <span className="location-badge">{p.location_type === 'local' ? 'Local' : 'International'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
