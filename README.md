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

### Frontend
- **TypeScript** (Vanilla)
- **Vite** (Build-Tool & Dev-Server)
- **Vanilla CSS** (modernes, responsives Design)

### Infrastruktur
- **Docker Compose** für containerisierte Ausführung

### Datenbank
- **MongoDB 7** (NoSQL-Dokumentendatenbank)
- Läuft als eigener Docker-Container (`notizen-mongodb`)
- Verbindungs-URI: `mongodb://admin:adminpassword@localhost:27018/notizen-api?authSource=admin`
- Zugriff mit **MongoDB Compass**: Verbindung über `mongodb://admin:adminpassword@localhost:27018/?authSource=admin`

> **Hinweis für MongoDB Compass:** Docker Desktop muss laufen und `docker-compose up -d` muss ausgeführt worden sein, bevor eine Verbindung möglich ist. MongoDB läuft ausschließlich als Docker-Container – ohne Docker gibt es keinen Datenbankserver auf Port 27018.

---

## Voraussetzungen

**Docker Desktop**
1. Öffne [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Lade Docker Desktop für dein Betriebssystem herunter und installiere es
3. Starte Docker Desktop und warte, bis das Symbol in der Taskleiste **grün** wird

> **Hinweis:** Docker Desktop muss immer im Hintergrund laufen, wenn du das Projekt startest.

**Git**
1. Öffne [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Lade Git herunter und installiere es

---

## Installation & Start

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

> **Hinweis:** Für Docker keine `.env` nötig – alle Werte sind in `docker-compose.yml` vorkonfiguriert.

Warte, bis im Terminal folgende Meldungen erscheinen (es erscheint noch weiterer Output danach – das ist normal):
- `Server läuft auf Port 5000`
- `Local: http://localhost:5173`

### Schritt 3: Im Browser öffnen

| Service | URL |
|---|---|
| Frontend | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| MongoDB | `localhost:27018` |

### Services stoppen

```bash
# Strg+C im Terminal, dann:
docker-compose down

# Oder stoppen inkl. Datenbank leeren:
docker-compose down -v
```

---

## Testdaten

> **Automatisches Seeding:** Beim ersten Start werden die Testdaten automatisch eingespielt, sofern die Datenbank noch leer ist.

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
→ Ein anderes Programm nutzt Port 5000. Beende es oder starte Docker neu.

### „Port 5173 already in use"
→ Ein anderer Vite-Dev-Server läuft noch. Beende ihn mit `Strg+C`.

### Docker-Fehler: `dockerDesktopLinuxEngine`
→ Docker Desktop neu starten und warten bis das Symbol in der Taskleiste grün wird.

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

## Lizenz

ISC

---

## Autoren

Entwickelt im Rahmen des Moduls **"Neue Datenbankkonzepte"** an der **DHBW Heidenheim**.

- **Niklas Kiefer**
- **Felix Guist**
