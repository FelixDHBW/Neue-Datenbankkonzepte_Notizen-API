# 📝 Notizen-API

Eine vollständige Full-Stack-Notizen-Anwendung mit Express.js Backend, Vite Frontend und MongoDB. Entwickelt im Rahmen des Moduls **"Neue Datenbankkonzepte"** an der DHBW Heidenheim.

---

## ✨ Funktionen

| Bereich | Funktion |
|---|---|
| 🔐 **Auth** | Registrierung & Login mit JWT, Passwort-Hashing (bcrypt) |
| 📝 **Notizen** | Erstellen, Lesen, Aktualisieren, Löschen (CRUD) |
| 🏷️ **Tags & Filter** | Tags, Prioritäten (low/medium/high), Volltextsuche, Sortierung |
| ⏰ **Erinnerungen** | Optionales Erinnerungsdatum pro Notiz |
| 🔧 **Zusatzfelder** | Flexible Key-Value-Paare pro Notiz |
| ✅ **Checklisten** | Verschachtelte Aufgaben innerhalb von Notizen |
| 👑 **Admin-Bereich** | Benutzer- & Notizenverwaltung, Systemstatistiken |
| 🎨 **Frontend** | Responsives Web-UI mit TypeScript & Vite |

---

## 🛠️ Technologie-Stack

### Backend
- **Node.js** + **Express.js** (ES Modules)
- **TypeScript** mit strikter Typisierung
- **MongoDB** + **Mongoose** ODM
- **JWT** für Authentifizierung
- **bcryptjs** für Passwort-Hashing
- **tsx** für TypeScript-Ausführung im Dev-Modus

### Frontend
- **TypeScript** (Vanilla)
- **Vite** (Build-Tool & Dev-Server mit `--force` Cache-Busting)
- **Vanilla CSS** (modernes, responsives Design)

### Infrastruktur & Tooling
- **Docker Compose** für containerisierte Entwicklung
- **npm Workspaces** (Monorepo)
- **ESLint** + **Prettier** für Code-Qualität

---

## 📋 Voraussetzungen

