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
- Zugriff mit **MongoDB Compass**: `mongodb://admin:adminpassword@localhost:27018/?authSource=admin`

---

## Voraussetzungen

Folgende Programme müssen **vor dem Start** installiert sein:

### 1. Visual Studio Code (VSCode)
1. Öffne [https://code.visualstudio.com](https://code.visualstudio.com)
2. Lade VSCode für dein Betriebssystem herunter und installiere es
3. Starte VSCode nach der Installation

> **Empfehlung:** VSCode ist der empfohlene Editor für dieses Projekt. Alle folgenden Schritte beziehen sich auf VSCode.

### 2. Docker Desktop
1. Öffne [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Lade Docker Desktop für dein Betriebssystem herunter und installiere es
3. Starte Docker Desktop und warte, bis das Symbol in der Taskleiste **grün** wird

> **Wichtig:** Docker Desktop muss immer im Hintergrund laufen, wenn du das Projekt startest.

### 3. Git
1. Öffne [https://git-scm.com/downloads](https://git-scm.com/downloads)
2. Lade Git herunter und installiere es

---

## Installation & Start

> **Übersicht der Reihenfolge:**
> 1. Visual Studio Code installieren & starten
> 2. Docker Desktop starten (grünes Symbol abwarten)
> 3. Repository klonen
> 4. Projektordner in VSCode öffnen
> 5. Erster Start: `docker-compose up --build` (Images bauen + starten)
> 6. Browser öffnen

### Schritt 1: Repository klonen

Du hast zwei Möglichkeiten, das Repository zu klonen:

#### Option A: Klonen über das VSCode-Terminal (empfohlen)

1. Öffne VSCode
2. Öffne das integrierte Terminal über das Menü **Terminal → Neues Terminal** (oder Tastenkürzel `` Strg+` ``)
3. Navigiere in einen Ordner deiner Wahl, z. B.:
   ```bash
   cd C:\Users\DeinName\Projekte
   ```
4. Klone das Repository:
   ```bash
   git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
   ```

#### Option B: Klonen über die VSCode-Oberfläche

1. Öffne VSCode
2. Klicke auf **Quellcodeverwaltung** (Symbol in der linken Seitenleiste, oder `Strg+Shift+G`)
3. Klicke auf **Repository klonen**
4. Gib folgende URL ein und bestätige mit Enter:
   ```
   https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
   ```
5. Wähle einen Zielordner auf deinem Computer aus
6. Klicke auf **In neuem Fenster öffnen**, wenn VSCode danach fragt

### Schritt 2: Projektordner in VSCode öffnen

Falls VSCode den Ordner nicht automatisch geöffnet hat:

1. Klicke in VSCode auf **Datei → Ordner öffnen…** (oder `Strg+K`, dann `Strg+O`)
2. Navigiere zum geklonten Ordner `Neue-Datenbankkonzepte_Notizen-API`
3. Klicke auf **Ordner auswählen**

Der Projektordner ist nun in VSCode geöffnet und du siehst alle Dateien in der linken Seitenleiste.

### Schritt 3: Erster Start – Images bauen und alle Services starten

```bash
docker-compose up --build
```

> **Was passiert hier?**
> - `--build` sorgt dafür, dass die Docker-Images für Backend und Frontend gebaut werden.
> - Beim **ersten Start** ist dieser Schritt zwingend erforderlich.
> - Das Bauen dauert beim ersten Mal **2–5 Minuten** – danach geht es schneller.
> - Für Docker ist keine `.env`-Datei nötig – alle Werte sind in `docker-compose.yml` vorkonfiguriert.

Warte, bis im Terminal folgende Meldungen erscheinen (weiterer Output danach ist normal):
- `Server läuft auf Port 5000`
- `Local: http://localhost:5173`

### Schritt 4: Im Browser öffnen

| Service | URL |
|---|---|
| Frontend | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:5000](http://localhost:5000) |
| MongoDB | `localhost:27018` |

---

## Folgestarts (ab dem 2. Mal)

Wenn die Images bereits gebaut wurden, reicht beim nächsten Start:

```bash
# Im Vordergrund (mit Log-Ausgabe im Terminal):
docker-compose up

# Oder im Hintergrund (Terminal bleibt frei):
docker-compose up -d
```

> **Hinweis:** `docker-compose up --build` ist nur beim ersten Start oder nach Code-Änderungen nötig. Danach genügt `docker-compose up` bzw. `docker-compose up -d`.

---

## Services stoppen

```bash
# Strg+C im Terminal (wenn im Vordergrund gestartet), dann:
docker-compose down

# Oder stoppen inkl. Datenbank leeren:
docker-compose down -v
```

---

## Probleme beim Start?

Sollte beim Start etwas nicht funktionieren, hilft in den meisten Fällen folgendes:

- **Docker Desktop läuft nicht** → Starte Docker Desktop und warte, bis das Symbol in der Taskleiste **grün** ist
- **Port 5000 oder 5173 bereits belegt** → Beende das andere Programm oder starte Docker neu (`docker-compose down`, dann erneut starten)
- **Docker-Fehler (`dockerDesktopLinuxEngine`)** → Docker Desktop neu starten
- **MongoDB Compass verbindet sich nicht** → Stelle sicher, dass die Container laufen (`docker-compose up --build` beim ersten Start, `docker-compose up -d` bei Folgestarts)

---

## MongoDB Compass (optional)

Mit [MongoDB Compass](https://www.mongodb.com/products/compass) kannst du die Datenbank grafisch einsehen.

**Voraussetzung:** Die Container müssen laufen (Schritt 2 oder Folgestart muss abgeschlossen sein).

**Verbindungs-URI:**
```
mongodb://admin:adminpassword@localhost:27018/?authSource=admin
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
