# Ten Point Property Management

A vacation rental property management platform built with Next.js 14, Supabase, and TypeScript.

## Features (Planned)

- Multi-property calendar dashboard
- Airbnb/VRBO iCal sync
- Guest CRM with communication history
- Magic link guest portal
- Maintenance scheduling
- Revenue tracking & analytics
- Email (Resend) & SMS (Twilio) notifications

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account (free tier works)
- (Optional) Resend account for emails
- (Optional) Twilio account for SMS

### 1. Install Dependencies

```bash
cd ten-point-property-management
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API and copy your:
   - Project URL
   - anon/public key
3. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Create Database Tables

1. Go to your Supabase dashboard > SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Run the SQL to create all tables and policies

### 4. Configure OAuth (Google)

1. In Supabase, go to Authentication > Providers
2. Enable Google provider
3. Create OAuth credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
4. Add the callback URL: `https://your-project.supabase.co/auth/v1/callback`
5. Add your Google Client ID and Secret to Supabase

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/     # Protected dashboard pages
│   ├── api/             # API routes
│   └── login/           # Auth pages
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── calendar/        # Calendar components
│   └── navigation/      # Sidebar, header
├── lib/
│   └── supabase/        # Supabase clients
└── types/
    └── database.ts      # TypeScript types
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (OAuth + Magic Links)
- **Styling**: Tailwind CSS + shadcn/ui
- **Calendar**: react-big-calendar
- **Email**: Resend
- **SMS**: Twilio

## Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

## License

Private - All rights reserved
