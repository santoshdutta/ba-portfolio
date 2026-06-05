# Portfolio site — Node.js + Vercel

Run locally:

```bash
npm install
npm start
```

For development with auto-reload:

```bash
npm run dev
```

This starts an Express server (`server.js`) serving the project files.

Deploy to Vercel:

1. Install the Vercel CLI (`npm i -g vercel`) or use the Vercel web dashboard.
2. From the project root run:

```bash
vercel deploy --prod
```

The `vercel.json` routes all requests to the Node serverless function at `api/server.js`, which serves the static files on Vercel.

Then open http://localhost:3000
