import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  boolean,
  bigint,
  date,
  time,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Workout tracking - user's workout sessions
export const workouts = mysqlTable("workouts", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  date: date("date").notNull(),
  duration: int("duration").notNull(), // minutes
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Workout = typeof workouts.$inferSelect;
export type InsertWorkout = typeof workouts.$inferInsert;

// Individual exercises within a workout
export const workoutExercises = mysqlTable("workout_exercises", {
  id: serial("id").primaryKey(),
  workoutId: bigint("workoutId", { mode: "number", unsigned: true }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sets: int("sets").notNull(),
  reps: int("reps").notNull(),
  weight: int("weight").default(0), // kg
  restSeconds: int("restSeconds").default(60),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type InsertWorkoutExercise = typeof workoutExercises.$inferInsert;

// Fitness classes schedule
export const classes = mysqlTable("classes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  trainer: varchar("trainer", { length: 255 }).notNull(),
  dayOfWeek: mysqlEnum("dayOfWeek", [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
    "daily",
  ]).notNull(),
  startTime: time("startTime").notNull(),
  endTime: time("endTime").notNull(),
  intensity: mysqlEnum("intensity", ["low", "medium", "high", "extreme"]).default("medium").notNull(),
  maxCapacity: int("maxCapacity").default(20),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Class = typeof classes.$inferSelect;
export type InsertClass = typeof classes.$inferInsert;

// Class bookings
export const classBookings = mysqlTable("class_bookings", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  classId: bigint("classId", { mode: "number", unsigned: true }).notNull(),
  bookingDate: date("bookingDate").notNull(),
  status: mysqlEnum("status", ["booked", "attended", "cancelled", "no_show"]).default("booked").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ClassBooking = typeof classBookings.$inferSelect;
export type InsertClassBooking = typeof classBookings.$inferInsert;

// Gym equipment showcase
export const equipment = mysqlTable("equipment", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", [
    "strength",
    "cardio",
    "functional",
    "free_weights",
    "machines",
    "recovery",
  ]).notNull(),
  description: text("description"),
  imageUrl: text("imageUrl"),
  quantity: int("quantity").default(1),
  features: json("features").$type<string[]>(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Equipment = typeof equipment.$inferSelect;
export type InsertEquipment = typeof equipment.$inferInsert;

// Membership/pricing plans
export const memberships = mysqlTable("memberships", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(), // in rupees
  duration: varchar("duration", { length: 50 }).notNull(), // "1 month", "3 months", etc.
  description: text("description"),
  features: json("features").$type<string[]>(),
  popular: boolean("popular").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Membership = typeof memberships.$inferSelect;
export type InsertMembership = typeof memberships.$inferInsert;

// AI assistant chat messages
export const chatMessages = mysqlTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;

// Contact/lead form submissions
export const contacts = mysqlTable("contacts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  message: text("message"),
  source: varchar("source", { length: 50 }).default("website"),
  status: mysqlEnum("status", ["new", "contacted", "converted", "dismissed"]).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;
