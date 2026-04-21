import api from "../api/axios";

export default function ApplicationList({ applications, onRefresh, onEdit }) {
  const handleDelete = async (id) => {
    try {
      await api.delete(`applications/${id}/`);
      onRefresh();
    } catch (err) {
      console.log("DELETE ERROR:", err.response?.data);
    }
  };

  const handleStatusChange = async (app, newStatus) => {
    try {
      await api.patch(`applications/${app.id}/`, {
        status: newStatus,
      });
      onRefresh();
    } catch (err) {
      console.log("STATUS UPDATE ERROR:", err.response?.data);
    }
  };

  return (
    <div className="card">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="application-list">
          {applications.map((app) => (
            <div key={app.id} className="application-item">
              <div style={{ flex: 1 }}>
                <h3>{app.company_name}</h3>

                <p><strong>Role:</strong> {app.role}</p>
                <p><strong>Applied on:</strong> {app.application_date}</p>
                <p><strong>Source:</strong> {app.source}</p>
                <p><strong>Deadline:</strong> {app.deadline || "—"}</p>
                <p><strong>Follow-up:</strong> {app.follow_up_date || "—"}</p>
                <p><strong>Notes:</strong> {app.notes || "—"}</p>

                <p>
                  <span className={`badge badge-${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
                </p>
              </div>

              <div className="application-actions">
                <label style={{ color: "var(--text-soft)", fontWeight: 600 }}>
                  Update status
                </label>

                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app, e.target.value)}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Offer">Offer</option>
                </select>

                <button
                  type="button"
                  onClick={() => onEdit(app)}
                  style={{ marginTop: "12px" }}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(app.id)}
                  style={{ marginTop: "12px", background: "var(--danger)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}