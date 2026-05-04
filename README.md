<p align="center">
  <img src="https://img.shields.io/badge/MindEase-Mental%20Wellness-0ea5e9?style=for-the-badge&logo=heart&logoColor=white" alt="MindEase" />
</p>

<h1 align="center">🧠 MindEase</h1>

<p align="center">
  <strong>Your Mental Wellness Companion — Anonymous, AI-Powered, Available 24/7</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#environment-variables">Environment Variables</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-8-green?style=flat-square&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o-412991?style=flat-square&logo=openai" alt="OpenAI" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="License" />
</p>

---

## 🌟 Overview

**MindEase** is a comprehensive mental health support platform that provides anonymous, AI-powered wellness tools. Built with modern web technologies, it offers a safe space for users to chat with an empathetic AI companion, track their mood, practice guided breathing exercises, maintain a private journal, and access crisis resources — all without requiring any personal identification.

> ⚠️ **Important Disclaimer:** MindEase is a supportive tool for daily mental wellness. It is **not** a replacement for professional mental health care. If you are experiencing a crisis, please contact emergency services or call **988** (Suicide & Crisis Lifeline).

---

## ✨ Features

### 🤖 AI Chat Companion
- Empathetic, context-aware conversations powered by OpenAI GPT-4o
- Therapeutic tools integration (CBT, grounding, journaling prompts)
- Crisis detection with automatic intervention and emergency resources
- Mood check-ins during conversations
- Session summaries with actionable insights
- Emoji and voice input support

### 📊 Mood Tracking
- Log daily moods with intensity levels and notes
- Visual trend analysis with interactive charts (Recharts)
- Historical mood patterns and insights
- Personalized wellness recommendations

### 🌬️ Breathing Exercises
- Guided breathing techniques (Box Breathing, 4-7-8, etc.)
- Visual animations synchronized with breath cycles
- Session tracking and progress monitoring

### 📓 Personal Journal
- AES-256 encrypted journal entries
- Rich text support with mood tags
- AI-powered entry analysis and insights
- Private, secure, and anonymous

### 📈 Progress Dashboard
- Comprehensive wellness analytics
- Mood trend visualization
- Activity tracking and streaks
- Personalized recommendations

### 🛡️ Crisis Detection & Support
- Real-time crisis detection in conversations
- Immediate access to helplines (988, Crisis Text Line)
- Automated safety protocols
- Professional resource recommendations

