import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function InterviewChat({ theme, setTheme }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await api.get(`interviews/${id}/`);
      setSession(res.data);
    } catch (err) {
      console.log("FETCH SESSION ERROR:", err.response?.data);
      navigate("/interview");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [id]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setSending(true);
    try {
      const res = await api.post(`interviews/${id}/message/`, {
        answer,
      });
      setSession(res.data);
      setAnswer("");
    } catch (err) {
      console.log("SEND MESSAGE ERROR:", err.response?.data);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><div className="card">Loading interview...</div></div>;
  }

  return (
    <div className="dashboard premium-dashboard">
      <div className="hero-card">
        <div className="hero-left">
          <h1>Interview Session</h1>
          <p>
            Role: <strong>{session.role}</strong> · Type: <strong>{session.interview_type}</strong>
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/interview-history" className="hero-link-btn">History</Link>
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
        <h2>Conversation</h2>

        <div className="chat-list">
          {session.messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-bubble ${msg.sender === "ai" ? "chat-ai" : "chat-user"}`}
            >
              <p><strong>{msg.sender === "ai" ? "AI" : "You"}:</strong></p>
              <p>{msg.content}</p>

              {msg.sender === "user" && msg.feedback && (
                <div className="feedback-box">
                  <p><strong>Score:</strong> {msg.score}/10</p>
                  <p><strong>Feedback:</strong> {msg.feedback}</p>
                  <p><strong>Improved answer:</strong> {msg.improved_answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {session.is_finished ? (
          <div className="card" style={{ marginTop: 20 }}>
            <h3>Interview Finished</h3>
            <p><strong>Final score:</strong> {session.final_score ?? "—"}/10</p>
            <p>{session.summary}</p>
          </div>
        ) : (
          <form onSubmit={handleSend} style={{ marginTop: 20 }}>
            <div className="field-group">
              <label>Your answer</label>
              <textarea
                rows="5"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
              />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={sending}>
                {sending ? "Sending..." : "Send answer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}