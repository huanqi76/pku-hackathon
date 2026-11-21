# astronaut-time-capsule

A cinematic time capsule for astronauts to revisit memories of Earth. React, Vite and Tailwind, with the Gemini API behind a small Express server.

```sh
npm install
cp .env.example .env.local   # set GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

| Path | Contents |
| --- | --- |
| `src/App.tsx` | Scene routing |
| `src/components` | One view per scene: landing, memory, letter, panorama, AR |
