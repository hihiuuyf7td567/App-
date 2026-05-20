export type WeekdayHours = [string, string] | null; // [open, close] in "HH:MM" 24-hr, or null = closed

export type Bar = {
  id: string;
  name: string;
  type: string;
  address: string;
  lat: number;
  lng: number;
  baselinePar: number;
  orderFriction: "low" | "medium" | "high";
  hoursByWeekday: {
    mon: WeekdayHours;
    tue: WeekdayHours;
    wed: WeekdayHours;
    thu: WeekdayHours;
    fri: WeekdayHours;
    sat: WeekdayHours;
    sun: WeekdayHours;
  };
};

export type Course = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  creatorUserId: string | null;
  visibility: "private" | "link" | "public";
  isFeatured: boolean;
  neighborhood: string;
  createdAt: string;
};

export type CourseStop = {
  courseId: string;
  barId: string;
  position: number;
};

export type User = {
  id: string;
  username: string;
  avatar: string | null;
  createdAt: string;
};

export type Play = {
  id: string;
  courseId: string;
  startedAt: string;
  endedAt: string | null;
  status: "in_progress" | "completed" | "abandoned";
  currentStopPosition: number;
};

export type PlayParticipant = {
  playId: string;
  userId: string;
  joinedAt: string;
  finalScore: number | null;
};

export type Drink = {
  id: string;
  playId: string;
  userId: string;
  barId: string;
  stopPosition: number;
  loggedAt: string;
  drinkType: string | null;
};

export type CourseWithStops = Course & {
  stops: Array<CourseStop & { bar: Bar }>;
  coursePar: number;
};
