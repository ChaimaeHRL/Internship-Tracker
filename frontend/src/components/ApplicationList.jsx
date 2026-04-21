import api from "../api/axios";

export default function ApplicationList({ applications, onRefresh }) {
  const handleDelete = async (id) => {
    await api.delete(`applications/${id}/`);
    onRefresh();
  };

  const handleStatusChange = async (app, newStatus) => {
    await api.patch(`applications/${app.id}/`, {
      status: newStatus,
    });
    onRefresh();
  };

  return (
    <div className="card">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className="application-list">
          {applications.map((app) => (
            <div key={app.id} className="application-item">
              <div>
                <h3>{app.company_name}</h3>
                <p>{app.role}</p>
                <p>Applied on: {app.application_date}</p>
                <p>Source: {app.source}</p>
                <p>Status: {app.status}</p>
                <p>Deadline: {app.deadline || "—"}</p>
                <p>Follow-up: {app.follow_up_date || "—"}</p>
                <p>Notes: {app.notes || "—"}</p>
              </div>

              <div className="application-actions">
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app, e.target.value)}
                >
                  <option>Applied</option>
                  <option>Interview</option>
                  <option>Rejected</option>
                  <option>Offer</option>
                </select>

                <button onClick={() => handleDelete(app.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}