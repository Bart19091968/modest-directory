# ModestDirectory

Een directory voor islamitische kledingwinkels in Nederland en België.

## Features

- 🏪 Shop directory met zoek- en filterfunctie
- ⭐ Review systeem met email verificatie
- 📝 Winkel aanmeldformulier
- 🎯 SEO geoptimaliseerd (meta tags, sitemap, structured data)
- 🔐 Admin panel voor beheer
- 📢 Banner/sponsor systeem
- 🇳🇱🇧🇪 Gericht op Nederland en België

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Email**: Resend
- **Styling**: Tailwind CSS
- **Hosting**: Railway

---

## 🚀 Deployment op Railway

### Stap 1: GitHub Repository

1. Maak een nieuwe GitHub repository
2. Push deze code naar de repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/JOUW-USERNAME/modest-directory.git
   git push -u origin main
   ```

### Stap 2: Railway Account & Project

1. Ga naar [railway.app](https://railway.app) en maak een account
2. Klik op **"New Project"**
3. Kies **"Deploy from GitHub repo"**
4. Selecteer je repository

### Stap 3: PostgreSQL Database Toevoegen

1. In je Railway project, klik op **"+ New"**
2. Kies **"Database"** → **"Add PostgreSQL"**
3. Railway maakt automatisch een database aan
4. De `DATABASE_URL` wordt automatisch gekoppeld

### Stap 4: Environment Variables

Klik op je service → **Variables** → voeg toe:

| Variable | Waarde |
|----------|--------|
| `NEXT_PUBLIC_SITE_URL` | `https://jouw-app.up.railway.app` (of je eigen domein) |
| `RESEND_API_KEY` | Je Resend API key (zie stap 5) |
| `FROM_EMAIL` | `noreply@jouwdomein.be` |
| `ADMIN_EMAIL` | `jouw@email.com` |
| `JWT_SECRET` | Willekeurige lange string (bijv. `openssl rand -base64 32`) |

### Stap 5: Resend Setup (Email)

1. Ga naar [resend.com](https://resend.com) en maak een gratis account
2. Voeg je domein toe of gebruik hun test domein
3. Kopieer je API key naar Railway

### Stap 6: Database Initialiseren

Na deployment, open de Railway terminal:

```bash
npx prisma db push
npm run db:seed
```

Dit maakt:
- Database tabellen
- Admin account: `admin@modestdirectory.be` / `admin123`
- Voorbeeldwinkels

### Stap 7: Custom Domein (Optioneel)

1. In Railway, ga naar **Settings** → **Domains**
2. Voeg je eigen domein toe (bijv. `modestdirectory.be`)
3. Volg de DNS instructies
4. Update `NEXT_PUBLIC_SITE_URL` naar je nieuwe domein

---

## 🔍 SEO & Zoekmachines

### Google Search Console

1. Ga naar [search.google.com/search-console](https://search.google.com/search-console)
2. Voeg je domein toe
3. Verifieer via DNS of HTML tag
4. Dien je sitemap in: `https://jouwdomein.be/sitemap.xml`

### Bing Webmaster Tools

1. Ga naar [bing.com/webmasters](https://www.bing.com/webmasters)
2. Voeg je domein toe
3. Importeer vanuit Google Search Console (makkelijkst)

---

## 💰 Kosten Overzicht

| Service | Kosten |
|---------|--------|
| Railway (Hobby) | $5/maand |
| PostgreSQL | Inbegrepen |
| Resend | Gratis (100 emails/dag) |
| **Totaal** | **~$5/maand** |

---

## 🛠 Lokaal Ontwikkelen

```bash
# Dependencies installeren
npm install

# Environment variables
cp .env.example .env
# Vul de .env in met je waarden

# Database setup
npx prisma db push
npm run db:seed

# Development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structuur

```
modest-directory/
├── app/
│   ├── page.tsx              # Homepage
│   ├── shops/
│   │   ├── page.tsx          # Shop listing
│   │   └── [slug]/page.tsx   # Shop detail
│   ├── aanmelden/            # Shop registratie
│   ├── verify/[token]/       # Email verificatie
│   ├── admin/                # Admin panel
│   └── api/                  # API routes
├── components/               # React components
├── lib/                      # Utilities (db, email, auth)
├── prisma/                   # Database schema & seed
└── public/                   # Static files
```

---

## 🔐 Admin Panel

Toegang via: `https://jouwdomein.be/admin`

Functies:
- Winkelaanvragen goedkeuren/afwijzen
- Reviews bekijken en verwijderen
- Dashboard met statistieken

**Standaard login (wijzig na eerste login!):**
- Email: `admin@modestdirectory.be`
- Wachtwoord: `admin123`

---

## 📧 Email Templates

De volgende emails worden automatisch verstuurd:
- **Review verificatie**: Wanneer iemand een review plaatst
- **Admin notificatie**: Bij nieuwe winkelaanmelding

---

## 🎨 Aanpassen

### Kleuren
Edit `tailwind.config.js` voor je eigen kleurenpalet:
```js
colors: {
  accent: {
    DEFAULT: '#5d7a5d',  // Jouw hoofdkleur
    dark: '#4a624a',
  }
}
```

### Logo
Vervang de tekst-logo in `app/layout.tsx` door een afbeelding.

---

## Support

Vragen? Open een issue op GitHub.
