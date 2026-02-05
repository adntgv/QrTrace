# QrTrace

**Dynamic QR codes with analytics** — Create QR codes where the destination URL can be changed anytime. Track every scan with detailed analytics.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- 🔄 **Dynamic URLs** — Change destination anytime without reprinting
- 📊 **Scan Analytics** — Location, device, time, referrer tracking
- 🎨 **Customizable** — Colors, sizes, multiple download formats
- ⚡ **Instant Redirect** — Lightning-fast scan-to-destination
- 🔒 **Toggle Control** — Activate/deactivate QR codes on demand
- 🆓 **Free Tier** — 3 QR codes without signup

## Tech Stack

- **Framework**: Next.js 14 + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **QR Generation**: `qrcode` (client-side)
- **Deployment**: Docker

## Quick Start

```bash
# Clone
git clone https://github.com/adntgv/QrTrace.git
cd QrTrace

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run database migration
# Copy contents of supabase/migrations/001_qr.sql to Supabase SQL Editor

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL (for QR redirect links) |

## Database Setup

Run the migration in `supabase/migrations/001_qr.sql` in your Supabase SQL Editor. This creates:

- `qr_codes` — QR code records with metadata
- `qr_scans` — Scan event logs for analytics
- Row Level Security policies
- `increment_scan_count()` RPC function

## Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  --build-arg NEXT_PUBLIC_APP_URL=https://your-domain.com \
  -t qrtrace .

docker run -p 3000:3000 qrtrace
```

## Architecture

```
User scans QR → GET /r/{code} → Log scan to qr_scans → Redirect 302 → Destination URL
```

The redirect handler (`/r/[code]/route.ts`) is the critical path:
1. Looks up QR code by short_code
2. Checks if active
3. Logs scan data (IP, user-agent, referrer, geo headers)
4. Increments scan counter
5. Returns 302 redirect to destination

Scan logging is fire-and-forget to avoid blocking the redirect.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── create/page.tsx       # QR creator
│   ├── dashboard/page.tsx    # QR list + management
│   ├── qr/[id]/page.tsx     # Single QR analytics
│   ├── r/[code]/route.ts    # Redirect handler (critical)
│   ├── auth/page.tsx         # Auth page
│   └── api/qr/              # CRUD API
├── components/               # UI components
└── lib/                      # Supabase clients, types, utils
```

## License

MIT
