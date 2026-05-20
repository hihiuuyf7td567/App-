import type { SQLiteDatabase } from "expo-sqlite";
import type { Bar, Course, CourseStop } from "./types";

const SEED_BARS: Bar[] = [
  {
    id: "10-1-4",
    name: "10 1/4 Pasadena",
    type: "Speakeasy",
    address: "12 E Colorado Blvd",
    lat: 34.1456,
    lng: -118.1502,
    baselinePar: 2,
    orderFriction: "high",
    hoursByWeekday: {
      mon: null,
      tue: null,
      wed: ["19:00", "01:00"],
      thu: ["19:00", "01:00"],
      fri: ["19:00", "02:00"],
      sat: ["19:00", "02:00"],
      sun: ["19:00", "00:00"],
    },
  },
  {
    id: "ladies-gentlemen",
    name: "Ladies and Gentlemen",
    type: "Speakeasy",
    address: "59 E Colorado Blvd",
    lat: 34.1461,
    lng: -118.1492,
    baselinePar: 2,
    orderFriction: "high",
    hoursByWeekday: {
      mon: null,
      tue: null,
      wed: ["20:00", "02:00"],
      thu: ["20:00", "02:00"],
      fri: ["20:00", "02:00"],
      sat: ["20:00", "02:00"],
      sun: null,
    },
  },
  {
    id: "the-speakeasy",
    name: "The Speakeasy",
    type: "Speakeasy",
    address: "25 N Raymond Ave",
    lat: 34.1463,
    lng: -118.1491,
    baselinePar: 2,
    orderFriction: "high",
    hoursByWeekday: {
      mon: null,
      tue: null,
      wed: ["19:00", "02:00"],
      thu: ["19:00", "02:00"],
      fri: ["19:00", "02:00"],
      sat: ["19:00", "02:00"],
      sun: ["19:00", "00:00"],
    },
  },
  {
    id: "edwin-mills",
    name: "Edwin Mills by Equator",
    type: "Pub",
    address: "22 Mills Pl",
    lat: 34.1455,
    lng: -118.1511,
    baselinePar: 2,
    orderFriction: "medium",
    hoursByWeekday: {
      mon: ["11:00", "22:00"],
      tue: ["11:00", "22:00"],
      wed: ["11:00", "22:00"],
      thu: ["11:00", "23:00"],
      fri: ["11:00", "23:00"],
      sat: ["10:00", "23:00"],
      sun: ["10:00", "22:00"],
    },
  },
  {
    id: "kings-row",
    name: "Kings Row Gastropub",
    type: "Gastropub",
    address: "20 E Colorado Blvd",
    lat: 34.1456,
    lng: -118.1501,
    baselinePar: 2,
    orderFriction: "medium",
    hoursByWeekday: {
      mon: ["11:00", "23:00"],
      tue: ["11:00", "23:00"],
      wed: ["11:00", "23:00"],
      thu: ["11:00", "23:00"],
      fri: ["11:00", "00:00"],
      sat: ["11:00", "00:00"],
      sun: ["11:00", "23:00"],
    },
  },
  {
    id: "blind-donkey",
    name: "The Blind Donkey",
    type: "Pub",
    address: "53 Union St",
    lat: 34.1469,
    lng: -118.1493,
    baselinePar: 3,
    orderFriction: "medium",
    hoursByWeekday: {
      mon: ["16:00", "00:00"],
      tue: ["16:00", "00:00"],
      wed: ["16:00", "00:00"],
      thu: ["16:00", "00:00"],
      fri: ["16:00", "02:00"],
      sat: ["14:00", "02:00"],
      sun: ["14:00", "00:00"],
    },
  },
  {
    id: "barneys",
    name: "Barney's Beanery",
    type: "Gastropub",
    address: "99 E Colorado Blvd",
    lat: 34.146,
    lng: -118.1484,
    baselinePar: 3,
    orderFriction: "medium",
    hoursByWeekday: {
      mon: ["11:00", "02:00"],
      tue: ["11:00", "02:00"],
      wed: ["11:00", "02:00"],
      thu: ["11:00", "02:00"],
      fri: ["11:00", "02:00"],
      sat: ["11:00", "02:00"],
      sun: ["11:00", "02:00"],
    },
  },
  {
    id: "stone-brewing",
    name: "Stone Brewing Tap Room",
    type: "Brewery",
    address: "220 S Raymond Ave",
    lat: 34.1417,
    lng: -118.1484,
    baselinePar: 3,
    orderFriction: "low",
    hoursByWeekday: {
      mon: null,
      tue: ["12:00", "21:00"],
      wed: ["12:00", "21:00"],
      thu: ["12:00", "21:00"],
      fri: ["12:00", "22:00"],
      sat: ["11:00", "22:00"],
      sun: ["11:00", "21:00"],
    },
  },
  {
    id: "dungeon",
    name: "The Dungeon",
    type: "Lounge",
    address: "72 N Fair Oaks Ave",
    lat: 34.1471,
    lng: -118.1502,
    baselinePar: 3,
    orderFriction: "medium",
    hoursByWeekday: {
      mon: ["21:00", "02:00"],
      tue: ["21:00", "02:00"],
      wed: ["21:00", "02:00"],
      thu: ["21:00", "02:00"],
      fri: ["21:00", "02:00"],
      sat: ["21:00", "02:00"],
      sun: ["21:00", "02:00"],
    },
  },
  {
    id: "35er",
    name: "The 35er",
    type: "Dive bar",
    address: "12 E Colorado Blvd",
    lat: 34.1456,
    lng: -118.1502,
    baselinePar: 4,
    orderFriction: "low",
    hoursByWeekday: {
      mon: ["11:00", "02:00"],
      tue: ["11:00", "02:00"],
      wed: ["11:00", "02:00"],
      thu: ["11:00", "02:00"],
      fri: ["11:00", "02:00"],
      sat: ["11:00", "02:00"],
      sun: ["11:00", "02:00"],
    },
  },
  {
    id: "der-wolf",
    name: "Der Wolf",
    type: "Sports & dance bar",
    address: "72 N Fair Oaks Ave",
    lat: 34.1471,
    lng: -118.1504,
    baselinePar: 4,
    orderFriction: "low",
    hoursByWeekday: {
      mon: ["17:00", "02:00"],
      tue: ["17:00", "02:00"],
      wed: ["17:00", "02:00"],
      thu: ["17:00", "02:00"],
      fri: ["17:00", "02:00"],
      sat: ["17:00", "02:00"],
      sun: ["17:00", "02:00"],
    },
  },
  {
    id: "old-towne-pub",
    name: "Old Towne Pub",
    type: "Dive bar",
    address: "66 N Fair Oaks Ave",
    lat: 34.1472,
    lng: -118.1498,
    baselinePar: 4,
    orderFriction: "low",
    hoursByWeekday: {
      mon: ["14:00", "02:00"],
      tue: null,
      wed: ["14:00", "02:00"],
      thu: ["14:00", "02:00"],
      fri: ["14:00", "02:00"],
      sat: ["12:00", "02:00"],
      sun: ["12:00", "02:00"],
    },
  },
];

