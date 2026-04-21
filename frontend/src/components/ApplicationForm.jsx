import { useState } from "react";
import api from "../api/axios";

export default function ApplicationForm({ onCreated }) {
  const [form, setForm] = useState({
    company_name: "",
    role: "",
    application_date: "",
    source: "LinkedIn",
    status: "Applied",
    notes: "",
    follow_up_date: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      follow_up_date: form.follow_up_date || null,
      deadline: form.deadline || null,
    };

    await api.post("applications/", payload);

    setForm({
      company_name: "",
      role: "",
      application_date: "",
      source: "LinkedIn",
      status: "Applied",
      notes: "",
      follow_up_date: "",
      deadline: "",
    });

    onCreated();
  };

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <h2>Add Application</h2>

      <input
        name="company_name"
        placeholder="Company name"
        value={form.company_name}
        onChange={handleChange}
        required
      />

      <input
        name="role"
        placeholder="Role"
        value={form.role}
        onChange={handleChange}
        required
      />

      <input
        name="application_date"
        type="date"
        value={form.application_date}
        onChange={handleChange}
        required
      />

      <select name="source" value={form.source} onChange={handleChange}>
        <option>LinkedIn</option>
        <option>Indeed</option>
        <option>Company Website</option>
        <option>Referral</option>
        <option>Other</option>
      </select>

      <select name="status" value={form.status} onChange={handleChange}>
        <option>Applied</option>
        <option>Interview</option>
        <option>Rejected</option>
        <option>Offer</option>
      </select>

      <input
        name="follow_up_date"
        type="date"
        value={form.follow_up_date}
        onChange={handleChange}
      />

      <input
        name="deadline"
        type="date"
        value={form.deadline}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes"
        value={form.notes}
        onChange={handleChange}
        rows="4"
      />

      <button type="submit">Save application</button>
    </form>
  );
}