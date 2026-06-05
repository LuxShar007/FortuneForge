import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'fortune_forge.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Initialize database schema
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NULL,
      google_id TEXT UNIQUE NULL,
      microsoft_id TEXT UNIQUE NULL,
      income REAL DEFAULT 0,
      expenses REAL DEFAULT 0,
      risk_profile TEXT DEFAULT '',
      character_class TEXT DEFAULT '',
      baseline_configured INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 350,
      completed_quests TEXT DEFAULT '',
      name TEXT DEFAULT '',
      profile_picture TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table checked/created successfully.');
    }
  });

  // Migrations for existing databases
  db.run(`ALTER TABLE users ADD COLUMN xp INTEGER DEFAULT 350`, (err) => {
    // Silently ignore if column already exists
  });
  db.run(`ALTER TABLE users ADD COLUMN completed_quests TEXT DEFAULT ''`, (err) => {
    // Silently ignore if column already exists
  });
  db.run(`ALTER TABLE users ADD COLUMN name TEXT DEFAULT ''`, (err) => {
    // Silently ignore if column already exists
  });
  db.run(`ALTER TABLE users ADD COLUMN profile_picture TEXT DEFAULT ''`, (err) => {
    // Silently ignore if column already exists
  });
});

// Promise-based helper functions
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export default {
  query,
  run,
  get
};