type SeedCourse = {
  course: Course;
  stops: Omit<CourseStop, "courseId">[];
};

const SEED_COURSES: SeedCourse[] = [
  {
    course: {
      id: "old-town-classic",
      name: "Old Town Classic",
      tagline: "The benchmark",
      description:
        "Pubs to gastropubs to dives. The course every group should play first.",
      creatorUserId: null,
      visibility: "public",
      isFeatured: true,
      neighborhood: "Old Town Pasadena",
      createdAt: new Date().toISOString(),
    },
    stops: [
      { barId: "kings-row", position: 1 },
      { barId: "barneys", position: 2 },
      { barId: "blind-donkey", position: 3 },
      { barId: "old-towne-pub", position: 4 },
    ],
    // course par = 2+3+3+4 = 12
  },
  {
    course: {
      id: "speakeasy-slow",
      name: "Speakeasy Slow",
      tagline: "Date night, theatrical drinks",
      description: "Three hidden bars within two blocks. Slow burn.",
      creatorUserId: null,
      visibility: "public",
      isFeatured: true,
      neighborhood: "Old Town Pasadena",
      createdAt: new Date().toISOString(),
    },
    stops: [
      { barId: "10-1-4", position: 1 },
      { barId: "ladies-gentlemen", position: 2 },
      { barId: "the-speakeasy", position: 3 },
    ],
    // course par = 2+2+2 = 6
  },
  {
    course: {
      id: "dive-crawl",
      name: "Dive Crawl",
      tagline: "Locals only",
      description: "Karaoke, Dodgers, dim light. Bring water.",
      creatorUserId: null,
      visibility: "public",
      isFeatured: true,
      neighborhood: "Old Town Pasadena",
      createdAt: new Date().toISOString(),
    },
    stops: [
      { barId: "35er", position: 1 },
      { barId: "der-wolf", position: 2 },
      { barId: "dungeon", position: 3 },
      { barId: "old-towne-pub", position: 4 },
    ],
    // course par = 4+4+3+4 = 15
  },
];

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  const existing = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) as count FROM bars`
  );
  if (existing && existing.count > 0) return;

  await db.withTransactionAsync(async () => {
    for (const bar of SEED_BARS) {
      await db.runAsync(
        `INSERT OR IGNORE INTO bars
           (id, name, type, address, lat, lng, baseline_par, order_friction, hours_json)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bar.id,
          bar.name,
          bar.type,
          bar.address,
          bar.lat,
          bar.lng,
          bar.baselinePar,
          bar.orderFriction,
          JSON.stringify(bar.hoursByWeekday),
        ]
      );
    }

    for (const { course, stops } of SEED_COURSES) {
      await db.runAsync(
        `INSERT OR IGNORE INTO courses
           (id, name, tagline, description, creator_user_id, visibility,
            is_featured, neighborhood, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          course.id,
          course.name,
          course.tagline,
          course.description,
          course.creatorUserId,
          course.visibility,
          course.isFeatured ? 1 : 0,
          course.neighborhood,
          course.createdAt,
        ]
      );
      for (const stop of stops) {
        await db.runAsync(
          `INSERT OR IGNORE INTO course_stops (course_id, bar_id, position)
           VALUES (?, ?, ?)`,
          [course.id, stop.barId, stop.position]
        );
      }
    }
  });
}
