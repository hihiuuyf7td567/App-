import * as SQLite from "expo-sqlite";
import { runMigrations } from "./migrations";
import { seedDatabase } from "./seed";
import type { CourseWithStops } from "./types";

let _db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (_db) return _db;
  _db = await SQLite.openDatabaseAsync("par.db");
  await runMigrations(_db);
  await seedDatabase(_db);
  return _db;
}

export async function getAllCoursesWithStops(): Promise<CourseWithStops[]> {
  const db = await getDatabase();

  const courses = await db.getAllAsync<{
    id: string;
    name: string;
    tagline: string;
    description: string;
    creator_user_id: string | null;
    visibility: string;
    is_featured: number;
    neighborhood: string;
    created_at: string;
  }>(`SELECT * FROM courses ORDER BY name`);

  const result: CourseWithStops[] = [];

  for (const c of courses) {
    const stops = await db.getAllAsync<{
      course_id: string;
      bar_id: string;
      position: number;
      id: string;
      name: string;
      type: string;
      address: string;
      lat: number;
      lng: number;
      baseline_par: number;
      order_friction: string;
      hours_json: string;
    }>(
      `SELECT cs.course_id, cs.bar_id, cs.position,
              b.id, b.name, b.type, b.address, b.lat, b.lng,
              b.baseline_par, b.order_friction, b.hours_json
       FROM course_stops cs
       JOIN bars b ON b.id = cs.bar_id
       WHERE cs.course_id = ?
       ORDER BY cs.position`,
      [c.id]
    );

    const coursePar = stops.reduce((sum, s) => sum + s.baseline_par, 0);

    result.push({
      id: c.id,
      name: c.name,
      tagline: c.tagline,
      description: c.description,
      creatorUserId: c.creator_user_id,
      visibility: c.visibility as "private" | "link" | "public",
      isFeatured: c.is_featured === 1,
      neighborhood: c.neighborhood,
      createdAt: c.created_at,
      coursePar,
      stops: stops.map((s) => ({
        courseId: s.course_id,
        barId: s.bar_id,
        position: s.position,
        bar: {
          id: s.id,
          name: s.name,
          type: s.type,
          address: s.address,
          lat: s.lat,
          lng: s.lng,
          baselinePar: s.baseline_par,
          orderFriction: s.order_friction as "low" | "medium" | "high",
          hoursByWeekday: JSON.parse(s.hours_json),
        },
      })),
    });
  }

  return result;
}
