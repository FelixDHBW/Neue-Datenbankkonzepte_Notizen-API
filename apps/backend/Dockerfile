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

# Port freigeben
EXPOSE 5000

# Startbefehl
CMD ["npm", "run", "dev"]
