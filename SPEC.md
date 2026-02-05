# QrTrace — Product Specification

## Overview
QrTrace is a web application for creating dynamic QR codes with full scan analytics. Users can create QR codes where the destination URL can be changed anytime, and track every scan with detailed analytics including location, device, time, and referrer data.

## Target Users
- **Marketers**: Campaign tracking, A/B testing landing pages
- **Event organizers**: Dynamic event links, ticket QR codes
- **Restaurants**: Menu QR codes that can be updated without reprinting
- **Small businesses**: Storefront QR codes, business card links

## Monetization
- **Free tier**: 3 QR codes without signup
- **Pro tier**: $9/month — unlimited QR codes + custom branding + full analytics

## Core Features

### 1. QR Code Generator
- Enter destination URL → generate QR code instantly
- Customizable foreground/background colors
- Multiple preset color schemes
- Real-time preview

### 2. Dynamic Redirect
- QR points to app URL (e.g., `qr.adntgv.com/r/abc123`)
- Redirects to actual destination URL
- Destination changeable anytime without reprinting QR

### 3. Analytics Dashboard
- Total scan count per QR code
- Scans over time chart (area chart)
- Top countries (bar chart)
- Device breakdown (pie chart — mobile/desktop/tablet)
- Top referrers
- Recent scan log table

### 4. QR Management
- List all QR codes with thumbnails
- Edit destination URL inline
- Toggle active/inactive status
- Delete QR codes

### 5. Download Options
- PNG at 256px, 512px, 1024px
- SVG (vector, infinitely scalable)

### 6. Anonymous Mode
- First 3 QR codes without signup
- Tracked via localStorage anonymous token
- Upgrade prompt at limit

## Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Charts**: Recharts
- **QR Generation**: `qrcode` npm package (client-side)
- **Deployment**: Docker (multi-stage build)

## Database Schema
See `supabase/migrations/001_qr.sql`
