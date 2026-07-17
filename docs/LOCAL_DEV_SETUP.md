# Local Development Setup

This document outlines the standard local development environment setup for all contributors to the Chargebee-clone platform.

## Prerequisites
- **Docker Desktop** installed
- **Node.js + npm** installed
- **Java 17+** and **Maven** installed
- **NOT MySQL** installed natively (explicitly DO NOT install MySQL on your local machine to avoid port 3306 conflicts with the Docker container).

---

## 1. Environment Variables

Create a `.env` file at the root of the repository (next to this `docs` folder) using the provided `.env.example` as a template:

```env
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_USER=billing
MYSQL_PASSWORD=password
```

## 2. Docker Compose (MySQL Only)

The `docker-compose.yml` at the repo root defines the MySQL service.

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: chargebee-clone-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: chargebee_dev
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./docker/mysql/init:/docker-entrypoint-initdb.d
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mysql_data:
```

## 3. Developer Startup Sequence

Every contributor follows this exact sequence each time they start work:

### Step 1: Start MySQL in Docker (one-time per work session)
```bash
docker compose up -d mysql
```
*(Verify it's healthy: run `docker compose ps` — the status should show "healthy")*

### Step 2: Start the backend locally
Open a new terminal, navigate to the `backend` directory, and start Spring Boot with the `local` profile:
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```
*Note: Flyway migrations run automatically against the Dockerized MySQL on backend startup. The backend will fail fast if MySQL isn't reachable.*

### Step 3: Start the frontend locally
Open another terminal, navigate to the `frontend` directory, install dependencies (if not already done), and start the React dev server:
```bash
cd frontend
npm install
npm start
```
*This starts the React dev server (e.g., on `http://localhost:3000` or `http://localhost:5173`) and proxies API calls to the locally running Spring Boot backend on port 8080.*

### Step 4: Stop everything when done
- **Stop frontend:** `Ctrl+C` in its terminal
- **Stop backend:** `Ctrl+C` in its terminal
- **Stop MySQL container (optional — can leave running):** 
  ```bash
  docker compose down
  ```
  *(This stops it but keeps the volume/data. Use `docker compose down -v` only if you intentionally want to wipe local data!)*

---

## Troubleshooting

> [!WARNING]
> **If the backend fails to connect to MySQL**, confirm the container is running and healthy with `docker compose ps` before checking anything else. Do not let the backend hang silently. Ensure port 3306 is not in use by a local native MySQL installation.
