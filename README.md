# Opz Billing Tool

A full-stack subscription billing platform — Chargebee-clone — built with **React JS**, **Spring Boot**, and **MySQL**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS |
| Backend | Spring Boot 3.2.5 (Java 17) |
| Database | MySQL 8.0 |
| Auth | JWT (stateless) |
| DevOps | Docker + Docker Compose |

---

## Getting Started

### Prerequisites
- Node.js 20+
- Java 17+
- Docker (recommended) or local MySQL

### Run with Docker (Recommended)

```bash
docker-compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Run Locally (Manual)

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
./mvnw spring-boot:run
```

---

## Project Structure

```
Opz-Billing-Tool/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── Dockerfile
├── backend/           # Spring Boot app
│   ├── src/main/java/com/billingplatform/
│   └── Dockerfile
├── docs/
│   └── TEAM_GIT_WORKFLOW.md
├── docker-compose.yml
└── CODEOWNERS
```

---

## Team

See [docs/TEAM_GIT_WORKFLOW.md](docs/TEAM_GIT_WORKFLOW.md) for the full team roles and Git workflow guide.

---

## Features

- **Dashboard** — Live MRR, subscription, and revenue metrics with sparkline charts
- **Product Catalog** — Plans, Add-ons, Charges, Coupons, Product Families
- **Settings** — Payment Gateways, Taxes, API Keys, Webhooks, Team Members
- **Auth** — JWT-based login with refresh tokens and brute-force protection
- **Security** — HSTS headers, CSP, BCrypt 12-rounds, role-based access control (`@PreAuthorize`)
