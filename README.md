<div align="center">

# MaSS CAPTURE THE FLAG (CTF) PLATFORM

![Last Commit](https://img.shields.io/github/last-commit/Mainframe-Student-Society/capturetheflag2025?label=last%20commit&color=blue&style=flat-square)
![Python](https://img.shields.io/badge/python-backend-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/typescript-frontend-blue?style=flat-square)
![React](https://img.shields.io/badge/react-19-blue?style=flat-square)

**Backend Technologies:**

![Python](https://img.shields.io/badge/-Python-blue?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/-Flask-black?style=flat-square&logo=flask&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/-SQLAlchemy-red?style=flat-square&logo=sqlalchemy&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-blue?style=flat-square&logo=postgresql&logoColor=white)
![SQLite](https://img.shields.io/badge/-SQLite-blue?style=flat-square&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-black?style=flat-square&logo=jsonwebtokens&logoColor=white)

**Frontend Technologies:**

![React](https://img.shields.io/badge/-React-blue?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-purple?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-teal?style=flat-square&logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-yellow?style=flat-square&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/-HTML5-orange?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-blue?style=flat-square&logo=css3&logoColor=white)

</div>

## About

This repository contains the source code and resources for the MaSS Capture The Flag (CTF) Platform.

## Technology Stack

- **Backend:** Python 3.x, Flask, SQLAlchemy, PostgreSQL/SQLite
- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Authentication:** JWT tokens, bcrypt password hashing
- **Infrastructure:** Gunicorn WSGI server, Flask-Migrate for database migrations
- **Development:** Flask-CORS for cross-origin requests, python-dotenv for environment management

## Setup

### Prerequisites

- Python 3.8 or higher
- Node.js 18 or higher (for React + TypeScript frontend)
- pnpm, npm, or yarn (pnpm recommended)
- PostgreSQL (optional, SQLite used by default)

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Mainframe-Student-Society/capturetheflag2025.git
   ```

2. **Navigate to Project**

   ```bash
   cd capturetheflag2025
   ```

3. **Setup Backend**

   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   pip install -r requirements.txt
   ```

4. **Configure Environment**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your database URL and JWT secret:

   ```
   DB_URL=sqlite:///ctf_platform.db
   JWT_SECRET_KEY=your-super-secret-key-here
   JWT_ACCESS_TOKEN_EXPIRES=86400
   ```

5. **Initialize Database**

   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

6. **Start Backend Server**

   ```bash
   python index.py
   ```

7. **Setup Frontend**

   ```bash
   cd ../frontend
   pnpm install
   pnpm dev
   ```

8. **Verify Installation**
   - Backend API: http://localhost:5000
   - Frontend (Vite): http://localhost:5173
   - API Documentation: http://localhost:5000/swagger

## API Documentation

- **Postman Collection**: [View Documentation](https://documenter.getpostman.com/view/33365941/2sB3WwrxkL)

## Development

### Running in Development Mode

1. **Backend Development**

   ```bash
   cd backend
   source venv/bin/activate
   export FLASK_ENV=development
   python index.py
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   pnpm dev  # or npm run dev
   ```
   This starts the Vite development server with React hot reload and TypeScript compilation

### Database Migrations

When making changes to database models:

```bash
cd backend
flask db migrate -m "Description of changes"
flask db upgrade
```