- **Node.js** ≥ 18 — [Download](https://nodejs.org/) (LTS empfohlen)
- **MongoDB** (lokal oder Atlas) — [Download](https://www.mongodb.com/try/download/community)
- **Docker Desktop** *(optional, für Docker-Betrieb)* — [Download](https://www.docker.com/products/docker-desktop)

---

## 🚀 Schnellstart

### Option 1: Alles per Docker Compose

```bash
# Repository klonen
git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
cd Neue-Datenbankkonzepte_Notizen-API

# Alle Services starten (MongoDB + Backend + Frontend)
npm run docker:up
```

| Service | URL |
|---|---|
| 🗄️ MongoDB | `localhost:27017` |
| 🖥️ Backend API | http://localhost:5000 |
| 🎨 Frontend | http://localhost:5173 |

```bash
# Services stoppen
npm run docker:down
```

> ⚠️ **Docker Desktop muss laufen.** Falls der Fehler `dockerDesktopLinuxEngine` erscheint, Docker Desktop neu starten und warten bis das Symbol in der Taskleiste grün wird.

---

### Option 2: Lokale Entwicklung

#### 1. Repository klonen & Dependencies installieren

```bash
git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
cd Neue-Datenbankkonzepte_Notizen-API
npm install
```

#### 2. Umgebungsvariablen konfigurieren

```bash
# Windows (CMD)
copy apps\backend\.env.example apps\backend\.env

# Windows (PowerShell) / Mac / Linux
cp apps/backend/.env.example apps/backend/.env
```

Die `.env`-Datei ist bereits für lokale MongoDB vorkonfiguriert:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notizen-api
JWT_SECRET=dein-geheimer-schluessel-mindestens-32-zeichen-lang
NODE_ENV=development
```

#### 3. Testdaten einfügen (optional)

```bash
npm run seed
```

Erstellt folgende Testkonten:
| Rolle | E-Mail | Passwort |
|---|---|---|
| 👑 Admin | `admin@example.com` | `AdminPassword123!` |
| 👤 Benutzer | `user@example.com` | `UserPassword123!` |

#### 4. Anwendung starten

```bash
# Backend UND Frontend gleichzeitig starten
npm run dev
```

| Service | URL |
|---|---|
| 🖥️ Backend | http://localhost:5000 |
| 🎨 Frontend | http://localhost:5173 |

---

## 🔀 Einzeln starten

### Nur Backend

```bash
npm run dev -w backend
# oder direkt:
cd apps/backend && npm run dev
```

### Nur Frontend

```bash
npm run dev -w frontend
# oder direkt:
cd apps/frontend && npm run dev
```

### Hybrid: Nur DB per Docker, Code lokal

```bash
# Nur MongoDB als Container starten
docker-compose up -d mongodb

# Backend & Frontend lokal starten (mit Hot-Reload)
npm run dev
```

> 💡 Ideal für die Entwicklung — Hot-Reload funktioniert lokal schneller als im Container.

---

## 🔧 Verfügbare Scripts

### Root-Level

| Script | Beschreibung |
|---|---|
| `npm run dev` | Backend + Frontend parallel starten |
| `npm run build` | Backend + Frontend bauen |
| `npm run seed` | Datenbank mit Testdaten füllen |
| `npm run test` | Alle Tests ausführen |
| `npm run test:watch` | Tests im Watch-Modus |
| `npm run test:coverage` | Tests mit Coverage-Report |
| `npm run lint` | ESLint für beide Projekte |
| `npm run lint:fix` | ESLint mit automatischer Fehlerbehebung |
| `npm run format` | Prettier Formatierung |
| `npm run docker:up` | Docker Compose starten |
| `npm run docker:down` | Docker Compose stoppen |

### Backend-Spezifisch

| Script | Beschreibung |
|---|---|
| `npm run dev -w backend` | Dev-Server mit Hot-Reload |
| `npm run build -w backend` | TypeScript kompilieren |
| `npm run start -w backend` | Kompilierte App starten |
| `npm run test -w backend` | Tests ausführen |

### Frontend-Spezifisch

| Script | Beschreibung |
|---|---|
| `npm run dev -w frontend` | Vite Dev-Server (mit `--force`) |
| `npm run build -w frontend` | Produktions-Build |
| `npm run preview -w frontend` | Build-Vorschau |

---

## 📚 API-Endpunkte

### Authentifizierung

| Methode | Endpunkt | Beschreibung | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Benutzer registrieren | ❌ |
| `POST` | `/api/auth/login` | Benutzer anmelden | ❌ |

### Notizen

| Methode | Endpunkt | Beschreibung | Auth |
|---|---|---|---|
| `GET` | `/api/notes` | Alle eigenen Notizen abrufen | ✅ |
| `POST` | `/api/notes` | Neue Notiz erstellen | ✅ |
| `GET` | `/api/notes/:id` | Einzelne Notiz abrufen | ✅ |
| `PUT` | `/api/notes/:id` | Notiz aktualisieren | ✅ |
| `DELETE` | `/api/notes/:id` | Notiz löschen | ✅ |

**Query-Parameter für `GET /api/notes`:**

| Parameter | Typ | Beschreibung |
|---|---|---|
| `tag` | string | Nach Tag filtern |
| `priority` | `low` \| `medium` \| `high` | Nach Priorität filtern |
| `search` | string | Volltextsuche in Titel & Inhalt |
| `sort` | `asc` \| `desc` | Sortierrichtung (Standard: `desc`) |

### Admin *(Admin-Rolle erforderlich)*

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/admin/stats` | Systemstatistiken (Benutzer- & Notizanzahl) |
| `GET` | `/api/admin/users` | Alle Benutzer auflisten |
| `GET` | `/api/admin/users/:id/notes-count` | Notizanzahl eines Benutzers |
| `DELETE` | `/api/admin/users/:id` | Benutzer inkl. aller Notizen löschen |
| `GET` | `/api/admin/notes` | Alle Notizen systemweit auflisten |

---

## 🔐 Authentifizierung

Die API verwendet **JWT Bearer Tokens**.

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "UserPassword123!"
}
```

**Antwort:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "role": "Benutzer"
  }
}
```

**Geschützte Endpunkte:**
```http
GET /api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🏗️ Projektstruktur

```
📦 Neue-Datenbankkonzepte_Notizen-API
├── 📁 apps/
│   ├── 📁 backend/                 # Express.js API
│   │   ├── 📁 src/
│   │   │   ├── 📁 config/          # Datenbank-Konfiguration
│   │   │   ├── 📁 controllers/     # HTTP-Request-Handler
│   │   │   ├── 📁 middleware/      # Auth & Rollen-Middleware
│   │   │   ├── 📁 models/          # Mongoose-Modelle (User, Note)
│   │   │   ├── 📁 routes/          # API-Routen
│   │   │   ├── 📁 services/        # Geschäftslogik
│   │   │   ├── 📁 types/           # TypeScript-Typen
│   │   │   ├── index.ts            # Einstiegspunkt
│   │   │   └── seed.ts             # Testdaten-Skript
│   │   ├── 📄 Dockerfile
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   └── 📁 frontend/                # Vite + TypeScript Client
│       ├── 📁 src/
│       │   ├── api.ts              # API-Kommunikation
│       │   ├── main.ts             # App-Logik & UI
│       │   └── styles.css          # Styling
│       ├── 📄 index.html           # Einstiegspunkt
│       ├── 📄 Dockerfile
│       └── 📄 package.json
├── 📁 documents/                   # Projektdokumentation
├── 📄 docker-compose.yml           # Docker Compose Konfiguration
├── 📄 package.json                 # Root Package (Workspaces)
└── 📄 README.md
```

---

## 🐳 Docker-Entwicklung

```bash
# Alle Services bauen und starten
docker-compose up --build

# Im Hintergrund starten
docker-compose up -d

# Logs eines Services anzeigen
docker-compose logs -f backend
docker-compose logs -f frontend

# Einen Service neu starten
docker-compose restart backend

# Stoppen und Container entfernen
docker-compose down

# Stoppen inkl. Volumes (Datenbank wird geleert)
docker-compose down -v
```

---

## 🎨 Code-Qualität

```bash
# ESLint ausführen
npm run lint

# ESLint mit automatischer Fehlerbehebung
npm run lint:fix

# Prettier Formatierung anwenden
npm run format
```

---

## 📝 Lizenz

ISC

---

## 👨‍💻 Autor

Entwickelt im Rahmen des Moduls **"Neue Datenbankkonzepte"** an der **DHBW Heidenheim**.

Bei Fragen oder Problemen: [GitHub Issues](https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API/issues)
