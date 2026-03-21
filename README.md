# Neue-Datenbankkonzepte_Notizen-API

Eine vollständige Notizen-API mit optionalem Web-Frontend zur Verwaltung digitaler Notizen. Das Projekt wurde im Rahmen des Moduls "Neue Datenbankkonzepte" entwickelt.

## Funktionen

- ✅ **Benutzerverwaltung**: Registrierung und Login mit JWT-Authentifizierung
- ✅ **Notizen CRUD**: Erstellen, Lesen, Aktualisieren, Löschen
- ✅ **Optionale Attribute**: Tags, Prioritäten, Erinnerungsdaten
- ✅ **Benutzerdefinierte Zusatzfelder**: Flexible Key-Value-Paare
- ✅ **Checklisten**: Verschachtelte Aufgaben innerhalb von Notizen
- ✅ **Filter & Suche**: Nach Tags, Prioritäten, Volltextsuche
- ✅ **Admin-Funktionen**: Benutzer- und Notizenverwaltung
- ✅ **Modernes Web-Frontend**: Responsive Design mit TypeScript

## Technologie-Stack

### Backend
- **Node.js** mit **Express.js**
- **TypeScript**
- **MongoDB** mit **Mongoose**
- **JWT** für Authentifizierung
- **bcryptjs** für Passwort-Hashing

### Frontend
- **TypeScript**
- **Vite** (Build-Tool und Dev-Server)
- **Vanilla CSS** (modernes, responsives Design)

## Installation

### Voraussetzungen
- Node.js (Version 18 oder höher)
- MongoDB (lokal oder MongoDB Atlas)

### Schritt 1: Repository klonen

```bash
git clone https://github.com/FelixDHBW/Neue-Datenbankkonzepte_Notizen-API.git
cd Neue-Datenbankkonzepte_Notizen-API
```

### Schritt 2: Umgebungsvariablen konfigurieren

Erstelle im `backend`-Ordner eine `.env`-Datei:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notizen-api
JWT_SECRET=dein-geheimer-schluessel-mindestens-32-zeichen-lang
```

**Für MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notizen-api
```

### Schritt 3: Abhängigkeiten installieren

**Root-Verzeichnis (für Workspaces):**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

**Frontend:**
```bash
cd frontend
npm install
cd ..
```

### Schritt 4: Datenbank mit Testdaten füllen (optional)

```bash
cd backend
npm run seed
```

Dieser Befehl erstellt:
- Einen Admin-Benutzer: `admin@example.com` / `AdminPassword123!`
- Einen normalen Benutzer: `user@example.com` / `UserPassword123!`
- Beispielnotizen für den normalen Benutzer

## Anwendung starten

Du benötigst **zwei Terminals**, um Backend und Frontend gleichzeitig zu starten:

### Terminal 1: Backend starten

```bash
cd backend
npm run dev
```

Das Backend läuft dann auf `http://localhost:5000`

### Terminal 2: Frontend starten

```bash
cd frontend
npm run dev
```

Das Frontend läuft dann auf `http://localhost:5173`

### Alternative: Schnellstart

Wenn du nur das Backend brauchst (z.B. für API-Tests mit Postman):

```bash
npm run dev
```

(Dieser Befehl startet nur das Backend aus dem Root-Verzeichnis.)

## Nutzung

### Web-Frontend

1. Öffne `http://localhost:5173` im Browser
2. Registriere dich oder melde dich an
3. Erstelle, bearbeite und verwalte deine Notizen

### Test-Benutzer (nach Seeding)

| Rolle | E-Mail | Passwort |
|-------|--------|----------|
| Administrator | `admin@example.com` | `AdminPassword123!` |
| Benutzer | `user@example.com` | `UserPassword123!` |

### API-Endpunkte

#### Authentifizierung
| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| POST | `/api/auth/register` | Registrierung |
| POST | `/api/auth/login` | Login |

#### Notizen (erfordert Authentifizierung)
| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| GET | `/api/notes` | Alle Notizen (mit Filter) |
| GET | `/api/notes/:id` | Einzelne Notiz |
| POST | `/api/notes` | Notiz erstellen |
| PUT | `/api/notes/:id` | Notiz aktualisieren |
| DELETE | `/api/notes/:id` | Notiz löschen |

**Filter-Parameter für GET /api/notes:**
- `?tag=arbeit` - Filter nach Tag
- `?priority=high` - Filter nach Priorität
- `?search=keyword` - Volltextsuche
- `?sort=asc` oder `?sort=desc` - Sortierung

#### Admin (erfordert Admin-Rolle)
| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| GET | `/api/admin/users` | Alle Benutzer |
| DELETE | `/api/admin/users/:id` | Benutzer löschen |
| GET | `/api/admin/notes` | Alle Notizen systemweit |

## Projektstruktur

```
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts              # MongoDB-Verbindung
│   │   ├── controllers/
│   │   │   ├── authController.ts  # Login/Register
│   │   │   ├── noteController.ts  # Notizen CRUD
│   │   │   └── adminController.ts # Admin-Funktionen
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts  # JWT-Validierung
│   │   │   └── roleMiddleware.ts  # Admin-Prüfung
│   │   ├── models/
│   │   │   ├── User.ts            # Benutzer-Modell
│   │   │   └── Note.ts            # Notiz-Modell
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── noteRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── types/
│   │   │   └── index.d.ts
│   │   ├── index.ts               # Server-Einstieg
│   │   └── seed.ts                # Testdaten
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api.ts                 # API-Client
│   │   ├── main.ts                # App-Logik
│   │   └── styles.css             # Styles
│   ├── index.html
│   ├── package.json
│   └── tsconfig.json
└── package.json
```

## Lizenz

ISC

## Autoren

- Niklas Kiefer
- Felix Guist

DHBW Heidenheim - Neue Datenbankkonzepte - WWI24-A
