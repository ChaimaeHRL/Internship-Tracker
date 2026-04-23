import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

export default function InterviewHistory({ theme, setTheme }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      const res = await api.get("interviews/");
      setSessions(res.data);
    } catch (err) {
      console.log("INTERVIEW HISTORY ERROR:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  if (loading) {
    return <div className="dashboard"><div className="card">Loading history...</div></div>;
  }

  return (
    <div className="dashboard premium-dashboard">
      <div className="hero-card">
        <div className="hero-left">
          <h1>Interview History</h1>
          <p>Review your past interview practice sessions and feedback.</p>
        </div>

        <div className="hero-actions">
          <Link to="/dashboard" className="hero-link-btn">Dashboard</Link>
          <Link to="/interview" className="hero-link-btn">New Interview</Link>
          <button
            type="button"
            className="theme-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>

      <div className="card">
        <h2>Past Sessions</h2>

        {sessions.length === 0 ? (
          <p>No interview sessions yet.</p>
        ) : (
          <div className="application-list">
            {sessions.map((session) => (
              <div className="application-item" key={session.id}>
                <div>
                  <h3>{session.role}</h3>
                  <p><strong>Type:</strong> {session.interview_type}</p>
                  <p><strong>Language:</strong> {session.language}</p>
                  <p><strong>Level:</strong> {session.level}</p>
                  <p><strong>Score:</strong> {session.final_score ?? "In progress"}</p>
                  <p><strong>Status:</strong> {session.is_finished ? "Finished" : "In progress"}</p>
                </div>

                <div className="application-actions">
                  <Link to={`/interview/${session.id}`} className="hero-link-btn">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}