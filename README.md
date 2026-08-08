# CourtSpot

A court booking platform where players find and book sports courts, and owners list and manage their facilities.

## Tech Stack

- **Framework** — Next.js 16 (App Router), React 19, TypeScript
- **Database** — MongoDB via Mongoose
- **Auth** — NextAuth v4 (JWT, Credentials provider)
- **Styling** — Tailwind CSS v4 with custom design tokens
- **Validation** — Zod + React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- A running MongoDB instance

### Environment variables

Create a `.env` file at the project root:

```env
MONGODB_URI=your_mongodb_connection_string
AUTH_SECRET=your_nextauth_secret
```

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Seed the database

```bash
npm run seed
```

## Project Structure

```
src/
├── app/                    # Next.js routes
│   ├── (auth)/             # Login, register pages
│   ├── (dashboard)/        # Booker dashboard
│   ├── (owner)/            # Owner dashboard and court management
│   ├── (public)/           # Court listings and detail pages
│   └── api/auth/           # NextAuth route handler
├── features/               # Feature modules
│   ├── auth/
│   ├── booking/
│   ├── listing/
│   ├── review/
│   └── users/
├── shared/
│   ├── components/ui/      # Shared primitive components
│   └── libs/               # MongoDB connection
├── auth.ts                 # NextAuth config
└── proxy.ts                # Route protection middleware (rename to middleware.ts)
```

Each feature follows the structure: `actions/`, `components/`, `hooks/`, `schemas/`, `server/`, `constants/`, `types.ts`, `index.ts`.

## User Roles

| Role | Access |
|------|--------|
| `booker` | Browse courts, make bookings, leave reviews |
| `owner` | List and manage courts, view bookings and earnings |

A user can hold both roles simultaneously.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run seed` | Seed the database |
