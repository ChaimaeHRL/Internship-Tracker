#  Internship Tracker

Internship Tracker is a full-stack web application built to help students and young professionals manage their internship and job applications in an organized and efficient way.

Instead of tracking applications manually in spreadsheets or notes, users can centralize everything in one modern dashboard: applications, statuses, deadlines, follow-ups, profile information, and documents.

This project demonstrates practical skills in **full-stack development, REST API design, authentication, database management, frontend integration, and user experience design**.

---

##  Features

###  Authentication

- User registration
- Secure login with JWT authentication
- Persistent sessions
- Logout functionality

###  Dashboard

Track recruitment progress with live statistics:

- Total applications
- Active applications
- Interviews
- Offers
- Rejections
- Interview success rate

###  Application Management

Users can create, update, and delete applications with:

- Company name
- Role / Position
- Application date
- Follow-up date
- Deadline
- Source platform
- Current status
- Personal notes

###  Smart Validation

- Application date must be before follow-up date
- Application date must be before deadline
- Required fields validation
- Authenticated access only

###  Profile Management

Each user has a professional profile page with:

- Username
- Email
- First name / Last name
- Phone number
- Location
- University
- LinkedIn link
- GitHub link
- Short bio
- Profile picture upload
- CV upload / download

###  Modern UI

- Responsive design
- Dark mode
- Professional layout
- Clean user experience
- Mobile friendly

---

##  Tech Stack

### Frontend

- React.js
- Vite
- React Router DOM
- Axios
- CSS3

### Backend

- Django
- Django REST Framework
- JWT Authentication (SimpleJWT)
- django-cors-headers

### Database

- SQLite (development)

---

##  Project Structure

```bash
Internship-Tracker/
│
├── backend/
│   ├── applications/
│   ├── users/
│   ├── config/
│   ├── media/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│
└── README.md
````

---

##  Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/internship-tracker.git
cd internship-tracker
```

---

##  Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### Start backend server

```bash
python manage.py runserver
```

Backend URL:

```bash
http://127.0.0.1:8000/
```

---

##  Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```bash
http://localhost:5173/
```

---

##  API Endpoints

### Authentication

```http
POST /api/users/register/
POST /api/token/
POST /api/token/refresh/
```

### Applications

```http
GET    /api/applications/
POST   /api/applications/
PUT    /api/applications/{id}/
DELETE /api/applications/{id}/
```

### Profile

```http
GET   /api/users/profile/
PATCH /api/users/profile/
```

---

##  Screenshots

You can add screenshots here after deployment:

* Login page
* Dashboard
* Applications manager
* Profile page
* Dark mode UI

---

##  Future Improvements

* Email reminders
* Calendar integration
* Advanced analytics charts
* Kanban board for applications
* Resume scoring AI
* Notifications system
* Multi-language support

---

##  Author

**Chaimae EL HAROUAL**

Computer Science Student passionate about software engineering, web development, and building practical digital solutions.

---

##  License

This project is open for educational and portfolio purposes.

---

##  Support

If you like this project, feel free to star the repository and share feedback.

