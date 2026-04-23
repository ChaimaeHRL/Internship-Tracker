````md
# Internship Tracker

A modern full-stack web application designed to help students and young professionals manage internship applications, track opportunities, organize follow-ups, and prepare for interviews with an integrated AI simulator.

Built with **React + Vite** for the frontend and **Django REST Framework** for the backend.


# Live Features

- Secure user authentication (JWT)
- Internship application tracking
- Status management (Applied / Interview / Accepted / Rejected)
- Follow-up reminders
- Professional dashboard with analytics
- Dark mode UI
- User profile management
- Profile picture upload
- CV upload / download
- AI Interview Simulator
- Responsive modern interface


# Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS3

## Backend
- Django
- Django REST Framework
- SimpleJWT
- SQLite (development)
- Pillow (media uploads)


# Project Structure

```bash
Internship-Tracker/
│── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api/
│   │   └── main.jsx
│
│── backend/
│   ├── users/
│   ├── applications/
│   ├── interviews/
│   ├── config/
│   └── manage.py
````

# Installation

## 1. Clone repository

```bash
git clone https://github.com/your-username/internship-tracker.git
cd internship-tracker
```

# Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Start backend server

```bash
python manage.py runserver 0.0.0.0:8000
```

Backend runs on:

```bash
http://localhost:8000
```

# Frontend Setup

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

Frontend runs on:

```bash
http://localhost:5173
```

# Environment Variables

Create:

```bash
frontend/.env
```

Example:

```env
VITE_API_URL=http://localhost:8000/api
```

---

# Main Modules

## Authentication

* Register
* Login
* JWT token auth
* Protected routes

## Dashboard

* Total applications
* Pending applications
* Interviews
* Accepted offers
* Rejected offers

## Applications Manager

Users can:

* Add new application
* Edit application
* Delete application
* Set company
* Role
* Application date
* Follow-up date
* Status
* Notes

## Profile Page

Users can update:

* Full name
* Email
* University
* Degree
* Skills
* Bio
* LinkedIn
* GitHub
* CV upload
* Profile picture

## AI Interview Simulator

Simulates interview sessions:

* HR interview
* Technical interview
* Behavioral interview
* English interview

Includes:

* Dynamic questions
* Scoring
* Feedback
* Suggested improved answers


# Screenshots

## Dashboard

![Dashboard](https://github.com/user-attachments/assets/a90403dd-4653-44fc-a80f-29d2c65896da)

Modern analytics dashboard to monitor all internship applications, interviews, accepted offers, pending tasks, and progress metrics.

---

## Profile Page

![Profile](https://github.com/user-attachments/assets/3827adeb-30e2-4108-9549-d3ae04902f71)

Professional user profile with editable personal information, profile picture upload, CV management, academic background, skills, and links.

---

## AI Interview Simulator

![Interview Simulator](https://github.com/user-attachments/assets/f595d976-2487-4c6a-a487-d01114549b57)

Interactive AI-powered mock interview module with multiple interview types, dynamic questions, answer evaluation, scoring, and improvement suggestions.

---

## Interview History (Dark Mode)

![Interview History](https://github.com/user-attachments/assets/67df3394-676a-44b5-ba72-03de18c74ffc)

Clean dark-mode history page showing previous interview sessions, scores, summaries, and progress tracking over time.

## Dashboard

```md
Add screenshot here:
screenshots/dashboard.png
```

## Applications Page

```md
Add screenshot here:
screenshots/applications.png
```

## Profile Page

```md
Add screenshot here:
screenshots/profile.png
```

## AI Interview Simulator

```md
Add screenshot here:
screenshots/interview.png
```


# Example Screenshots Section (GitHub Ready)

```md
## Dashboard

![Dashboard](screenshots/dashboard.png)

## Applications

![Applications](screenshots/applications.png)

## Profile

![Profile](screenshots/profile.png)

## AI Interview Simulator

![Interview](screenshots/interview.png)
```

# API Endpoints

## Auth

```bash
POST /api/token/
POST /api/token/refresh/
POST /api/users/register/
```

## Applications

```bash
GET    /api/applications/
POST   /api/applications/
PUT    /api/applications/:id/
DELETE /api/applications/:id/
```

## Profile

```bash
GET   /api/users/profile/
PATCH /api/users/profile/
```

## Interviews

```bash
POST /api/interviews/start/
POST /api/interviews/answer/
GET  /api/interviews/history/
```


# Future Improvements

* Email reminders
* Google Calendar sync
* AI CV Analyzer
* AI Cover Letter Generator
* Job scraping APIs
* Recruiter portal
* Team collaboration
* Real-time notifications
* Export reports PDF
* Multi-language support

# Deployment

## Frontend

* Vercel
* Netlify

## Backend

* Railway
* Render
* DigitalOcean
* AWS

# Author

Developed by **Chaimae**

# License

MIT License

```
```
