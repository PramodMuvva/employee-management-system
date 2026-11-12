# Employee Management System

A beginner-friendly full-stack CRUD project.

## Stack
- Backend: Java 17+, Spring Boot 4.1.2, Spring Web MVC, Spring Data JPA, Bean Validation
- Database: PostgreSQL
- Frontend: React + Vite

## Project structure
- `backend/` Spring Boot REST API
- `frontend/` React UI

## 1. Create the PostgreSQL database
```sql
CREATE DATABASE employee_db;
```

## 2. Configure backend database credentials
Open `backend/src/main/resources/application.properties` and update:
- `spring.datasource.username`
- `spring.datasource.password`

The defaults are `postgres` / `postgres`. Change them to match your local PostgreSQL setup.
Do not commit real passwords to GitHub.

## 3. Run the backend
You need JDK 17 or newer and Maven (or use the Maven wrapper if you add one from IntelliJ).

From the `backend` directory:
```bash
mvn spring-boot:run
```
API base URL: `http://localhost:8080/api/employees`

## 4. Run the frontend
You need Node.js 20.19+ or 22.12+.
From the `frontend` directory:
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually `http://localhost:5173`).

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/employees` | List employees |
| GET | `/api/employees/{id}` | Get one employee |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |

## Notes
- Hibernate creates/updates the `employees` table from the entity while developing (`ddl-auto=update`).
- Email is unique and required.
- Salary must be positive.
- This is a learning project, not a production deployment. Before production, add authentication/authorization, migrations, stronger error handling, tests, and secret management.
