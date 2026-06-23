# Portfolio Command

Your cross-portfolio task dashboard + away-day schedule, now backed by Supabase
so it syncs across your phone and Mac, and so Lucy can see your schedule.

Built with Vite + React. Deploys to Netlify. Data lives in Supabase.

---

## What you get

- **Dashboard** (`/`) — your full app, behind a login. Tasks, Focus/Board views,
  priority + effort filters, the mobile quick-capture screen, and the schedule tab.
  Only you can see or edit this.
- **Shared schedule** (`/schedule`) — a read-only week view of your away-days.
  No login. This is the link Lucy bookmarks.

---

## One-time setup (about 15 minutes)

You'll do this in three places: Supabase, GitHub, Netlify.

### 1. Supabase — create the database

1. Go to https://supabase.com, create a new project. Give it a name and a strong
   database password (save it somewhere; you won't need it day-to-day).
2. Wait for it to finish provisioning (~2 min).
3. Left sidebar → **SQL Editor** → **New query**.
4. Open `supabase_schema.sql` from this folder, copy the whole thing, paste it in,
   and click **Run**. You should see "Success."

### 2. Supabase — create your login

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email and a password. Tick "Auto Confirm User" so you can log in
   straight away.
3. That email is your owner account. Remember it — it goes in the env vars below.

> Note on magic links: the login screen also offers an email "magic link" option.
> If you want that to work, in Supabase go to Authentication → Providers → Email and
> make sure email is enabled. Password login works out of the box.

### 3. Get your Supabase keys

Left sidebar → **Project Settings** → **API** (and **Data API**). You need two values:

- **Project URL** → e.g. `https://abcdefgh.supabase.co`
- **anon public** key (a long string under "Project API keys")

Keep these handy for step 5.

### 4. GitHub — push the code

1. Create a new GitHub repo (private is fine).
2. Push this `portfolio-command` folder to it. From the folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio Command"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/portfolio-command.git
   git push -u origin main
   ```
   (`node_modules` and `.env` are gitignored, so they won't be pushed — that's correct.)

### 5. Netlify — deploy

1. Go to https://netlify.com → **Add new site** → **Import an existing project**.
2. Connect GitHub, pick the repo. Netlify auto-detects the Vite build from
   `netlify.toml` (build command `npm run build`, publish dir `dist`).
3. Before deploying, open **Site configuration → Environment variables** and add:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | your Project URL from step 3 |
   | `VITE_SUPABASE_ANON_KEY` | your anon public key from step 3 |
   | `VITE_OWNER_EMAIL` | the email you created in step 2 |

4. Deploy. When it's live:
   - **You**: open the site root, log in with your email + password.
   - **Lucy**: bookmark `https://your-site.netlify.app/schedule`.

---

## Running it locally (optional)

```bash
npm install
cp .env.example .env     # then fill in your three values
npm run dev              # opens http://localhost:5173
```

---

## How the access model works

- Every task, portfolio, and event row is tagged with your user id.
- Supabase row-level security means only your logged-in account can read or write
  your tasks and portfolios.
- The `events` table additionally allows public read, which is what powers the
  read-only `/schedule` page. Only schedule data is exposed this way — never tasks.
- If a different email logs in at the root, they're redirected to `/schedule`.

### Want the schedule private instead of public?

Right now anyone with the `/schedule` link can view it (they can't edit anything).
If you'd prefer it locked behind a secret link or Lucy's own login, say the word and
I'll switch the approach — it's a small change to one policy and the schedule loader.

---

## File guide (if you want to tinker)

| File | What it does |
|------|--------------|
| `src/App.jsx` | The whole dashboard UI (tasks, schedule, modals) |
| `src/useStore.js` | Talks to Supabase; swap-in for the old device storage |
| `src/supabaseClient.js` | Supabase connection + owner email |
| `src/Login.jsx` | The sign-in screen |
| `src/PublicSchedule.jsx` | Lucy's read-only schedule page |
| `src/main.jsx` | Routing + auth gate |
| `src/shared.js` | Colours, constants, date helpers |
| `src/styles.js` | All styling |
| `supabase_schema.sql` | Paste into Supabase to build the database |

---

## A couple of honest notes

- The first time you log in, the five default portfolios (ETHOS, Oscaid, JHutch
  Advisory, Avencera, Arca) are created automatically. Add or remove from there.
- Your existing artifact data does **not** carry over — this is a fresh, real
  backend. You'll re-add live tasks, which is no bad thing for a clean start.
- Concurrent edits use last-write-wins, which is fine for one editor (you).
