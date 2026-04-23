import { useEffect, useState } from "react";
import api from "../api/axios";

const emptyForm = {
  company_name: "",
  role: "",
  application_date: "",
  source: "LinkedIn",
  status: "Applied",
  follow_up_date: "",
  deadline: "",
  notes: "",
};

export default function ApplicationForm({
  onCreated,
  selectedApplication,
  onCancelEdit,
}) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (selectedApplication) {
      setForm({
        company_name: selectedApplication.company_name || "",
        role: selectedApplication.role || "",
        application_date: selectedApplication.application_date || "",
        source: selectedApplication.source || "LinkedIn",
        status: selectedApplication.status || "Applied",
        follow_up_date: selectedApplication.follow_up_date || "",
        deadline: selectedApplication.deadline || "",
        notes: selectedApplication.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [selectedApplication]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (form.follow_up_date && form.application_date > form.follow_up_date) {
      setMessage("Follow-up date must be after or equal to application date.");
      setLoading(false);
      return;
    }

    if (form.deadline && form.application_date > form.deadline) {
      setMessage("Deadline must be after or equal to application date.");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...form,
        follow_up_date: form.follow_up_date || null,
        deadline: form.deadline || null,
      };

      if (selectedApplication) {
        await api.put(`applications/${selectedApplication.id}/`, payload);
        setMessage("Application updated successfully.");
      } else {
        await api.post("applications/", payload);
        setMessage("Application saved successfully.");
      }

      setForm(emptyForm);

      if (onCreated) {
        await onCreated();
      }

      if (onCancelEdit) {
        onCancelEdit();
      }
    } catch (err) {
      console.log("SAVE APPLICATION ERROR:", err.response?.status, err.response?.data);

      if (err.response?.status === 401) {
        setMessage("Session expired. Please login again.");
      } else if (err.response?.data) {
        setMessage(JSON.stringify(err.response.data));
      } else {
        setMessage("Failed to save application.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card premium-form" onSubmit={handleSubmit}>
      <div className="section-header">
        <div>
          <h2>{selectedApplication ? "Edit Application" : "Add Application"}</h2>
          <p className="section-subtitle">
            {selectedApplication
              ? "Update this application."
              : "Save a new internship or job application."}
          </p>
        </div>
      </div>

      <div className="form-two-cols">
        <div className="field-group">
          <label>Company name</label>
          <input
            type="text"
            name="company_name"
            placeholder="Google, Meta, Amazon..."
            value={form.company_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label>Role</label>
          <input
            type="text"
            name="role"
            placeholder="Software Engineering Intern"
            value={form.role}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-three-cols">
        <div className="field-group">
          <label>Application date</label>
          <input
            type="date"
            name="application_date"
            value={form.application_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field-group">
          <label>Follow-up date</label>
          <input
            type="date"
            name="follow_up_date"
            value={form.follow_up_date}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-two-cols">
        <div className="field-group">
          <label>Source</label>
          <select name="source" value={form.source} onChange={handleChange}>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Indeed">Indeed</option>
            <option value="Company Website">Company Website</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="field-group">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </div>
      </div>

      <div className="field-group">
        <label>Notes</label>
        <textarea
          name="notes"
          placeholder="Add notes about this application..."
          value={form.notes}
          onChange={handleChange}
          rows="5"
        />
      </div>

      {message && (
        <p className={message.includes("successfully") ? "success-text" : "error"}>
          {message}
        </p>
      )}

      <div className="form-actions form-actions-row">
        <button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : selectedApplication
            ? "Update application"
            : "Save application"}
        </button>

        {selectedApplication && (
          <button
            type="button"
            className="secondary-btn"
            onClick={onCancelEdit}
          >
            Cancel edit
          </button>
        )}
      </div>
    </form>
  );
}