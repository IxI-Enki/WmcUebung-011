import express from 'express';
import sql from 'mssql';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Konfiguration für die MSSQL-Datenbankverbindung
const dbConfig = {
  user: 'sa', // Standard-Benutzername für SQL Server
  password: 'PoSe!2425', // Das Passwort, das du in deiner Docker-Konfiguration angegeben hast
  server: 'localhost', // Server-Adresse
  database: 'master', // Standard-Datenbank, du kannst dies anpassen
  options: {
    encrypt: false, // Für lokale Entwicklung
    trustServerCertificate: true // Für lokale Entwicklung
  }
};

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Startseite Route
app.get('/', (req, res) => {
  res.send('Willkommen zur Kundenverwaltung!');
});

// API-Route zum Abrufen aller Mitarbeiter mit optionaler Filter- und Suchfunktion
app.get('/api/employees', async (req, res) => {
  // Prüft, ob nur aktive Mitarbeiter gefiltert werden sollen
  const onlyActive = req.query.active === 'true';
  // Optionaler Suchbegriff für Name oder E-Mail
  const search = req.query.search || '';

  try {
    await sql.connect(dbConfig);
    let request = new sql.Request();

    // Grundlegende SQL-Abfrage
    let sqlQuery = 'SELECT * FROM employees';

    // Wenn ein Suchbegriff vorhanden ist, wird die WHERE-Klausel ergänzt
    if (search) {
      sqlQuery += ' WHERE (firstname LIKE @search OR lastname LIKE @search OR email LIKE @search)';
      request.input('search', `%${search}%`);
      // Falls zusätzlich nach aktiven Mitarbeitern gefiltert werden soll
      if (onlyActive) {
        sqlQuery += ' AND active = 1';
      }
    } else if (onlyActive) {
      // Nur aktive Mitarbeiter ohne Suchbegriff
      sqlQuery += ' WHERE active = 1';
    }

    // Sortiert das Ergebnis nach der ID
    sqlQuery += ' ORDER BY id';

    // Führt die SQL-Abfrage mit den Parametern aus
    const result = await request.query(sqlQuery);
    // Gibt die gefundenen Mitarbeiter als JSON zurück
    res.json(result.recordset);
  } catch (error) {
    // Fehlerbehandlung bei Datenbankproblemen
    console.error('Fehler beim Abrufen:', error);
    res.status(500).send('Serverfehler');
  } finally {
    sql.close();
  }
});

// API-Route zum Hinzufügen eines Mitarbeiters
app.post('/api/employees', async (req, res) => {
  console.log('Body empfangen:', req.body);
  const { firstname, lastname, email, position, hired_date, active } = req.body;

  try {
    await sql.connect(dbConfig);
    let request = new sql.Request();

    await request.input('firstname', sql.NVarChar, firstname)
      .input('lastname', sql.NVarChar, lastname)
      .input('email', sql.NVarChar, email)
      .input('position', sql.NVarChar, position)
      .input('hired_date', sql.Date, hired_date)
      .input('active', sql.Bit, active)
      .query(`INSERT INTO employees (firstname, lastname, email, position, hired_date, active)
              VALUES (@firstname, @lastname, @email, @position, @hired_date, @active)`);

    res.status(201).send('Mitarbeiter erfolgreich hinzugefügt');
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Mitarbeiters:', error);
    res.status(500).send('Fehler beim Hinzufügen');
  } finally {
    sql.close();
  }
});

// Server starten
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
