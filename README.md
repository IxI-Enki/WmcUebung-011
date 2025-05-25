# Protocol <sub><sub> by Jan Ritt </sub></sub>

## WMC Übung 11 - Express-Projekt mit MSSQL-Integration

### Beschreibung
Dieses Projekt entstand im Kontext der WMC-Aufgabe.
Das Ziel bestand darin, ein Express-Projekt zu entwickeln, das mit einer MSSQL-Datenbank interagiert, um Mitarbeiterdaten zu verwalten.

### Funktionen

- Verbindung zu einer MSSQL-Datenbank
- API-Route zum Abrufen aller Mitarbeiter mit optionaler Filter- und Suchfunktion
- API-Route zum Hinzufügen eines neuen Mitarbeiters
- Middleware für JSON- und URL-kodierte Daten
- Statische Dateien aus dem `public/`-Ordner

### Technologien

- **Express.js**: Web-Framework für Node.js
- **MSSQL**: Microsoft SQL Server für die Datenbank
- **Node.js**: JavaScript-Laufzeitumgebung

### Installation und Ausführung

1. **Abhängigkeiten installieren**:
   ```bash
   npm install express mssql body-parser
   ```
2. **Server starten**:
   ```bash
   npm start
   ```
3. **Anwendung testen**:
  - API-Endpunkte
    - GET /api/employees: Ruft eine Liste aller Mitarbeiter ab. Optionale Abfrageparameter: active und search.
    - POST /api/employees: Fügt einen neuen Mitarbeiter hinzu. Erwartet einen JSON-Body mit den Mitarbeiterdetails.

