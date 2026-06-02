import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '../../data/charlotte.db');

let _db = null;

export function getDb() {
  if (_db) return _db;
  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');
  return _db;
}

export function initDb() {
  const db = getDb();

  db.exec(`
    -- Core items table
    CREATE TABLE IF NOT EXISTS items (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL,
      category    TEXT NOT NULL,
      subcategory TEXT,
      description TEXT,

      -- Location
      address     TEXT,
      neighborhood TEXT,
      lat         REAL,
      lng         REAL,
      drive_time  TEXT,

      -- Scheduling metadata
      time_of_day TEXT,          -- 'morning' | 'afternoon' | 'evening' | 'any'
      day_of_week TEXT,          -- 'monday' | 'thursday' | null (for recurring)
      recurrence  TEXT,          -- 'weekly' | 'monthly' | 'annual' | null
      event_date  TEXT,          -- ISO date string for one-time events
      ticket_required INTEGER DEFAULT 0,
      remind_days_before INTEGER DEFAULT 0,

      -- Status
      visited     INTEGER DEFAULT 0,
      visited_by  TEXT,          -- 'manue' | 'partner' | 'both'
      visited_at  TEXT,          -- ISO datetime
      source      TEXT DEFAULT 'manual', -- 'manual' | 'auto-add' | 'scraped'
      external_url TEXT,
      ticket_url  TEXT,

      created_at  TEXT DEFAULT (datetime('now')),
      updated_at  TEXT DEFAULT (datetime('now'))
    );

    -- Activity log for partner sync
    CREATE TABLE IF NOT EXISTS activity_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id    INTEGER REFERENCES items(id) ON DELETE CASCADE,
      action     TEXT NOT NULL,  -- 'visited' | 'unvisited' | 'added' | 'deleted'
      actor      TEXT NOT NULL,  -- 'manue' | 'partner'
      note       TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Day plans
    CREATE TABLE IF NOT EXISTS plans (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT,
      plan_date  TEXT,           -- ISO date
      vibe       TEXT,           -- 'active_morning' | 'food_crawl' | 'date_night' | 'chill'
      created_at TEXT DEFAULT (datetime('now'))
    );

    -- Items within a plan, ordered
    CREATE TABLE IF NOT EXISTS plan_items (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      plan_id      INTEGER REFERENCES plans(id) ON DELETE CASCADE,
      item_id      INTEGER REFERENCES items(id) ON DELETE CASCADE,
      position     INTEGER NOT NULL,
      arrival_time TEXT,         -- e.g. '9:00 AM'
      note         TEXT
    );

    -- Indexes for common queries
    CREATE INDEX IF NOT EXISTS idx_items_category    ON items(category);
    CREATE INDEX IF NOT EXISTS idx_items_visited     ON items(visited);
    CREATE INDEX IF NOT EXISTS idx_items_neighborhood ON items(neighborhood);
    CREATE INDEX IF NOT EXISTS idx_items_event_date  ON items(event_date);
    CREATE INDEX IF NOT EXISTS idx_activity_log_item ON activity_log(item_id);
    CREATE INDEX IF NOT EXISTS idx_plan_items_plan   ON plan_items(plan_id);
  `);

  console.log('✓ Database initialized');
  return db;
}
