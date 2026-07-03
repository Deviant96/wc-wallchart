# FIFA World Cup 2026 — Dynamic Wall Chart

An interactive wall chart for the 2026 FIFA World Cup. Edit scores and teams, drag countries into bracket slots, fetch live fixture data, and export as PNG, PDF, or print.

## Features

- **Group Stage** — 12 groups (A–L) with auto-calculated standings
- **Knockout Bracket** — Round of 32 through Final (+ third-place match)
- **Fetch live data** — Pull teams, matches, dates, and scores from [wheniskickoff.com](https://wheniskickoff.com/data/v1/)
- **Manual editing** — Click any match to edit teams, scores, dates, and notes
- **Drag & drop** — Drag teams from group tables into bracket slots
- **Auto-advance** — Knockout winners automatically fill the next round (toggle on/off)
- **Export** — Download PNG or PDF, or print the chart
- **Persistence** — Edits saved to browser localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Vercel auto-detects Next.js — no environment variables required
4. Click **Deploy**

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Usage

| Action | How |
|---|---|
| Fetch live data | **Fetch Live Data** (merges) or **Overwrite Fetch** (replaces all) |
| Edit a match | Click any match row or card |
| Add a country | **Add Team** in the toolbar |
| Drag a team | Drag from group standings into a bracket slot |
| Export | **Export** → PNG, PDF, or Print |
| Reset | **Reset to Seed** restores bundled offline data |

## Data Sources

- **Primary:** [wheniskickoff.com/data/v1/](https://wheniskickoff.com/data/v1/) — teams, matches, scores (CORS-enabled, no API key)
- **Fallback:** [openfootball/worldcup.json](https://github.com/openfootball/worldcup.json)
- **Offline seed:** Bundled JSON in `lib/data/seed/`

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Zustand (state + localStorage persist)
- @dnd-kit (drag and drop)
- html-to-image + jsPDF (export)

## License

MIT
