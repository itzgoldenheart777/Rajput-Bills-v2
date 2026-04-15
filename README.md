# 🚗 Rajput Tour & Travels — Unified App

Three tools in one React app, powered by Supabase.

## Apps Included
| App | Path | Description |
|-----|------|-------------|
| 🧾 Bill Generator | `/` | Create & print tour bills |
| 🚘 Road Tax | `/tax` | Track vehicle tax expiry & payments |
| 💰 Driver Pagar | `/pagar` | Calculate weekly driver salary |

---

## Quick Setup

### 1. Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste & run `supabase_schema_unified.sql`
3. Copy your **Project URL** and **Anon Key** from Settings → API

### 2. Local Dev
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

npm install
npm run dev
```

### 3. Deploy to GitHub Pages
```bash
# In package.json, update "base" in vite.config.js to match your repo name
# Add secrets in GitHub → Settings → Secrets:
#   VITE_SUPABASE_URL
#   VITE_SUPABASE_ANON_KEY

git push origin main  # Auto-deploys via GitHub Actions
```

### 4. Deploy to Vercel (Easier)
```bash
npx vercel
# Add env vars in Vercel dashboard
```

---

## Pagar Calculation Formula
```
Base Profit   = Total Earning − CNG − App Fees
Pagar (50%)   = Base Profit ÷ 2
Net Cash      = Cash Collected − CNG
After Pagar   = Net Cash − Pagar
Payout        = After Pagar − Toll
Final Payout  = Payout + Previous Balance
```

---

## Database Tables
| Table | App | Description |
|-------|-----|-------------|
| `bills` | Bill Generator | Tour bill records |
| `saved_cars` | Bill Generator | Saved car presets |
| `vehicles` | Road Tax | Vehicle details |
| `tax_payments` | Road Tax | Tax payment records |
| `vehicle_status` | Road Tax | View: days until expiry |
| `drivers` | Pagar | Driver profiles |
| `pagar_records` | Pagar | Weekly salary records |
