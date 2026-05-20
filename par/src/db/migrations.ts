import type { SQLiteDatabase } from "expo-sqlite";

export async function runMigrations(db: SQLiteDatabase): Promise<void> {
  await db.execAsync(`PRAGMA journal_mode = WAL;`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      run_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const applied = await db.getAllAsync<{ name: string }>(
    `SELECT name FROM migrations ORDER BY id`
  );
  const appliedNames = new Set(applied.map((r) => r.name));

  for (const migration of MIGRATIONS) {
    if (!appliedNames.has(migration.name)) {
      await db.withTransactionAsync(async () => {
        await db.execAsync(migration.sql);
        await db.runAsync(`INSERT INTO migrations (name) VALUES (?)`, [
          migration.name,
        ]);
      });
    }
  }
}

const MIGRATIONS: Array<{ name: string; sql: string }> = [
  {
    name: "001_initial_schema",
    sql: `
      CREATE TABLE IF NOT EXISTS bars (
        id            TEXT PRIMARY KEY,
        name          TEXT NOT NULL,
        type          TEXT NOT NULL,
        address       TEXT NOT NULL,
        lat           REAL NOT NULL,
        lng           REAL NOT NULL,
        baseline_par  INTEGER NOT NULL CHECK (baseline_par BETWEEN 1 AND 5),
        order_friction TEXT NOT NULL CHECK (order_friction IN ('low', 'medium', 'high')),
        hours_json    TEXT NOT NULL DEFAULT '{}'
      );

      CREATE TABLE IF NOT EXISTS courses (
        id              TEXT PRIMARY KEY,
        name            TEXT NOT NULL,
        tagline         TEXT NOT NULL DEFAULT '',
        description     TEXT NOT NULL DEFAULT '',
        creator_user_id TEXT,
        visibility      TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'link', 'public')),
        is_featured     INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
        neighborhood    TEXT NOT NULL DEFAULT '',
        created_at      TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS course_stops (
        course_id TEXT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        bar_id    TEXT NOT NULL REFERENCES bars(id),
        position  INTEGER NOT NULL,
        PRIMARY KEY (course_id, bar_id),
        UNIQUE (course_id, position)
      );

      CREATE TABLE IF NOT EXISTS users (
        id         TEXT PRIMARY KEY,
        username   TEXT NOT NULL,
        avatar     TEXT,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS plays (
        id                    TEXT PRIMARY KEY,
        course_id             TEXT NOT NULL REFERENCES courses(id),
        started_at            TEXT NOT NULL,
        ended_at              TEXT,
        status                TEXT NOT NULL DEFAULT 'in_progress'
                                CHECK (status IN ('in_progress', 'completed', 'abandoned')),
        current_stop_position INTEGER NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS play_participants (
        play_id     TEXT NOT NULL REFERENCES plays(id) ON DELETE CASCADE,
        user_id     TEXT NOT NULL REFERENCES users(id),
        joined_at   TEXT NOT NULL,
        final_score INTEGER,
        PRIMARY KEY (play_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS drinks (
        id            TEXT PRIMARY KEY,
        play_id       TEXT NOT NULL REFERENCES plays(id) ON DELETE CASCADE,
        user_id       TEXT NOT NULL REFERENCES users(id),
        bar_id        TEXT NOT NULL REFERENCES bars(id),
        stop_position INTEGER NOT NULL,
        logged_at     TEXT NOT NULL,
        drink_type    TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_course_stops_course ON course_stops(course_id, position);
      CREATE INDEX IF NOT EXISTS idx_drinks_play ON drinks(play_id, logged_at);
    `,
  },
];