### 🔒 Privacy & Security
- **100% Anonymous** — No email or personal info required
- **AES-256 Encryption** for all sensitive data
- **End-to-end security** with CSP headers
- **Rate limiting** to prevent abuse
- **No third-party data sharing**

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14.2 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 + Custom Glassmorphism |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Authentication** | NextAuth.js 4 |
| **AI/ML** | OpenAI GPT-4o / Groq (fallback) |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Encryption** | Node.js Crypto (AES-256-GCM) |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x or **yarn** >= 1.22
- **MongoDB Atlas** account ([Create free cluster](https://www.mongodb.com/atlas))
- **OpenAI API Key** ([Get API key](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RanaDarpan/MindEase.git
   cd MindEase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your actual values (see [Environment Variables](#environment-variables)).

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

MindEase is optimized for deployment on [Vercel](https://vercel.com).

#### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RanaDarpan/MindEase&env=MONGODB_URI,NEXTAUTH_SECRET,NEXTAUTH_URL,ENCRYPTION_KEY,OPENAI_API_KEY&envDescription=Required%20environment%20variables%20for%20MindEase&project-name=MindEase)

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL
vercel env add ENCRYPTION_KEY
vercel env add OPENAI_API_KEY

# Deploy to production
vercel --prod
```

#### Option 3: GitHub Integration (CI/CD)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add all required environment variables in the Vercel dashboard
5. Click **Deploy**

> **Important:** Set `NEXTAUTH_URL` to your production domain (e.g., `https://MindEase.vercel.app`)

### Environment Variables on Vercel

In your Vercel project dashboard → **Settings** → **Environment Variables**, add:

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your production URL (e.g., `https://MindEase.vercel.app`) |
| `ENCRYPTION_KEY` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `GROQ_API_KEY` | *(Optional)* Groq API key for fallback |

---

## 📁 Project Structure

```
MindEase/
├── app/                          # Next.js App Router pages
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   │   ├── [...nextauth]/    # NextAuth.js handler
│   │   │   └── signup/           # User registration
│   │   ├── chat/                 # Chat API (AI conversations)
│   │   │   ├── route.ts          # Chat message handler
│   │   │   └── history/          # Chat history retrieval
│   │   ├── crisis/               # Crisis logging
│   │   ├── journal/              # Journal CRUD operations
│   │   └── mood/                 # Mood entry CRUD operations
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # Sign in page
│   │   └── signup/               # Sign up page
│   ├── breathing/                # Breathing exercise page
│   ├── chat/                     # AI chat page
│   ├── dashboard/                # User dashboard
│   ├── journal/                  # Journal page
│   ├── mood/                     # Mood tracking page
│   ├── resources/                # Mental health resources
│   ├── globals.css               # Global styles & design system
│   ├── layout.tsx                # Root layout with providers
│   ├── not-found.tsx             # Custom 404 page
│   └── page.tsx                  # Landing page
├── components/                   # Reusable React components
│   ├── breathing/                # Breathing exercise components
│   ├── chat/                     # Chat interface components
│   │   ├── ChatInterface.tsx     # Main chat UI
│   │   ├── EmojiPicker.tsx       # Emoji selection
│   │   ├── MoodCheckIn.tsx       # In-chat mood check
│   │   ├── SessionSummary.tsx    # Chat session summary
│   │   ├── TherapeuticCard.tsx   # Therapeutic tool cards
│   │   └── VoiceControls.tsx     # Voice input controls
│   ├── crisis/                   # Crisis overlay component
│   ├── mood/                     # Mood entry component
│   ├── providers/                # Context providers
│   │   ├── SessionProvider.tsx   # NextAuth session
│   │   └── ThemeProvider.tsx     # Dark/light theme
│   └── ui/                       # UI primitives
│       ├── button.tsx            # Button component
│       ├── card.tsx              # Card component
│       ├── FloatingElement.tsx   # Animated floating elements
│       ├── GlassCard.tsx         # Glassmorphism card
│       ├── input.tsx             # Input component
│       ├── Navigation.tsx        # Global navigation bar
│       ├── StatsCard.tsx         # Statistics card
│       ├── textarea.tsx          # Textarea component
│       └── ThemeToggle.tsx       # Theme toggle switch
├── docs/                         # Documentation
│   └── crisis-protocol.md       # Crisis detection protocol
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── context-builder.ts       # AI context management
│   ├── crisis-detection.ts      # Crisis keyword detection
│   ├── db.ts                     # MongoDB connection
│   ├── encryption.ts            # AES-256 encryption utils
│   ├── groq.ts                   # Groq AI client (fallback)
│   ├── openai-client.ts         # OpenAI client (primary)
│   ├── therapeutic-tools.ts     # Therapeutic tool library
│   └── utils.ts                  # General utilities
├── models/                       # Mongoose data models
│   ├── ChatSession.ts           # Chat session schema
│   ├── CrisisLog.ts             # Crisis event logging
│   ├── JournalEntry.ts          # Journal entry schema
│   ├── MoodEntry.ts             # Mood entry schema
│   └── User.ts                   # User account schema
├── types/                        # TypeScript type definitions
│   └── next-auth.d.ts           # NextAuth type extensions
├── middleware.ts                 # Rate limiting & security headers
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── .env.example                  # Environment variable template
├── .gitignore                   # Git ignore rules
└── package.json                 # Project dependencies
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/MindEase

# NextAuth.js — Authentication
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
NEXTAUTH_URL=http://localhost:3000

# Data Encryption (AES-256)
ENCRYPTION_KEY=<generate-with-node-crypto-randomBytes-32-hex>

# OpenAI API (Primary AI provider)
OPENAI_API_KEY=sk-...

# Groq API (Optional fallback)
GROQ_API_KEY=gsk_...

# Node Environment
NODE_ENV=development
```

### Generating Secrets

```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# ENCRYPTION_KEY
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/[...nextauth]` | NextAuth.js sign in/out |

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message to AI companion |
| `GET` | `/api/chat/history` | Retrieve chat history |

### Mood

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/mood` | Get mood entries |
| `POST` | `/api/mood` | Log new mood entry |

### Journal

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/journal` | Get journal entries |
| `POST` | `/api/journal` | Create journal entry |
| `PUT` | `/api/journal` | Update journal entry |
| `DELETE` | `/api/journal` | Delete journal entry |

### Crisis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/crisis/log` | Log crisis event |

---

## 🎨 Design System

MindEase uses a custom design system built on Tailwind CSS with:

- **Color Palette:** `calm` (blue), `peace` (purple), `soothe` (green) — carefully chosen calming tones
- **Glassmorphism:** Frosted glass effect with `backdrop-filter: blur()`
- **Typography:** Inter (body) + Outfit (headings) from Google Fonts
- **Animations:** Custom keyframes for breathing, floating, fade-in, scale-in effects
- **Dark Mode:** Full dark mode support via class-based toggling
- **Responsive:** Mobile-first design with breakpoints at `md` and `lg`

---

## 🧪 Development

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow existing code style and conventions
- Write descriptive commit messages
- Test your changes before submitting
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 🆘 Crisis Resources

If you or someone you know is in crisis, please reach out:

| Resource | Contact |
|----------|---------|
| **Suicide & Crisis Lifeline** | **988** (call or text) |
| **Crisis Text Line** | Text **HOME** to **741741** |
| **Veterans Crisis Line** | **1-800-273-8255** (Press 1) |
| **Emergency Services** | **911** |
| **International Association for Suicide Prevention** | [https://www.iasp.info/resources/Crisis_Centres/](https://www.iasp.info/resources/Crisis_Centres/) |

---

<p align="center">
  Made with ❤️ by the <strong>MindEase Team</strong> — for mental wellness, for everyone.
</p>
