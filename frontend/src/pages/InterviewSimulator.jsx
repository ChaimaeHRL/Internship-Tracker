import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

export default function InterviewSimulator({ theme, setTheme }) {
  const [form, setForm] = useState({
    role: "",
    interview_type: "hr",
    level: "intern",
    language: "fr",
    max_questions: 5,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "max_questions" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await api.post("interviews/start/", form);
      navigate(`/interview/${res.data.id}`);
    } catch (err) {
      console.log("START INTERVIEW ERROR:", err.response?.data);
      setMessage("Failed to start interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard premium-dashboard">
      <div className="hero-card">
        <div className="hero-left">
          <h1>AI Interview Simulator</h1>
          <p>Practice realistic interview questions and get instant feedback.</p>
        </div>

        <div className="hero-actions">
          <Link to="/dashboard" className="hero-link-btn">Dashboard</Link>
          <Link to="/interview-history" className="hero-link-btn">History</Link>
          <button
            type="button"
            className="theme-btn"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>

      <form className="card premium-form" onSubmit={handleStart}>
        <div className="section-header">
          <div>
            <h2>Start a New Interview</h2>
            <p className="section-subtitle">
              Choose the interview context you want to practice.
            </p>
          </div>
        </div>

        <div className="form-two-cols">
          <div className="field-group">
            <label>Target role</label>
            <input
              type="text"
              name="role"
              placeholder="Frontend Intern, Data Analyst Intern..."
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label>Interview type</label>
            <select name="interview_type" value={form.interview_type} onChange={handleChange}>
              <option value="hr">HR</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="english">English</option>
            </select>
          </div>
        </div>

        <div className="form-three-cols">
          <div className="field-group">
            <label>Level</label>
            <select name="level" value={form.level} onChange={handleChange}>
              <option value="intern">Intern</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
            </select>
          </div>

          <div className="field-group">
            <label>Language</label>
            <select name="language" value={form.language} onChange={handleChange}>
              <option value="fr">French</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="field-group">
            <label>Questions</label>
            <select name="max_questions" value={form.max_questions} onChange={handleChange}>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
            </select>
          </div>
        </div>

        {message && <p className="error">{message}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </form>
    </div>
  );
}