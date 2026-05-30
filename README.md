# Eye Care Ad Image Generator

Picks a **random prompt** from `prompts.txt` and generates a social-media ad image with the **Google Gemini** image API.

Works locally (Node) and on **Vercel** (serverless API routes).

## Local development

```bash
npm install
cp .env.example .env
# Edit .env and set GEMINI_API_KEY
npm start
```

Open **http://localhost:3847**

## Deploy to GitHub

1. Create a new repository on GitHub (e.g. `eye-care-image-gen`). Do **not** add a README if you already have one locally.

2. From this folder:

```bash
git add .
git commit -m "Initial commit: eye care ad image generator"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/eye-care-image-gen.git
git push -u origin main
```

Replace `YOUR_USERNAME` and the repo name with yours.

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. **Add New Project** → import your `eye-care-image-gen` repository.
3. Vercel auto-detects the setup (`public/` for static files, `api/` for serverless functions). No custom build command needed.
4. Under **Environment Variables**, add:

| Name | Value |
|------|--------|
| `GEMINI_API_KEY` | Your Google AI Studio key |
| `GEMINI_MODEL` | `gemini-2.5-flash-image` (optional) |

5. Click **Deploy**.

Your site will be live at `https://your-project.vercel.app`.

### Notes for Vercel

- **Never** commit `.env` or your API key. Only set `GEMINI_API_KEY` in the Vercel dashboard.
- Image generation can take 30–60 seconds. `vercel.json` sets `maxDuration: 60` for `/api/generate`. On the free Hobby plan, the limit may be lower (10s); upgrade to Pro if requests time out.
- `prompts.txt` is included in the repo and read at deploy time.

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Status, model, prompt count |
| `/api/prompts/random` | GET | Random prompt |
| `/api/generate` | POST | Generate image (`{ "prompt": "..." }` optional) |

## Project layout

```
api/           Vercel serverless routes (also used by local server)
lib/           Shared prompts + Gemini logic
public/        HTML, CSS, JS
prompts.txt    50 eye-care ad prompts
server.js      Local Express dev server
vercel.json    Vercel config (function timeout)
```
