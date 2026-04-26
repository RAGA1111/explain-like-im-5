# Explain Like I'm 5 - Interview Edition

An AI-powered learning app that explains any topic at Beginner, Intermediate, and Advanced depth, with resources, prerequisites, quiz mode, and concept overview visuals.

## Highlights

- Multi-level explanations (`Beginner`, `Intermediate`, `Advanced`)
- Resource recommendations (videos, articles, courses, challenges)
- Prerequisite roadmap by topic
- Interactive quiz mode with instant feedback and score
- AI provider switcher (`Gemini` / `Groq`)
- Visual concept overview generation (Gemini)
- Recent topics history persisted in local storage

## Tech Stack

- React + TypeScript + Vite
- Gemini SDK (`@google/genai`)
- Groq API (OpenAI-compatible endpoint)
- Tailwind classes (via CDN in `index.html`)

## Local Setup

1. Install dependencies:
   - `npm install`
2. Create `.env` from `.env.example`
3. Set at least one provider key:
   - `VITE_GEMINI_API_KEY=...` or `VITE_GROQ_API_KEY=...`
4. Start dev server:
   - `npm run dev`

## Environment Variables

- `VITE_AI_PROVIDER`: default provider (`gemini` or `groq`)
- `VITE_GEMINI_API_KEY`: Gemini API key
- `VITE_GROQ_API_KEY`: Groq API key

## Deploy on Render

This repo includes `render.yaml` for one-click static deployment.

### Option A: Blueprint Deploy (recommended)

1. Push your repo to GitHub.
2. In Render, choose **New +** -> **Blueprint**.
3. Select this repo and deploy.
4. Add secret env vars in Render dashboard:
   - `VITE_GEMINI_API_KEY`
   - `VITE_GROQ_API_KEY` (optional if you use only Gemini)

### Option B: Manual Static Site

1. Create a **Static Site** on Render.
2. Build command: `npm ci && npm run build`
3. Publish directory: `dist`
4. Add environment variables from above.

## Cost + Token Strategy (Safe)

Use legal/ethical optimization instead of bypassing limits:

- Prefer `Groq` for fast free-tier inference where suitable.
- Cache generated responses by `(topic + level + provider)` in local storage or backend.
- Avoid regenerating visuals unless user explicitly asks.
- Add request throttling/debouncing and retry with backoff.
- Consider a lightweight backend proxy later for shared caching.

## Suggested Next Upgrades

- Authentication + saved learning journeys
- Backend API for persistent user progress and analytics
- Server-side caching and rate limiting
- Unit tests (service parsing) + component tests (quiz flow)
- CI pipeline (build + tests + lint)
