import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Profile({ theme, setTheme }) {
  const [profile, setProfile] = useState({
    id: "",
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    bio: "",
    phone: "",
    location: "",
    university: "",
    linkedin: "",
    github: "",
    profile_image_url: "",
    cv_url: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await api.get("users/profile/");
      setProfile(res.data);
    } catch (err) {
      console.log("PROFILE ERROR:", err.response?.data);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("email", profile.email || "");
      formData.append("first_name", profile.first_name || "");
      formData.append("last_name", profile.last_name || "");
      formData.append("bio", profile.bio || "");
      formData.append("phone", profile.phone || "");
      formData.append("location", profile.location || "");
      formData.append("university", profile.university || "");
      formData.append("linkedin", profile.linkedin || "");
      formData.append("github", profile.github || "");

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      if (cvFile) {
        formData.append("cv", cvFile);
      }

      const res = await api.patch("users/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data);
      setMessage("Profile updated successfully.");
      setProfileImage(null);
      setCvFile(null);
    } catch (err) {
      console.log("PROFILE UPDATE ERROR:", err.response?.data);
      setMessage("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="card">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="dashboard premium-dashboard">
      <div className="hero-card">
        <div className="hero-left">
          <h1>My Profile</h1>
          <p>
            Manage your professional identity, contact details, CV, and personal links.
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/dashboard" className="hero-link-btn">
            Dashboard
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

      <div className="profile-grid">
        <div className="card profile-summary-card">
          {profile.profile_image_url ? (
            <img
              src={profile.profile_image_url}
              alt="Profile"
              className="profile-photo"
            />
          ) : (
            <div className="profile-avatar">
              {profile.username ? profile.username[0].toUpperCase() : "U"}
            </div>
          )}

          <h2>{profile.first_name || profile.last_name
            ? `${profile.first_name} ${profile.last_name}`.trim()
            : profile.username}
          </h2>

          <p className="profile-muted">@{profile.username}</p>
          <p className="profile-muted">{profile.email || "No email provided"}</p>

          <div className="profile-meta">
            <div>
              <span>Location</span>
              <strong>{profile.location || "—"}</strong>
            </div>
            <div>
              <span>University</span>
              <strong>{profile.university || "—"}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{profile.phone || "—"}</strong>
            </div>
          </div>

            {profile.cv_url && (
            <div style={{ display: "grid", gap: "10px", marginTop: "18px" }}>
                <a
                href={profile.cv_url}
                target="_blank"
                rel="noreferrer"
                className="hero-link-btn"
                style={{ width: "100%" }}
                >
                View CV
                </a>

                <a
                href={profile.cv_url}
                download
                className="hero-link-btn"
                style={{ width: "100%" }}
                >
                Download CV
                </a>
            </div>
            )}
        </div>

        <form className="card premium-form" onSubmit={handleSave}>
          <div className="section-header">
            <div>
              <h2>Edit Profile</h2>
              <p className="section-subtitle">
                Keep your recruiter-facing profile complete and polished.
              </p>
            </div>
          </div>

          <div className="form-two-cols">
            <div className="field-group">
              <label>Username</label>
              <input type="text" value={profile.username} disabled />
            </div>

            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={profile.email || ""}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="form-two-cols">
            <div className="field-group">
              <label>First name</label>
              <input
                type="text"
                name="first_name"
                value={profile.first_name || ""}
                onChange={handleChange}
                placeholder="First name"
              />
            </div>

            <div className="field-group">
              <label>Last name</label>
              <input
                type="text"
                name="last_name"
                value={profile.last_name || ""}
                onChange={handleChange}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-two-cols">
            <div className="field-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profile.phone || ""}
                onChange={handleChange}
                placeholder="+212 ..."
              />
            </div>

            <div className="field-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={profile.location || ""}
                onChange={handleChange}
                placeholder="Casablanca, Morocco"
              />
            </div>
          </div>

          <div className="form-two-cols">
            <div className="field-group">
              <label>University</label>
              <input
                type="text"
                name="university"
                value={profile.university || ""}
                onChange={handleChange}
                placeholder="Your university"
              />
            </div>

            <div className="field-group">
              <label>LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={profile.linkedin || ""}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <div className="field-group">
            <label>GitHub</label>
            <input
              type="url"
              name="github"
              value={profile.github || ""}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="field-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              placeholder="Short professional summary..."
              rows="5"
            />
          </div>

          <div className="form-two-cols">
            <div className="field-group">
              <label>Profile image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
            </div>

            <div className="field-group">
              <label>CV / Resume</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setCvFile(e.target.files[0])}
              />
            </div>
          </div>

          {message && (
            <p className={message.includes("success") ? "success-text" : "error"}>
              {message}
            </p>
          )}

          <div className="form-actions">
            <button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}