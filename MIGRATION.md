# Subdomain Restructure — Migration Guide

## Before vs After

```
BEFORE (current repo)                    AFTER (restructured)
========================                 ========================

src/                                     src/
├── app/                                 ├── middleware.ts              ← NEW (subdomain routing)
│   ├── layout.tsx     ← has Navbar+Scene│ 
│   ├── globals.css                      ├── app/
│   ├── page.tsx                         │   ├── layout.tsx             ← CHANGED (minimal: just html/body)
│   ├── about/                           │   ├── globals.css            ← UNCHANGED
│   │   └── page.tsx                     │   │
│   ├── projects/                        │   ├── (portfolio)/           ← NEW route group (no URL segment)
│   │   ├── page.tsx                     │   │   ├── layout.tsx         ← NEW (Scene + Navbar + Footer)
│   │   ├── [slug]/                      │   │   ├── page.tsx           ← MOVED from app/page.tsx
│   │   │   └── page.tsx                 │   │   ├── about/             ← MOVED from app/about/
│   │   └── hibeam/                      │   │   │   └── page.tsx
│   │       ├── page.tsx                 │   │   ├── projects/          ← MOVED from app/projects/
│   │       ├── HibeamClientContent.tsx  │   │   │   ├── page.tsx
│   │       ├── interactive/             │   │   │   ├── [slug]/
│   │       │   └── page.tsx             │   │   │   │   └── page.tsx
│   │       └── simulation/              │   │   │   └── hibeam/
│   │           └── page.tsx             │   │   │       ├── page.tsx
│   ├── articles/                        │   │   │       ├── HibeamClientContent.tsx
│   │   ├── page.tsx                     │   │   │       ├── interactive/
│   │   └── [slug]/                      │   │   │       │   └── page.tsx
│   │       └── page.tsx                 │   │   │       └── simulation/
│   ├── contact/                         │   │   │           └── page.tsx
│   │   └── page.tsx                     │   │   ├── articles/          ← MOVED from app/articles/
│   └── sitemap.xml/                     │   │   │   ├── page.tsx
│       └── route.ts                     │   │   │   └── [slug]/
│                                        │   │   │       └── page.tsx
├── components/                          │   │   ├── contact/           ← MOVED from app/contact/
│   ├── navbar.tsx                       │   │   │   └── page.tsx
│   ├── scene.tsx                        │   │   └── sitemap.xml/
│   ├── globe.tsx                        │   │       └── route.ts
│   ├── graph.tsx                        │   │
│   ├── annihilationsim.tsx              │   ├── physics/               ← NEW subdomain
│   ├── hibeamseoblock.tsx               │   │   ├── layout.tsx         ← own nav, red accent
│   └── particledetector.tsx             │   │   ├── page.tsx           ← simulation gallery
│                                        │   │   └── simulations/
├── data/                                │   │       ├── page.tsx
│   ├── projects.ts                      │   │       ├── ising/
│   ├── articles.ts                      │   │       │   └── page.tsx
│   └── collision-data.json              │   │       ├── game-of-life/
│                                        │   │       │   └── page.tsx
                                         │   │       ├── sirs/
                                         │   │       │   └── page.tsx
                                         │   │       ├── cahn-hilliard/
                                         │   │       │   └── page.tsx
                                         │   │       └── poisson/
                                         │   │           └── page.tsx
                                         │   │
                                         │   ├── music/                 ← NEW subdomain
                                         │   │   ├── layout.tsx         ← own nav, gold accent
                                         │   │   ├── page.tsx           ← blog index
                                         │   │   └── posts/
                                         │   │       └── [slug]/
                                         │   │           └── page.tsx
                                         │   │
                                         │   └── web/                   ← NEW subdomain
                                         │       ├── layout.tsx         ← own nav, teal accent
                                         │       ├── page.tsx           ← landing (tutorials + portfolio)
                                         │       ├── tutorials/
                                         │       │   ├── page.tsx       ← tutorial index
                                         │       │   └── [slug]/
                                         │       │       └── page.tsx
                                         │       └── portfolio/
                                         │           ├── page.tsx       ← project showcase
                                         │           └── [slug]/
                                         │               └── page.tsx
                                         │
                                         ├── components/
                                         │   ├── navbar.tsx             ← UNCHANGED (still used by portfolio)
                                         │   ├── scene.tsx              ← UNCHANGED
                                         │   ├── globe.tsx              ← UNCHANGED
                                         │   ├── graph.tsx              ← UNCHANGED
                                         │   ├── annihilationsim.tsx    ← UNCHANGED
                                         │   ├── hibeamseoblock.tsx     ← UNCHANGED
                                         │   ├── particledetector.tsx   ← UNCHANGED
                                         │   │
                                         │   ├── shared/                ← NEW
                                         │   │   ├── SubdomainNav.tsx   ← reusable nav for all subdomains
                                         │   │   └── Footer.tsx         ← footer with subdomain links
                                         │   │
                                         │   ├── simulations/           ← NEW
                                         │   │   ├── IsingModel.tsx
                                         │   │   ├── GameOfLife.tsx
                                         │   │   ├── SIRSModel.tsx
                                         │   │   ├── CahnHilliard.tsx
                                         │   │   └── PoissonSolver.tsx
                                         │   │
                                         │   └── music/                 ← NEW
                                         │       └── MusicPostContent.tsx  ← renders HTML + VexFlow
                                         │
                                         ├── lib/
                                         │   └── simulations/           ← NEW (pure physics engines)
                                         │       ├── ising-engine.ts
                                         │       ├── gol-engine.ts
                                         │       └── sirs-engine.ts
                                         │
                                         └── data/
                                             ├── projects.ts            ← UNCHANGED
                                             ├── articles.ts            ← UNCHANGED
                                             ├── collision-data.json    ← UNCHANGED
                                             ├── music-posts.ts         ← NEW
                                             └── web-data.ts            ← NEW
```

