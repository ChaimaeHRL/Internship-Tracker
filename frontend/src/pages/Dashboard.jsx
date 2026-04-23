import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";

export default function Dashboard({ theme, setTheme }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const navigate = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await api.get("applications/");
      setApplications(res.data);
    } catch (err) {
      console.log("APPLICATIONS ERROR:", err.response?.status, err.response?.data);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const stats = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter((a) => a.status === "Interview").length;
    const offers = applications.filter((a) => a.status === "Offer").length;
    const rejected = applications.filter((a) => a.status === "Rejected").length;
    const active = applications.filter(
      (a) => a.status === "Applied" || a.status === "Interview"
    ).length;
    const interviewRate = total ? ((interviews / total) * 100).toFixed(1) : 0;

    return { total, interviews, offers, rejected, active, interviewRate };
  }, [applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesStatus =
        statusFilter === "All" ? true : app.status === statusFilter;

      const query = search.toLowerCase();

      const matchesSearch =
        app.company_name.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query) ||
        app.source.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [applications, statusFilter, search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  const handleEditApplication = (app) => {
    setSelectedApplication(app);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setSelectedApplication(null);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="card">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard premium-dashboard">
      <div className="hero-card">
        <div className="hero-left">
          <h1>Internship Tracker</h1>
          <p>
            Track applications, interviews, offers, deadlines, and follow-ups
            in one clean workspace.
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/profile" className="hero-link-btn">
            Profile
          </Link>
          <Link to="/interview" className="hero-link-btn">
            Interview AI
          </Link>
          <button
            type="button"
            className="theme-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        
        </div>
      </div>

      <div className="stats-grid">
        <div className="card stat-card">
          <h3>Total</h3>
          <p>{stats.total}</p>
        </div>
        <div className="card stat-card">
          <h3>Active</h3>
          <p>{stats.active}</p>
        </div>
        <div className="card stat-card">
          <h3>Interviews</h3>
          <p>{stats.interviews}</p>
        </div>
        <div className="card stat-card">
          <h3>Offers</h3>
          <p>{stats.offers}</p>
        </div>
        <div className="card stat-card">
          <h3>Rejected</h3>
          <p>{stats.rejected}</p>
        </div>
        <div className="card stat-card">
          <h3>Interview Rate</h3>
          <p>{stats.interviewRate}%</p>
        </div>
      </div>

      <div className="card filter-card">
        <div className="section-header">
          <div>
            <h2>Filter Applications</h2>
            <p className="section-subtitle">
              Quickly find opportunities by company, role, source, or status.
            </p>
          </div>
        </div>

        <div className="filter-grid">
          <input
            type="text"
            placeholder="Search by company, role, or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>
      </div>

      <ApplicationForm
        onCreated={fetchApplications}
        selectedApplication={selectedApplication}
        onCancelEdit={handleCancelEdit}
      />

      <ApplicationList
        applications={filteredApplications}
        onRefresh={fetchApplications}
        onEdit={handleEditApplication}
      />
    </div>
  );
}