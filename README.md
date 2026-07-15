# 🏥 MediBook — Medical Appointment System

A role-based medical appointment booking platform built with Django REST Framework and React, enabling patients to discover doctors, check real-time slot availability, and book appointments — while giving doctors and admins dedicated portals to manage their side of the workflow.

---

## 📖 Table of Contents

- [Problem](#-problem)
- [Solution](#-solution)
- [Target Market](#-target-market)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [API Documentation](#-api-documentation)
- [Team](#-team)

---

## 🧩 Problem

Booking a doctor's appointment in most clinics and small healthcare networks still relies on phone calls, walk-ins, or fragmented paper-based systems. This creates several pain points:

| Pain Point | Impact |
|---|---|
| No real-time visibility into doctor availability | Patients call repeatedly or show up to find no open slots |
| Manual, phone-based booking | Time-consuming for staff, error-prone, no audit trail |
| No unified view for doctors | Doctors can't easily manage their own schedule or see upcoming patients |
| No centralized admin oversight | Clinic admins can't manage doctors, patients, or appointments from one place |
| Double bookings & scheduling conflicts | Manual processes are prone to human error |

## 💡 Solution

**MediBook** is a full-stack web application that digitizes the entire appointment lifecycle through three dedicated, role-based portals:

| Role | Capabilities |
|---|---|
| **Patient** | Register/login, browse doctors, view real-time available slots, book/cancel appointments, view appointment history, manage payments |
| **Doctor** | Manage personal availability/slots, view upcoming appointments, manage patient bookings |
| **Admin** | Oversee all doctors, patients, and appointments; manage system-wide data |

Core features include:
- 🔐 **JWT-based authentication** with role-based access control
- 📅 **Slot availability engine** preventing double bookings and scoping conflicts
- 💳 **Payment flow** integrated into the booking process
- 📊 **Dedicated dashboards** per role (Admin, Doctor, Patient)
- 🎨 **Consistent design system** applied across the full patient journey

## 🎯 Target Market

| Segment | Description |
|---|---|
| Small to mid-sized clinics | Independent practices without an existing digital booking system |
| Multi-doctor healthcare centers | Facilities needing centralized scheduling across several doctors |
| Telemedicine startups (MVP stage) | Early-stage products needing a solid booking/auth foundation to extend |
| Academic / portfolio use | Demonstrates a production-style full-stack healthcare workflow |

## 🏗 Architecture

The system follows a **decoupled client-server architecture**: a Django REST Framework API backend exposing versioned, role-protected endpoints, consumed by a React (Vite) single-page frontend.

```
┌─────────────────────┐         REST API (JWT)         ┌──────────────────────┐
│                      │  ───────────────────────────▶  │                      │
│   React + Vite SPA   │                                │  Django REST         │
│   (Redux state)      │  ◀───────────────────────────  │  Framework Backend   │
│                      │         JSON responses          │                      │
└─────────────────────┘                                 └──────────┬───────────┘
                                                                     │
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │   PostgreSQL DB      │
                                                          └──────────────────────┘
```

**Backend (Django apps — domain-driven):**

| App | Responsibility |
|---|---|
| `medical_core` | Project configuration, settings, URL routing |
| `accounts` | Authentication, JWT issuance, user roles (Admin/Doctor/Patient) |
| `doctors` | Doctor profiles and management |
| `patients` | Patient profiles and management |
| `availability` | Doctor slot creation and availability logic |
| `appointments` | Appointment booking, scoping, conflict prevention |
| `notifications` | System notifications |

**Frontend (React):**
- Role-based routing to Admin / Doctor / Patient portals
- Redux for global state (auth, bookings)
- Shared design system/components across all 13 pages

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Backend Framework** | Django 6.0, Django REST Framework |
| **Authentication** | djangorestframework-simplejwt (JWT), PyJWT |
| **Database** | PostgreSQL (via `psycopg2-binary`) |
| **API Tooling** | drf-spectacular (OpenAPI schema/docs), django-filter, django-cors-headers |
| **Config Management** | python-decouple (`.env` based settings) |
| **Frontend Framework** | React (Vite) |
| **State Management** | Redux |
| **Frontend Languages** | JavaScript, CSS, HTML |

## 📁 Project Structure

```
Medical-Project/
├── accounts/            # Auth, JWT, user roles
├── appointments/         # Booking logic & appointment models
├── availability/         # Doctor slot & availability management
├── doctors/               # Doctor profile management
├── patients/              # Patient profile management
├── notifications/         # Notification system
├── medical_core/          # Django project settings & root URLs
├── frontend/              # React (Vite) single-page application
├── manage.py
├── requirements.txt
└── .gitignore
```

## 🚀 Getting Started

### Backend Setup

**Prerequisites:** Python 3.11+, PostgreSQL

```bash
# 1. Clone the repository
git clone https://github.com/MariamAsall/Medical-Project.git
cd Medical-Project

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment variables
# Create a .env file in the project root (used via python-decouple), e.g.:
# SECRET_KEY=your-secret-key
# DEBUG=True
# DB_NAME=medical_db
# DB_USER=postgres
# DB_PASSWORD=your-password
# DB_HOST=localhost
# DB_PORT=5432

# 5. Run migrations
python manage.py migrate

# 6. Create a superuser (for admin access)
python manage.py createsuperuser

# 7. Run the development server
python manage.py runserver
```

The API will be available at `http://localhost:8000/`.

### Frontend Setup

**Prerequisites:** Node.js 18+

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Configure API base URL
# Create a .env file in /frontend pointing to your backend, e.g.:
# VITE_API_BASE_URL=http://localhost:8000/api

# 4. Run the development server
npm run dev
```

The app will be available at `http://localhost:5173/` (default Vite port).

## 📑 API Documentation

The backend uses **drf-spectacular** for OpenAPI schema generation. Once the server is running, API docs are typically available at:

- Schema: `http://localhost:8000/api/schema/`
- Swagger UI: `http://localhost:8000/api/docs/`

*(Exact paths depend on the URL configuration in `medical_core`.)*

## 👥 Team

Built as a 5-person capstone project. All members collaborated across the full stack — backend, frontend, and integration.

| Name | Contribution |
|---|---|
| **Mariam Asal ** | Project Lead · Contributed across backend & frontend |
| **Aml Osama** | Contributed across backend & frontend |
| **Nada Ayman** | Contributed across backend & frontend |
| **Ahmed Samy** | Contributed across backend & frontend |
| **Mohamed Khaled** | Contributed across backend & frontend |
