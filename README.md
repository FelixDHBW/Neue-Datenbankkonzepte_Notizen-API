# Neue-Datenbankkonzepte_Notizen-API

Eine vollständige Notizen-API mit modernem Web-Frontend zur Verwaltung digitaler Notizen. Das Projekt wurde im Rahmen des Moduls "Neue Datenbankkonzepte" entwickelt und folgt modernen Best Practices für Full-Stack-Anwendungen.

## ✨ Funktionen

- ✅ **Benutzerverwaltung**: Registrierung und Login mit JWT-Authentifizierung
- ✅ **Notizen CRUD**: Erstellen, Lesen, Aktualisieren, Löschen
- ✅ **Optionale Attribute**: Tags, Prioritäten, Erinnerungsdaten
- ✅ **Benutzerdefinierte Zusatzfelder**: Flexible Key-Value-Paare
- ✅ **Checklisten**: Verschachtelte Aufgaben innerhalb von Notizen
- ✅ **Filter & Suche**: Nach Tags, Prioritäten, Volltextsuche
- ✅ **Admin-Funktionen**: Benutzer- und Notizenverwaltung
- ✅ **Modernes Web-Frontend**: Responsive Design mit TypeScript

## 🛠️ Technologie-Stack

### Backend
- **Node.js** mit **Express.js** (ES Modules)
- **TypeScript** mit strikter Typisierung
- **MongoDB** mit **Mongoose**
- **JWT** für Authentifizierung
- **bcryptjs** für Passwort-Hashing
- **tsx** für TypeScript-Ausführung im Dev-Modus

### Frontend
- **TypeScript**
- **Vite** (Build-Tool und Dev-Server)
- **Vanilla CSS** (modernes, responsives Design)

### Entwicklung & Testing
- **Jest** mit Supertest für Unit- und Integrationstests
- **ESLint** + **Prettier** für Code-Qualität
- **Docker Compose** für containerisierte Entwicklung
- **npm Workspaces** für Monorepo-Management

---

## 📋 Voraussetzungen

### Erforderlich