## Step-by-step migration

### 1. Create the route group — move existing pages (5 minutes)

This is the most important step. Create `src/app/(portfolio)/` and move
every existing page folder into it. The parentheses make it a "route group"
so the URL stays the same (no /portfolio/ prefix).

```bash
# From repo root:
mkdir -p src/app/\(portfolio\)

# Move all existing page folders into the route group
mv src/app/page.tsx        src/app/\(portfolio\)/page.tsx
mv src/app/about           src/app/\(portfolio\)/about
mv src/app/projects        src/app/\(portfolio\)/projects
mv src/app/articles        src/app/\(portfolio\)/articles
mv src/app/contact         src/app/\(portfolio\)/contact
mv src/app/sitemap.xml     src/app/\(portfolio\)/sitemap.xml

# Keep these in app/ root (they're shared):
# - layout.tsx (we'll edit this)
# - globals.css
# - favicon.ico
# - icon.svg
```

### 2. Split the root layout (2 minutes)

**Edit `src/app/layout.tsx`**: Remove the `<Scene />`, `<Navbar />`, and
`<main>` wrapper. Keep only `<html>`, `<body>`, the CSS import, and metadata.
(See the new layout.tsx in the files provided.)

**Create `src/app/(portfolio)/layout.tsx`**: This gets the Scene, Navbar,
and the new Footer — exactly what the root layout used to have.
(See file provided.)

### 3. Add the middleware (1 minute)

Copy `src/middleware.ts` into place. No configuration needed — it reads
the hostname from the request and rewrites subdomain paths.

### 4. Add new subdomain folders (2 minutes)

```bash
mkdir -p src/app/physics/simulations/{ising,game-of-life,sirs,cahn-hilliard,poisson}
mkdir -p src/app/music/posts
mkdir -p src/app/web/{tutorials,portfolio}
```

Copy in the layout.tsx and page.tsx files for each.

### 5. Add new components and data (2 minutes)

```bash
mkdir -p src/components/{shared,simulations,music}
mkdir -p src/lib/simulations
```

Copy in SubdomainNav.tsx, Footer.tsx, IsingModel.tsx, MusicPostContent.tsx,
music-posts.ts, web-data.ts.

### 6. Install VexFlow (1 minute)

```bash
npm install vexflow
```

### 7. Test locally

```bash
npm run dev
```

- `localhost:3000` → portfolio (should look identical to before)
- `localhost:3000/physics` → physics landing (internal URL — works for testing)
- `localhost:3000/music` → music blog landing
- `localhost:3000/web` → web dev landing

To test actual subdomain routing locally, add to `/etc/hosts`:
```
127.0.0.1  physics.localhost
127.0.0.1  music.localhost
127.0.0.1  web.localhost
```
Then visit `physics.localhost:3000`.

### 8. DNS setup (for production)

Add these DNS records for `paolo.org.uk`:

| Type  | Name       | Value              |
|-------|------------|--------------------|
| A     | @          | <droplet IP>       |
| A     | physics    | <droplet IP>       |
| A     | music      | <droplet IP>       |
| A     | web        | <droplet IP>       |

Or use a wildcard:

| Type  | Name       | Value              |
|-------|------------|--------------------|
| A     | @          | <droplet IP>       |
| A     | *          | <droplet IP>       |

### 9. SSL with wildcard cert

```bash
# Install the DigitalOcean DNS plugin for certbot
pip install certbot-dns-digitalocean

# Create API token file
echo "dns_digitalocean_token = YOUR_DO_API_TOKEN" > ~/certbot-creds.ini
chmod 600 ~/certbot-creds.ini

# Get wildcard cert (uses DNS-01 challenge — no port 80 needed)
certbot certonly \
  --dns-digitalocean \
  --dns-digitalocean-credentials ~/certbot-creds.ini \
  -d paolo.org.uk \
  -d "*.paolo.org.uk"
```

### 10. Nginx config (single upstream)

```nginx
server {
    listen 443 ssl;
    server_name paolo.org.uk *.paolo.org.uk;

    ssl_certificate     /etc/letsencrypt/live/paolo.org.uk/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/paolo.org.uk/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name paolo.org.uk *.paolo.org.uk;
    return 301 https://$host$request_uri;
}
```

Note: `proxy_set_header Host $host;` is critical — this passes the original
hostname (physics.paolo.org.uk) through to Next.js, which the middleware
reads to do the subdomain routing.

## Music notation: VexFlow

VexFlow (`npm install vexflow`) renders staves, notes, and scores as SVG.
In blog posts, add notation blocks in the HTML content:

```html
<div class="vexflow-score"
     data-clef="treble"
     data-time="4/4"
     data-notes="C5/q, D5, E5, F5">
</div>
```

The MusicPostContent component hydrates these after mount. VexFlow's
EasyScore syntax: `C5/q` = C5 quarter, `D5/h` = D5 half, `F#5/8` = F#5
eighth, `Bb4/w` = Bb4 whole. Multiple voices and staves are possible
via the Factory API for more complex scores.

An alternative for full MusicXML support is OpenSheetMusicDisplay (`osmd`),
which renders standard .musicxml files and is built on top of VexFlow.

## What each subdomain looks like

| Subdomain | Accent  | Content type          | Key packages     |
|-----------|---------|-----------------------|------------------|
| physics   | #e84834 | Interactive sims      | Canvas API       |
| music     | #d4a24e | Editorial blog        | VexFlow          |
| web       | #22b8a0 | Tutorials + portfolio | shiki (existing) |
| (main)    | emerald | Personal portfolio    | three.js (existing) |
