# OwnWebify - Web Development Service Platform

A full-stack web development service platform where clients can submit website creation project requests, track project status, and communicate with you. Built with Next.js, Prisma, and Tailwind CSS.

## Features

- **Public Pages**: Landing page, services/pricing, portfolio with case studies, about page
- **Project Intake Form**: Multi-step form for clients to submit project requests
- **Client Dashboard**: Track project status, accept/reject quotes, message thread
- **Admin Panel**: Manage projects, update statuses, send quotes, portfolio CRUD, client management
- **Email Notifications**: Automated emails for status updates, new quotes, and messages
- **Authentication**: Secure login for admin and clients via NextAuth.js

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js v4
- **Email**: Resend
- **Validation**: Zod + React Hook Form

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or cloud)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database URL and API keys.

3. Generate Prisma client:
   ```bash
   npm run db:generate
   ```

4. Push the schema to your database:
   ```bash
   npm run db:push
   ```

5. Seed the database with demo data:
   ```bash
   npm run db:seed
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

### Admin Access

After seeding, log in with the admin email configured in `ADMIN_EMAIL` environment variable.

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public pages (home, services, portfolio, about, hire, login)
│   ├── (dashboard)/       # Client dashboard
│   ├── (admin)/           # Admin panel
│   └── api/               # API routes
├── components/
│   ├── ui/                # Base UI components (Button, Card, Input, etc.)
│   ├── forms/             # Form components (StatusUpdate, QuoteForm, QuoteResponse)
│   ├── layout/            # Layout components (Header, Footer, Sidebars)
│   └── shared/            # Shared components (MessageThread)
├── lib/                   # Utilities (prisma, auth, email, validations)
└── types/                 # TypeScript type definitions
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with demo data |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption |
| `NEXTAUTH_URL` | Base URL of your app |
| `RESEND_API_KEY` | API key for Resend email service |
| `ADMIN_EMAIL` | Email to receive admin notifications |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |

## Deployment (Vercel + Namecheap)

### 1. Deploy to Vercel

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Next.js — no config needed
4. Set the following environment variables in Vercel dashboard (Settings > Environment Variables):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon/Supabase PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://ownwebify.com` |
| `ADMIN_EMAIL` | `admin@ownwebify.com` |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) dashboard |
| `GOOGLE_CLIENT_ID` | From [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console |
| `GITHUB_CLIENT_ID` | From [GitHub Developer Settings](https://github.com/settings/developers) |
| `GITHUB_CLIENT_SECRET` | From GitHub Developer Settings |

5. Deploy. Vercel will build and serve the app automatically.

### 2. Connect Custom Domain (Namecheap DNS)

After deploying to Vercel:

1. In **Vercel**: Go to your project > Settings > Domains > Add `ownwebify.com` and `www.ownwebify.com`
2. In **Namecheap**: Go to Domain List > Manage > Advanced DNS, and add:

| Type | Host | Value |
|------|------|-------|
| A Record | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

3. Wait 5-30 minutes for DNS propagation
4. Vercel automatically provisions SSL certificates

### 3. Post-Deployment

After the domain is connected:

```bash
# Run database migrations on your production database
npx prisma db push

# Seed with initial admin user
npx prisma db seed
```

The admin login will be: `admin@ownwebify.com` / `admin123` (change the password immediately after first login).
