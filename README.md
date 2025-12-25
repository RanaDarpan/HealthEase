# MindEase

A mental health support web application built with Next.js, featuring AI chat, mood tracking, breathing exercises, and crisis detection.

## Features

- AI Companion: Empathetic chat powered by Groq (Llama 3)
- Crisis Detection: Automatic detection with helpline overlay
- Mood Tracking: Track emotional wellbeing with encrypted notes
- Breathing Exercises: Guided breathing techniques (4-7-8, Box Breathing)
- Privacy First: Anonymous by default, AES-256 encryption
- Responsive: Mobile-first design with accessibility features

## Tech Stack

- Framework: Next.js 14 (App Router, TypeScript)
- Styling: Tailwind CSS
- Database: MongoDB Atlas
- ODM: Mongoose
- AI: Groq API
- Auth: NextAuth.js (JWT)
- Encryption: AES-256-GCM

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account
- Groq API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
NEXTAUTH_SECRET=your_nextauth_secret_32_chars_minimum
NEXTAUTH_URL=http://localhost:3000
ENCRYPTION_KEY=your_32_byte_hex_encryption_key
```

4. Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Run development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `GROQ_API_KEY` | Groq API key for AI chat | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js JWT signing | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `ENCRYPTION_KEY` | 32-byte hex key for AES-256-GCM | Yes |

## Security Features

- AES-256-GCM encryption for sensitive data
- Anonymous mode by default
- Rate limiting
- Security headers
- JWT token-based authentication
- Secure password hashing (bcrypt)

## Crisis Helplines (India)

- AASRA: 91-9820466726 (24/7)
- Vandrevala Foundation: 1860-2662-345 (24/7)
- iCall: 022-25521111 (Mon-Sat, 8 AM - 10 PM)
- Sneha India: 91-44-24640050 (24/7)
- Sumaitri: 011-23389090 (2 PM - 10 PM, Delhi)

## Important Disclaimer

⚠️ **MindEase is NOT a medical system or replacement for professional mental health care.**

This application:
- Does NOT provide medical advice or diagnoses
- Does NOT replace therapy or professional treatment
- Is an emotional support companion only

If you're in crisis, please call emergency services or a crisis helpline immediately.

## Deployment

This app is configured for Vercel deployment:

1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

## License

MIT License
