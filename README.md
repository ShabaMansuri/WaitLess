# WaitLess – Digital Queue Management System

> **Don't wait. Know your turn.**

WaitLess is a digital queue management system that helps citizens get a digital token, track their position in a service queue, view an estimated waiting time, and leave the queue when needed. Staff can manage the queue from a dedicated dashboard.

The project was built as a practical hackathon solution for reducing unnecessary physical waiting in public-service environments such as government offices and hospitals.

---

## Table of Contents

- [Problem](#problem)
- [Solution](#solution)
- [Features](#features)
- [How It Works](#how-it-works)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [OpenSearch Database](#opensearch-database)
- [API Reference](#api-reference)
- [Queue States](#queue-states)
- [ETA Calculation](#eta-calculation)
- [Staff Demo Login](#staff-demo-login)
- [AWS / First Commit](#aws--first-commit)
- [Testing the Complete Flow](#testing-the-complete-flow)
- [Demo Video](#demo-video)
- [Future Improvements](#future-improvements)
- [AI Coding Tool](#ai-coding-tool)
- [Project Status](#project-status)

---

## Problem

Traditional queues create unnecessary waiting because citizens often do not know:

- How many people are ahead of them
- When their turn is likely to come
- Whether they can temporarily leave the queue
- Whether their token is currently being served

At the same time, staff need a simple way to call, complete, skip, and monitor tokens.

This can result in crowded waiting areas and a poor service experience.

---

## Solution

WaitLess converts the physical queue into a digital, trackable queue.

A citizen can:

1. Select a service location.
2. Select the required service.
3. Enter their details.
4. Generate a digital token.
5. Track the current queue.
6. View the number of people ahead.
7. View an estimated waiting time.
8. Leave the queue while their token is still waiting.

Staff can use the staff dashboard to:

- View the current serving token.
- Call the next waiting token.
- Complete a serving token.
- Skip a token.
- Monitor waiting citizens.

---

## Features

### Citizen Features

- Language selection
- Government Office / Government Hospital selection
- Service selection
- Citizen name and mobile number input
- Digital token generation
- Token display
- Current serving token
- Queue position
- People waiting
- Estimated waiting time
- Leave-queue functionality
- Automatic queue refresh
- Active token persistence using browser local storage

### Staff Features

- Staff login
- Current serving token display
- Waiting queue display
- Call next token
- Complete token
- Skip token
- Service-time tracking
- Queue refresh

### Backend Features

- FastAPI REST API
- CORS configuration for local frontend
- Persistent token storage in OpenSearch
- Automatic OpenSearch index creation
- Token status management
- Queue management
- ETA calculation
- Service-time tracking

---

## How It Works

```text
                    WAITLESS
                       │
          ┌────────────┴────────────┐
          │                         │
       CITIZEN                    STAFF
          │                         │
          ▼                         ▼
   Select Service              Staff Login
          │                         │
          ▼                         ▼
   Enter Details              View Queue
          │                         │
          ▼                         ▼
   Generate Token             Call Next
          │                         │
          └──────────┬──────────────┘
                     ▼
               FastAPI Backend
                     │
                     ▼
                OpenSearch
                     │
                     ▼
              Queue + ETA Data
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Python, FastAPI |
| API Server | Uvicorn |
| Database / Search | OpenSearch |
| Database Client | `opensearch-py` |
| Local Infrastructure | Docker / Docker Desktop |
| Frontend Development Server | VS Code Live Server |

### OpenSearch

The application uses a local OpenSearch instance running in Docker.

The current database index is:

```text
waitless_tokens
```

No paid cloud database is required for the current local hackathon implementation.

---

## Architecture

```text
┌───────────────────────────────┐
│         Frontend              │
│  HTML + CSS + JavaScript      │
│                               │
│  Citizen UI + Staff Dashboard │
└───────────────┬───────────────┘
                │ HTTP / JSON
                ▼
┌───────────────────────────────┐
│         FastAPI               │
│                               │
│  Token Management             │
│  Queue Management             │
│  ETA Calculation              │
│  Staff Operations             │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          OpenSearch           │
│                               │
│      waitless_tokens          │
│                               │
│  Token documents + status     │
└───────────────────────────────┘
```

---

## Project Structure

```text
WaitLess/
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── eta.py
│   ├── queue_manager.py
│   ├── staff.py
│   ├── token_manager.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
└── README.md
```

> `token_manager_backup.py`, Python cache files, and other local development artifacts should not be committed as part of the application source.

---

# Getting Started

## Prerequisites

Install the following before running WaitLess:

- Python
- Docker Desktop
- A modern web browser
- VS Code
- VS Code Live Server extension

---

## 1. Clone the Repository

```powershell
git clone https://github.com/ShabaMansuri/WaitLess.git
cd WaitLess
```

---

## 2. Start OpenSearch

WaitLess uses OpenSearch locally through Docker.

For a fresh setup:

```powershell
docker run -d -p 9200:9200 -p 9600:9600 -e "discovery.type=single-node" -e "DISABLE_SECURITY_PLUGIN=true" --name opensearch opensearchproject/opensearch:latest
```

Check that the container is running:

```powershell
docker ps
```

Then verify OpenSearch:

```powershell
curl.exe http://localhost:9200
```

You should receive an OpenSearch JSON response.

### If the container already exists

Do not create another container with the same name. Start the existing one:

```powershell
docker start opensearch
```

Then verify:

```powershell
curl.exe http://localhost:9200
```

---

## 3. Install Backend Dependencies

Open PowerShell in the backend directory:

```powershell
cd backend
```

Install the required packages:

```powershell
pip install -r requirements.txt
```

The current requirements are:

```text
fastapi
uvicorn
opensearch-py
```

---

## 4. Start the Backend

Run Uvicorn from the `backend` directory:

```powershell
uvicorn app:app --reload
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

You can check the backend:

```text
http://127.0.0.1:8000/
```

Expected response:

```json
{
  "message": "WaitLess Backend is running"
}
```

FastAPI also provides API documentation at:

```text
http://127.0.0.1:8000/docs
```

---

## 5. Start the Frontend

Do **not** open `frontend/index.html` through port `8000`.

The backend and frontend use different local servers.

Open the project in VS Code and start `frontend/index.html` using **Live Server**.

The frontend will normally be available at:

```text
http://127.0.0.1:5500/index.html
```

The frontend JavaScript is configured to communicate with:

```text
http://127.0.0.1:8000
```

---

# OpenSearch Database

WaitLess automatically creates the OpenSearch index:

```text
waitless_tokens
```

when the backend starts if the index does not already exist.

Each token is stored as a document containing fields such as:

```text
token
name
mobile
service
status
start_time
end_time
```

Example token lifecycle:

```text
waiting
   │
   ▼
serving
   │
   ▼
completed
```

Other possible transitions include:

```text
waiting → skipped
waiting → left
serving → skipped
```

### Check stored tokens

With OpenSearch running:

```powershell
curl.exe "http://localhost:9200/waitless_tokens/_search?pretty"
```

---

# API Reference

Base URL:

```text
http://127.0.0.1:8000
```

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Backend health/message |
| `POST` | `/token` | Create a token |
| `GET` | `/tokens` | Get all tokens |
| `GET` | `/token/{token}` | Get one token |
| `GET` | `/queue` | Get current queue |
| `GET` | `/eta/{token}` | Get token ETA |
| `POST` | `/queue/next` | Call next waiting token |
| `POST` | `/queue/complete?token={token}` | Complete a serving token |
| `POST` | `/queue/skip?token={token}` | Skip a token |
| `POST` | `/queue/leave?token={token}` | Leave the queue |

### Create Token

Request:

```http
POST /token
Content-Type: application/json
```

Example body:

```json
{
  "name": "Citizen",
  "mobile": "9876543210",
  "service": "Certificate"
}
```

---

# Queue States

WaitLess uses the following token states:

| Status | Meaning |
|---|---|
| `waiting` | Token is waiting in the queue |
| `serving` | Staff is currently serving the citizen |
| `completed` | Service has been completed |
| `skipped` | Token was skipped |
| `left` | Citizen left the queue |

---

# ETA Calculation

WaitLess estimates waiting time using queue information and observed service duration.

The calculation considers:

- Number of waiting tokens ahead
- Whether another token is currently being served
- Average service time from completed services

When there is not enough service history, the application uses a default service-time estimate.

After services are completed, their durations are recorded and can contribute to future ETA calculations.

This provides citizens with an estimated wait rather than only a token position.

---

# Staff Demo Login

The current local demo version uses:

```text
Password: staff123
```

This credential is intended **only for the local hackathon demo** and should not be treated as production authentication.

---

# AWS / First Commit

WaitLess was developed for the **First Commit by AWS × WeMakeDevs** hackathon.

The project uses **OpenSearch**, which is included in the First Commit Build It Data & Search technology stack.

The current implementation runs OpenSearch locally through Docker rather than using the paid Amazon OpenSearch Service.

This keeps the current hackathon setup local and avoids requiring paid cloud infrastructure.

For the final hackathon submission, the demo should clearly show the project working and explain where OpenSearch fits into the architecture.

---

# Testing the Complete Flow

A complete local test can be performed as follows:

### Citizen

1. Start OpenSearch.
2. Start the FastAPI backend.
3. Start the frontend using Live Server.
4. Open WaitLess.
5. Select a location.
6. Select a service.
7. Enter citizen details.
8. Generate a token.
9. Confirm that the token appears in the queue.
10. Check the ETA and queue position.

### Staff

1. Open the staff panel.
2. Enter the demo password.
3. Confirm the waiting token is visible.
4. Call the next token.
5. Confirm that the token changes to `serving`.
6. Complete or skip the token.
7. Confirm the queue updates.

### Database

Verify that the token exists in OpenSearch:

```powershell
curl.exe "http://localhost:9200/waitless_tokens/_search?pretty"
```

---

# Demo Video

The final demo video shows the citizen flow, queue tracking, ETA, staff queue management, and the project's OpenSearch/AWS integration.

**YouTube Demo:** https://www.youtube.com/watch?v=bY49I1kwE-s

**Video duration:** 2 minutes 24 seconds

---

# Future Improvements

Possible future improvements include:

- Multiple counters and service desks
- Separate queues for different services
- More advanced ETA prediction
- SMS / messaging notifications
- QR-based token access
- Accessibility improvements
- Queue analytics
- Multi-location support
- Role-based authentication
- Cloud deployment when required

---

# AI Coding Tool

AI-assisted development was used during the project for development guidance, debugging, code assistance, integration support, and documentation.

**Tool used:**

- ChatGPT

---

# Project Status

### Current implementation

- [x] Frontend UI
- [x] Citizen token generation
- [x] FastAPI backend
- [x] Queue management
- [x] ETA calculation
- [x] Staff dashboard
- [x] Complete / Skip / Leave queue operations
- [x] OpenSearch integration
- [x] Persistent token storage
- [x] Frontend ↔ backend integration
- [x] End-to-end local testing

---

## Project Links

- **GitHub:** https://github.com/ShabaMansuri/WaitLess
- **Demo Video:** https://www.youtube.com/watch?v=bY49I1kwE-s

---

## Built with ❤️ for First Commit

**WaitLess – Digital Queue Management System**

> **Don't wait. Know your turn.**

## Team Contributions

### Shaba Mansuri - Team Leader
- OpenSearch database integration and persistent token storage
- Backend modularization and final backend integration
- Frontend to backend integration
- Final testing, debugging, and project integration
- Final documentation and submission preparation

### Safa Mansuri - Team Member
- Initial FastAPI backend development
- Initial API endpoint implementation
- Queue management and ETA logic
- Token serving, completion, skip, and leave-queue API logic
- API testing during the initial backend development

### Yasira Vora - Team Member
- Contributed to the frontend development and testing of the WaitLess user interface, including user-facing queue interactions and usability testing.

> The contributions above are based on the work actually completed during the project.
