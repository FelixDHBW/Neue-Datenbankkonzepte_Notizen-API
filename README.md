# Notizen-API

Eine vollständige Full-Stack-Notizen-Anwendung mit Express.js Backend, Vite Frontend und MongoDB. Entwickelt im Rahmen des Moduls **"Neue Datenbankkonzepte"** an der DHBW Heidenheim.

---

## Funktionen

| Bereich | Funktion |
|---|---|
| **Auth** | Registrierung & Login mit JWT, Passwort-Hashing (bcrypt) |
| **Notizen** | Erstellen, Lesen, Aktualisieren, Löschen (CRUD) |
| **Tags & Filter** | Tags, Prioritäten (low/medium/high), Volltextsuche, Sortierung |
| **Erinnerungen** | Optionales Erinnerungsdatum pro Notiz |
| **Zusatzfelder** | Flexible Key-Value-Paare pro Notiz |
| **Checklisten** | Verschachtelte Aufgaben innerhalb von Notizen |
| **Admin-Bereich** | Benutzer- & Notizenverwaltung, Systemstatistiken |
| **Frontend** | Responsives Web-UI mit TypeScript & Vite |

---

## Technologie-Stack

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

## Voraussetzungen

### Für alle Optionen benötigt:

**Docker Desktop**
1. Öffne [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Lade Docker Desktop für dein Betriebssystem herunter und installiere es
3. Starte Docker Desktop und warte, bis das Symbol in der Taskleiste **grün** wird

> **Hinweis:** Docker Desktop muss immer im Hintergrund laufen, wenn du das Projekt startest.

### Zusätzlich für lokale Entwicklung:

**Node.js (Version 18 oder neuer)**
1. Öffne [https://nodejs.org/](https://nodejs.org/)
2. Klicke auf **"LTS"** und lade den Installer herunter
3. Führe den Installer aus (alle Standardeinstellungen übernehmen)
4. Überprüfe die Installation:
   ```bash
   node --version
   # Ausgabe: v20.x.x oder höher
   ```

**Git**
1. Öffne [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Lade Git herunter und installiere es

---

## Option 1: Docker Compose *(empfohlen)*

Der einfachste Weg — alles läuft in Containern, keine weitere Konfiguration nötig.

### Schritt 1: Repository klonen

```bash
git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
cd Neue-Datenbankkonzepte_Notizen-API
```

### Schritt 2: Alle Services starten

```bash
docker-compose up --build
```

> Beim ersten Start werden die Docker-Images gebaut — das dauert 2–5 Minuten. Danach geht es schneller.

Warte, bis im Terminal folgende Meldungen erscheinen:
- `Server läuft auf Port 5000`
- `Local: http://localhost:5173`

### Schritt 3: Im Browser öffnen

| Service | URL |
|---|---|
| Frontend | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| MongoDB | `localhost:27017` |

### Services stoppen

```bash
# Strg+C im Terminal, dann:
docker-compose down

# Oder stoppen inkl. Datenbank leeren:
docker-compose down -v
```

---

## Option 2: Lokale Entwicklung *(für Entwickler mit Hot-Reload)*

Ideal wenn du am Code arbeitest — Änderungen werden sofort im Browser sichtbar.

### Schritt 1: Repository klonen & Dependencies installieren

```bash
git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
cd Neue-Datenbankkonzepte_Notizen-API
npm install
```

### Schritt 2: MongoDB per Docker starten

```bash
docker-compose up -d mongodb
```

Überprüfe, ob der Container läuft:
```bash
docker ps
# Du solltest einen Container namens "mongodb" sehen
```

### Schritt 3: Umgebungsvariablen einrichten

**Windows (CMD):**
```cmd
copy apps\backend\.env.example apps\backend\.env
```

**Windows (PowerShell) / Mac / Linux:**
```bash
cp apps/backend/.env.example apps/backend/.env
```

Die Datei ist bereits vollständig vorkonfiguriert — **du musst nichts ändern**:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notizen-api
JWT_SECRET=dein-geheimer-schluessel-mindestens-32-zeichen-lang
NODE_ENV=development
```

> Der `MONGO_URI` zeigt auf den MongoDB-Container (`localhost:27017`), der von Docker Compose gestartet wird. **Dieser Wert ist für alle Entwickler identisch.**

### Schritt 4: Anwendung starten

```bash
npm run dev
```

Warte, bis beide Services bereit sind:

| Service | URL | Bereit wenn... |
|---|---|---|
| Backend | [http://localhost:5000](http://localhost:5000) | `Server läuft auf Port 5000` erscheint |
| Frontend | [http://localhost:5173](http://localhost:5173) | `Local: http://localhost:5173` erscheint |

### Anwendung stoppen

```bash
# Strg+C im Terminal (stoppt Backend & Frontend)

# MongoDB-Container stoppen
docker-compose down
```

---

## Testdaten einfügen

> **Automatisches Seeding:** Beim ersten Start (lokal oder per Docker) werden die Testdaten automatisch eingespielt, sofern die Datenbank noch leer ist. Ein manueller Aufruf ist daher nur nötig, um die Daten zurückzusetzen.

Um die Datenbank manuell mit Beispieldaten zu befüllen (löscht alle bestehenden Daten):

```bash
npm run seed
```

Danach kannst du dich mit diesen Testkonten anmelden:

| Rolle | E-Mail | Passwort |
|---|---|---|
| Admin | `admin@example.com` | `AdminPassword123!` |
| Benutzer | `user@example.com` | `UserPassword123!` |

---

## Häufige Probleme

### „Cannot connect to MongoDB" / Datenbankfehler
→ Docker Desktop läuft nicht. Starte Docker Desktop, warte bis es grün ist, dann erneut versuchen.

### „Port 5000 already in use"
→ Ein anderes Programm nutzt Port 5000. Beende es oder ändere `PORT=5001` in `apps/backend/.env`.

### „Port 5173 already in use"
→ Ein anderer Vite-Dev-Server läuft noch. Beende ihn mit `Strg+C` oder starte das Frontend auf einem anderen Port:
```bash
npm run dev -w frontend -- --port 5174
```

### „npm: command not found"
→ Node.js ist nicht installiert. Installiere Node.js (siehe Voraussetzungen).

### Frontend zeigt alte Daten / lädt nicht richtig
→ Vite-Cache leeren:
```bash
cd apps/frontend && npx vite --force
```

### Docker-Fehler: `dockerDesktopLinuxEngine`
→ Docker Desktop neu starten und warten bis das Symbol in der Taskleiste grün wird.

---

## Verfügbare Scripts

### Root-Level

| Script | Beschreibung |
|---|---|
| `npm run dev` | Backend + Frontend parallel starten (lokal) |
| `npm run build` | Backend + Frontend bauen |
| `npm run seed` | Datenbank mit Testdaten füllen |
| `npm run lint` | ESLint für beide Projekte |
| `npm run lint:fix` | ESLint mit automatischer Fehlerbehebung |
| `npm run format` | Prettier Formatierung |
| `npm run docker:up` | Alle Services per Docker Compose starten |
| `npm run docker:down` | Docker Compose stoppen |

### Backend-Spezifisch

| Script | Beschreibung |
|---|---|
| `npm run dev -w backend` | Dev-Server mit Hot-Reload |
| `npm run build -w backend` | TypeScript kompilieren |
| `npm run start -w backend` | Kompilierte App starten |

### Frontend-Spezifisch

| Script | Beschreibung |
|---|---|
| `npm run dev -w frontend` | Vite Dev-Server (mit `--force`) |
| `npm run build -w frontend` | Produktions-Build |
| `npm run preview -w frontend` | Build-Vorschau |

---

## API-Endpunkte

### Authentifizierung

| Methode | Endpunkt | Beschreibung | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Benutzer registrieren | Nein |
| `POST` | `/api/auth/login` | Benutzer anmelden | Nein |

### Notizen

| Methode | Endpunkt | Beschreibung | Auth |
|---|---|---|---|
| `GET` | `/api/notes` | Alle eigenen Notizen abrufen | Ja |
| `POST` | `/api/notes` | Neue Notiz erstellen | Ja |
| `GET` | `/api/notes/:id` | Einzelne Notiz abrufen | Ja |
| `PUT` | `/api/notes/:id` | Notiz aktualisieren | Ja |
| `DELETE` | `/api/notes/:id` | Notiz löschen | Ja |

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
| `PATCH` | `/api/admin/users/:id/ban` | Benutzer sperren (`isActive = false`) |
| `PATCH` | `/api/admin/users/:id/unban` | Benutzer entsperren (`isActive = true`) |
| `GET` | `/api/admin/notes` | Alle Notizen systemweit auflisten |

---

## Authentifizierung

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
  "message": "Anmeldung erfolgreich.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
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

## Projektstruktur

```
Neue-Datenbankkonzepte_Notizen-API
├── apps/
│   ├── backend/                 # Express.js API
│   │   ├── src/
│   │   │   ├── config/          # Datenbank-Konfiguration
│   │   │   ├── controllers/     # HTTP-Request-Handler
│   │   │   ├── middleware/      # Auth & Rollen-Middleware
│   │   │   ├── models/          # Mongoose-Modelle (User, Note)
│   │   │   ├── routes/          # API-Routen
│   │   │   ├── services/        # Geschäftslogik
│   │   │   ├── types/           # TypeScript-Typen
│   │   │   ├── index.ts         # Einstiegspunkt
│   │   │   └── seed.ts          # Testdaten-Skript
│   │   ├── .env.example         # Vorlage für Umgebungsvariablen
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/                # Vite + TypeScript Client
│       ├── src/
│       │   ├── api/             # API-Kommunikation
│       │   ├── views/           # UI-Komponenten
│       │   ├── types/           # TypeScript-Typen
│       │   ├── utils/           # Hilfsfunktionen
│       │   ├── main.ts          # App-Einstiegspunkt
│       │   └── styles.css       # Styling
│       ├── index.html           # HTML-Einstiegspunkt
│       ├── Dockerfile
│       └── package.json
├── documents/                   # Projektdokumentation
├── docker-compose.yml           # Docker Compose Konfiguration
├── package.json                 # Root Package (Workspaces)
└── README.md
```

---

## Code-Qualität

```bash
# ESLint ausführen
npm run lint

# ESLint mit automatischer Fehlerbehebung
npm run lint:fix

# Prettier Formatierung anwenden
npm run format
```

---

## Lizenz

ISC

---

## Autoren

Entwickelt im Rahmen des Moduls **"Neue Datenbankkonzepte"** an der **DHBW Heidenheim**.

- **Niklas Kiefer**
- **Felix Guist**