- **Node.js** (Version 18 oder höher) - [Download](https://nodejs.org/)
  - Wählen Sie die LTS-Version (Long Term Support)
  - Überprüfen Sie die Installation mit: `node --version`

### Datenbank (eine Option wählen)

**Option A: MongoDB lokal**
- **MongoDB Community Server** - [Download](https://www.mongodb.com/try/download/community)
  - Für Windows: MongoDB Community Server + MongoDB Compass (GUI)
  - Für Mac: MongoDB Community Edition über Homebrew (`brew tap mongodb/brew && brew install mongodb-community`)
  - Für Linux: Paketmanager Ihrer Distribution

**Option B: MongoDB Atlas (Cloud)**
- Kostenloses Konto unter [MongoDB Atlas](https://www.mongodb.com/atlas)
- Keine lokale Installation erforderlich

### Optional: Docker

- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop)
  - Für Windows 10/11 (Pro/Home) oder Mac
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)
  - Docker Compose wird automatisch mit Docker Desktop installiert

---

## 🚀 Schnellstart

### Option 1: Mit Docker Compose (empfohlen)

Die einfachste Methode, um das gesamte Projekt zu starten:

```bash
# Repository klonen
git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
cd Neue-Datenbankkonzepte_Notizen-API

# Alle Services starten (MongoDB, Backend, Frontend)
npm run docker:up

# Oder mit Docker Compose direkt
docker-compose up -d
```

**Verfügbare Services:**
- 🗄️ **MongoDB**: http://localhost:27017
- 🖥️ **Backend API**: http://localhost:5000
- 🎨 **Frontend**: http://localhost:5173

### Option 2: Lokale Entwicklung

#### 1. Repository klonen

```bash
git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
cd Neue-Datenbankkonzepte_Notizen-API
```

#### 2. Dependencies installieren

```bash
# Installiert alle Dependencies für Backend und Frontend
npm install
```

#### 3. Umgebungsvariablen konfigurieren

Erstelle im `apps/backend`-Ordner eine `.env`-Datei:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notizen-api
JWT_SECRET=dein-geheimer-schluessel-mindestens-32-zeichen-lang
```

**Für MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notizen-api
```

#### 4. Datenbank mit Testdaten füllen (optional)

```bash
npm run seed
```

Dieser Befehl erstellt:
- 👤 **Admin-Benutzer**: `admin@example.com` / `AdminPassword123!`
- 👤 **Normaler Benutzer**: `user@example.com` / `UserPassword123!`
- 📝 Beispielnotizen für den normalen Benutzer

#### 5. Anwendung starten

```bash
# Backend und Frontend gleichzeitig starten
npm run dev
```

**URLs:**
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

---

## 🧪 Testing

Das Projekt enthält umfassende Tests mit Jest:

```bash
# Alle Tests ausführen
npm run test

# Tests im Watch-Modus (bei Dateiänderungen neu ausführen)
npm run test:watch

# Tests mit Coverage-Report
npm run test:coverage
```

**Test-Struktur:**
```
apps/backend/src/__tests__/
├── setup.ts                      # Test-Konfiguration
├── unit/
│   ├── authService.test.ts      # AuthService Unit-Tests
│   └── noteService.test.ts      # NoteService Unit-Tests
└── integration/
    └── authRoutes.test.ts       # API Integrationstests
```

---

## 🎨 Code-Qualität

### Linting und Formatierung

```bash
# ESLint ausführen
npm run lint

# ESLint mit automatischer Fehlerbehebung
npm run lint:fix

# Prettier Formatierung anwenden
npm run format
```

---

## 🏗️ Projektstruktur

```
📦 Neue-Datenbankkonzepte_Notizen-API
├── 📁 apps/
│   ├── 📁 backend/                 # Express.js API
│   │   ├── 📁 src/
│   │   │   ├── 📁 __tests__/      # Jest Tests
│   │   │   │   ├── 📁 integration/# Integrationstests
│   │   │   │   └── 📁 unit/       # Unit-Tests
│   │   │   ├── 📁 config/         # Datenbank-Konfiguration
│   │   │   ├── 📁 controllers/    # HTTP-Request-Handler
│   │   │   ├── 📁 middleware/     # Auth & Role Middleware
│   │   │   ├── 📁 models/         # Mongoose-Modelle
│   │   │   ├── 📁 routes/         # API-Routen
│   │   │   ├── 📁 services/       # Geschäftslogik
│   │   │   ├── 📁 types/          # TypeScript-Typen
│   │   │   ├── index.ts           # Einstiegspunkt
│   │   │   └── seed.ts            # Testdaten
│   │   ├── 📄 Dockerfile
│   │   ├── 📄 eslint.config.mjs
│   │   ├── 📄 jest.config.js
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   └── 📁 frontend/               # Vite + TypeScript Client
│       ├── 📁 src/
│       │   ├── api.ts
│       │   ├── main.ts
│       │   └── styles.css
│       ├── 📄 Dockerfile
│       ├── 📄 eslint.config.js
│       ├── 📄 package.json
│       └── 📄 tsconfig.json
├── 📁 documents/                  # Dokumentation
├── 📁 .vscode/                    # VSCode Einstellungen
├──  .dockerignore
├── 📄 .prettierrc                 # Prettier-Konfiguration
├── 📄 docker-compose.yml          # Docker Compose Konfiguration
├── 📄 package.json                # Root Package (Workspaces)
└── 📄 README.md
```

---

## 🔧 Verfügbare Scripts

### Root-Level

| Script | Beschreibung |
|--------|-------------|
| `npm run dev` | Startet Backend und Frontend parallel |
| `npm run test` | Führt alle Tests aus |
| `npm run test:watch` | Tests im Watch-Modus |
| `npm run test:coverage` | Tests mit Coverage-Report |
| `npm run lint` | Linting für beide Projekte |
| `npm run lint:fix` | Linting mit automatischer Fehlerbehebung |
| `npm run format` | Prettier Formatierung |
| `npm run seed` | Datenbank mit Testdaten füllen |
| `npm run docker:up` | Docker Compose starten |
| `npm run docker:down` | Docker Compose stoppen |

### Backend-Spezifisch

| Script | Beschreibung |
|--------|-------------|
| `npm run dev -w backend` | Backend im Dev-Modus |
| `npm run build -w backend` | TypeScript kompilieren |
| `npm run start -w backend` | Kompilierte App starten |
| `npm run test -w backend` | Tests ausführen |
| `npm run lint -w backend` | ESLint ausführen |
| `npm run format -w backend` | Prettier Formatierung |

### Frontend-Spezifisch

| Script | Beschreibung |
|--------|-------------|
| `npm run dev -w frontend` | Vite Dev-Server |
| `npm run build -w frontend` | Produktions-Build |
| `npm run preview -w frontend` | Build preview |
| `npm run lint -w frontend` | ESLint + TypeScript Check |
| `npm run format -w frontend` | Prettier Formatierung |

---

## 🔐 Authentifizierung

Die API verwendet JWT (JSON Web Tokens) für die Authentifizierung.

### Token erhalten

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

### Geschützte Endpunkte

Füge den Token im Authorization-Header hinzu:

```http
GET /api/notes
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📚 API-Endpunkte

### Authentifizierung

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| POST | `/api/auth/register` | Benutzer registrieren |
| POST | `/api/auth/login` | Benutzer anmelden |

### Notizen (Authentifizierung erforderlich)

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| GET | `/api/notes` | Alle Notizen abrufen |
| POST | `/api/notes` | Neue Notiz erstellen |
| GET | `/api/notes/:id` | Einzelne Notiz abrufen |
| PUT | `/api/notes/:id` | Notiz aktualisieren |
| DELETE | `/api/notes/:id` | Notiz löschen |

### Admin (Admin-Rolle erforderlich)

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| GET | `/api/admin/users` | Alle Benutzer auflisten |
| DELETE | `/api/admin/users/:id` | Benutzer inkl. aller Notizen löschen |
| GET | `/api/admin/notes` | Alle Notizen systemweit auflisten |

---

## 🐳 Docker-Entwicklung

### Container bauen und starten

```bash
# Alle Services bauen und starten
docker-compose up --build

# Im Hintergrund starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f backend

# Einen bestimmten Service neu starten
docker-compose restart backend
```

### Container stoppen

```bash
# Container stoppen und entfernen
docker-compose down

# Inklusive Volumes löschen
docker-compose down -v
```

---

## 📝 Lizenz

ISC

---

## 👨‍💻 Autor

Entwickelt im Rahmen des Moduls "Neue Datenbankkonzepte" an der DHBW Heidenheim.

Bei Fragen oder Problemen erstelle gerne ein [GitHub Issue](https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API/issues).
