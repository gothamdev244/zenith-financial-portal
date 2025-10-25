# Zenith Financial Advisors - Client Portal

A modern, secure client-employee portal for Zenith Financial Advisors, enabling seamless collaboration between tax advisors and clients.

## Features

- **Secure Document Management**: Upload, categorize, and manage tax documents with AES-256 encryption
- **Real-time Messaging**: Direct communication between clients and advisors
- **Appointment Scheduling**: Self-service booking with calendar integration
- **Task & Workflow Management**: Track tax preparation progress and deadlines
- **Client & Advisor Dashboards**: Comprehensive views of status, tasks, and analytics

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2 / BunnyCDN
- **Real-time**: Socket.io
- **Email**: Resend.com
- **Hosting**: Hetzner VPS + Cloudflare CDN

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for caching)

### Installation

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to see the application.

## Development Roadmap

See [GitHub Issues](https://github.com/gothamdev244/zenith-financial-portal/issues) for the complete development plan.

**Current Phase**: Phase 1 - Foundation Setup

## License

Proprietary - Zenith Financial Advisors
