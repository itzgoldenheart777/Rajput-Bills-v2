# 🚗 Rajput Tour & Travels — Bill Generator

A full-stack web application for generating, saving, and printing travel bills.  
Built with **React + Vite** (frontend) and **Supabase** (database + storage backend).

---

## ✨ Features

- ✅ Generate bills matching the exact Rajput Tour & Travels format
- ✅ Save bills to Supabase (PostgreSQL) database
- ✅ View all saved bills with search & filter
- ✅ Print any bill directly from the browser
- ✅ Live bill preview while filling the form
- ✅ **Brand Assets tab** — upload Logo, Stamp & Signature to Supabase Storage
- ✅ Uploaded assets auto-appear in all bill previews and printouts
- ✅ Deploy to GitHub Pages in one click

---

## 🖼️ Brand Assets Setup (one-time)

1. Go to your **Supabase Dashboard → Storage**
2. Click **New bucket**, name it `brand-assets`, toggle **Public** ON
3. Click Create bucket
4. Open the app → **Brand Assets** tab
5. Upload your Logo, Stamp, and Signature (PNG with transparent background)
6. Done! All bills will use your uploaded images automatically.

---

## 🗂️ Project Structure

```
rajput-bills/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Sidebar navigation
│   │   └── BillPreview.jsx     # Printable bill format
│   ├── pages/
│   │   ├── CreateBill.jsx      # New bill form
│   │   ├── BillsList.jsx       # All saved bills
│   │   └── ViewBill.jsx        # Single bill view & print
│   ├── lib/
│   │   └── supabase.js         # DB connection & helpers
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── supabase_schema.sql         # ← Run this in Supabase first!
├── .env.example                # Copy to .env and fill keys
├── .github/workflows/
│   └── deploy.yml              # Auto-deploy to GitHub Pages
└── package.json
```

---

## 🚀 Setup Guide

### Step 1 — Set up Supabase (Database)

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Click **"New Project"**, give it a name (e.g. `rajput-bills`)
3. Once the project is ready, go to **SQL Editor**
4. Copy the contents of `supabase_schema.sql` and run it
5. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon / public key**

---

### Step 2 — Run Locally

```bash
# 1. Clone this repo
git clone https://github.com/YOUR_USERNAME/rajput-bills.git
cd rajput-bills

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Now edit .env and paste your Supabase URL and key

# 4. Start the dev server
npm run dev
# Open http://localhost:5173
```

---

### Step 3 — Deploy to GitHub Pages

1. **Push this project to your GitHub repository**

2. **Add Supabase secrets to GitHub:**
   - Go to your repo on GitHub
   - Click **Settings → Secrets and variables → Actions**
   - Add two secrets:
     - `VITE_SUPABASE_URL` → your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key

3. **Enable GitHub Pages:**
   - Go to **Settings → Pages**
   - Under **Source**, select **"GitHub Actions"**

4. **Push to main branch** — the site will auto-deploy! 🎉

Your bill generator will be live at:
`https://YOUR_USERNAME.github.io/rajput-bills/`

---

## 📋 Supabase Table: `bills`

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Auto-generated primary key |
| `created_at` | Timestamptz | Auto-set on insert |
| `bill_no` | Text | Bill number (e.g. 310326001) |
| `date` | Text | Bill date (DD/MM/YYYY) |
| `client_name` | Text | M/s. client name |
| `route` | Text | Trip route |
| `duty_slip` | Text | Duty slip number |
| `car_type` | Text | Type of car |
| `car_no` | Text | Car registration number |
| `amount` | Numeric | Base amount in ₹ |
| `total_kms` | Text | Total kilometers |
| `extra_kms` | Text | Extra KMs |
| `extra_kms_rate` | Text | Rate per extra KM |
| `total_hrs` | Text | Total hours |
| `extra_hrs` | Text | Extra hours |
| `extra_hrs_rate` | Text | Rate per extra hour |
| `outstation` | Text | Outstation info |
| `outstation_extra` | Text | Extra outstation |
| `outstation_rate` | Text | Outstation rate |
| `toll_parking` | Text | Toll/Parking description |
| `toll_amount` | Numeric | Toll/Parking amount |
| `driver_allowance` | Text | Driver food/overnight allowance |
| `car_used_by` | Text | Person who used the car |
| `car_booked_by` | Text | Person who booked the car |
| `particulars_rate` | Text | Particulars rate description |

---

## 🖨️ Printing Bills

- Click **"Preview Bill"** on the Create Bill page to see a live preview
- Click **"Print Bill"** to open the browser print dialog
- The bill prints in the exact same format as the original Rajput Tour & Travels bill

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Database | Supabase (PostgreSQL) |
| Printing | react-to-print |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

---

## 📞 Contact

**Rajput Tour & Travels**  
Flat No - 706, Bldg No - 14, H - 1, Shradha Sabri Society, Sanghrsh Nagar,  
Chandivali, Andheri (E) Mumbai - 400 072  
📧 rajputtoursandtravels2016@gmail.com  
📱 7304315584  
PAN: CBHPS4753G
