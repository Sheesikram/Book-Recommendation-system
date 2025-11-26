# Book Recommendation Frontend

React + Vite frontend for the Book Recommendation system. The app now supports Supabase authentication (email/password + Google) and uses FastAPI as the recommendation backend.

## Getting started

```bash
cd Book-frontend
npm install
cp env.example .env.local   # then add your Supabase URL + anon key
npm run dev
```

### Environment variables

| Key | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL from the Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Public anon key from Project Settings → API |

> If you deploy the frontend separately (Vercel, Netlify, etc.), be sure to expose both variables in that environment as well.

### Supabase configuration checklist

1. Enable Email + Google providers in Supabase Auth → Providers.
2. For Google, add the site URL(s) as authorized redirect URIs in both Google Cloud Console and Supabase.
3. In Supabase Auth → Settings, add your local dev URL (`http://localhost:5173`) plus any production domains to the `redirect URLs` list.
4. Create a `profiles` table to store Google-user metadata (see below). The frontend automatically upserts a row after every successful login.

### User profile table (optional but recommended)

Run this SQL inside Supabase (SQL Editor) to persist the data captured when a user signs in with Google:

```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  raw_user_meta jsonb,
  last_login_at timestamptz,
  created_at timestamptz default timezone('utc', now()),
  updated_at timestamptz default timezone('utc', now())
);

create policy "Users can manage their own profile"
  on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);
```

> If you want automatic `updated_at` timestamps, add a trigger or use Supabase's "Replication → Realtime → Table editor" helpers.

## Available scripts

- `npm run dev` – start Vite in dev mode with HMR.
- `npm run build` – production build.
- `npm run preview` – locally preview the production build.
- `npm run lint` – run ESLint.

## Project structure

- `src/lib/supabaseClient.js` – Supabase client bootstrap.
- `src/context/AuthContext.jsx` – React context that tracks the Supabase session.
- `src/Components/Auth.jsx` – UI for login/register using Supabase Auth UI.
- `src/Components/Navbar.jsx` – Displays auth state and sign-in/out actions.

With AuthContext in place, any component can call `useAuth()` to read the logged-in user or trigger `signOut()`. Use this hook to protect routes, save user-specific data, or show personalized UI. As you extend the project, ensure any API calls that require auth attach the Supabase session token (via `supabase.auth.getSession()` or Supabase PostgREST helpers).
