# ScriptLab — Full Next.js App (TypeScript + shadcn + Tailwind)

This single-file code doc contains a ready-to-copy project scaffold for a Notion-like script editor with per-line audio playback and SSML selection tooling. Paste the files into your Next.js project folder structure exactly as named.

---

### /README.md

```md
# ScriptLab

Notion-style script editor with per-line play, SSML editing toolbar and ElevenLabs integration.

## Quick start

1. Create a Next.js app (App Router) with TypeScript + Tailwind:

```bash
npx create-next-app@latest scriptlab --typescript --tailwind
cd scriptlab
```

2. Install dependencies

```bash
npm install lucide-react zustand uuid
# Optional: shadcn
npx shadcn-ui@latest init
npx shadcn-ui@latest add button textarea
```

3. Copy the files from this doc into your project.

4. Add environment variables to `.env.local`:

```
NEXT_PUBLIC_USE_ELEVEN=1
ELEVENLABS_API_KEY=your_server_side_elevenlabs_key
ELEVENLABS_VOICE_ID=voice_id
```

5. Run dev server

```bash
npm run dev
```

Open http://localhost:3000


## Notes
- The ElevenLabs API key must stay server-side (do NOT expose it to the browser).
- This scaffold returns audio as a data URL for convenience. For production, upload audio to S3/GCS and return a CDN URL.
```
```
