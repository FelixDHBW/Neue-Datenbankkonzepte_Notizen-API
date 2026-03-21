# Entwicklungs-Image
FROM node:20-alpine

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Package.json kopieren
COPY package.json ./

# Dependencies installieren
RUN npm install

# TypeScript-Konfiguration kopieren
COPY tsconfig.json ./

# Index.html kopieren (wichtig für Vite!)
COPY index.html ./

# Port freigeben
EXPOSE 5173

# Startbefehl
CMD ["npm", "run", "dev", "--", "--host"]
