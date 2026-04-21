import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ApplicationForm from "../components/ApplicationForm";
import ApplicationList from "../components/ApplicationList";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const nav = useNavigate();

  const fetchApplications = async () => {
    try {
      const res = await api.get("applications/");
      setApplications(res.data);
    } catch (err) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      nav("/");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    nav("/");
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <h1>Internship Tracker</h1>
        <button onClick={handleLogout}>Logout</button>
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

      <ApplicationForm onCreated={fetchApplications} />
      <ApplicationList applications={applications} onRefresh={fetchApplications} />
    </div>
  );
}
const fetchApplications = async () => {
  try {
    const res = await api.get("applications/");
    setApplications(res.data);
  } catch (err) {
    console.log("APPLICATIONS ERROR:", err.response?.status, err.response?.data);
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    nav("/");
  }
};