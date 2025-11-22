<div align="center">

# CAPTURE THE FLAG 2025

_Frontend Interface for MainFrame Student Society's CTF Competition_

![Last Commit](https://img.shields.io/github/last-commit/Mainframe-Student-Society/capturetheflag2025?label=last%20commit&color=blue&style=flat-square)
![TypeScript](https://img.shields.io/badge/typescript-100%25-blue?style=flat-square)
![React](https://img.shields.io/badge/react-19.2.0-blue?style=flat-square&logo=react)

**Built with modern web technologies:**

![React](https://img.shields.io/badge/-React-blue?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-blue?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-purple?style=flat-square&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-TailwindCSS-teal?style=flat-square&logo=tailwindcss&logoColor=white)
![ESLint](https://img.shields.io/badge/-ESLint-purple?style=flat-square&logo=eslint&logoColor=white)

</div>

## Overview

The frontend interface for MainFrame Student Society's Capture The Flag 2025 competition.

## Technology Stack

- **Frontend Framework:** React 19, TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Code Quality:** ESLint, React Compiler
- **Development:** Hot Module Replacement, Fast Refresh

## Setup

### Prerequisites

- Node.js 18+ and pnpm package manager
- Git for version control

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Mainframe-Student-Society/capturetheflag2025.git
   ```

2. **Navigate to Frontend Directory**

   ```bash
   cd capturetheflag2025/frontend
   ```

3. **Install Dependencies**

   ```bash
   pnpm install
   ```

4. **Start Development Server**

   ```bash
   pnpm dev
   ```

5. **Verify Installation**
   - Open browser: http://localhost:5173
   - You should see the CTF welcome page

### Build for Production

```bash
# Create production build
pnpm build

# Preview production build locally
pnpm preview
```

### Code Quality

```bash
# Run ESLint
pnpm lint

# Type checking
pnpm build
```

## Environment Variables

Create .env.local:

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
NEXT_PUBLIC_APP_NAME=CaptureTheFlag2025
```

Restart dev server after changes.

## Project Structure (frontend)

```
frontend/
  src/
    components/
    pages/
    lib/
      api/
    hooks/
    styles/
  public/
```

## Available Scripts

```bash
pnpm dev        # start development
pnpm build      # production build
pnpm preview    # preview dist
pnpm lint       # eslint checks
pnpm format     # (if configured) run formatter
```

## Authentication Workflow

- Login stores authToken + tokenExpiry + userData in localStorage.
- Auto-expiry handled client-side; expired tokens cleared on access.
- Use challengesApi.isUserAuthenticated() before protected calls.

## Deployment

1. Build: pnpm build
2. Serve dist/ via static hosting or edge CDN.
3. Ensure NEXT_PUBLIC_API_URL points to production backend.
4. Set caching headers for static assets; disable caching for auth responses.

## Performance Notes

- Fetch wrappers implement timeout + retry for resilience.
- Pagination supported via getAllChallenges(filters.limit, filters.offset).

## Contributing Standards

- Small PRs; reference issue ID.
- Run pnpm lint before pushing.
- Keep cognitive complexity low (Sonar warnings).

## License

MIT (unless superseded by organization policy).

## Roadmap

- Add challenge tagging UI
- Add user profile badges
- Integrate real-time scoreboard updates

## Contributing

We welcome contributions to improve the CTF platform! Please follow these steps:

### 1. Report Issues

- Create a [new issue](https://github.com/Mainframe-Student-Society/capturetheflag2025/issues)
- Include detailed steps to reproduce any bugs
- Specify your browser and operating system
- Add screenshots if relevant

### 2. Suggest Features

- Use our issue tracker for feature requests
- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider security implications for CTF features
