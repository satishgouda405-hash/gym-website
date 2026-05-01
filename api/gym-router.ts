import { z } from "zod";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { workouts, workoutExercises, classes, classBookings, equipment, memberships, chatMessages, contacts } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const gymRouter = createRouter({
  // Workouts
  workoutList: authedQuery
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return db.select().from(workouts)
        .where(eq(workouts.userId, ctx.user.id))
        .orderBy(desc(workouts.date))
        .limit(input.limit);
    }),

  workoutCreate: authedQuery
    .input(z.object({
      name: z.string().min(1),
      date: z.string(),
      duration: z.number().min(1),
      notes: z.string().optional(),
      exercises: z.array(z.object({
        name: z.string().min(1),
        sets: z.number().min(1),
        reps: z.number().min(1),
        weight: z.number().optional(),
        restSeconds: z.number().optional(),
      })).default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [workout] = await db.insert(workouts).values({
        userId: ctx.user.id,
        name: input.name,
        date: new Date(input.date),
        duration: input.duration,
        notes: input.notes,
      }).$returningId();

      if (input.exercises.length > 0 && workout) {
        await db.insert(workoutExercises).values(
          input.exercises.map((ex) => ({
            workoutId: workout.id,
            name: ex.name,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight ?? 0,
            restSeconds: ex.restSeconds ?? 60,
          }))
        );
      }

      return { success: true, workoutId: workout?.id };
    }),

  workoutDelete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db.delete(workoutExercises).where(eq(workoutExercises.workoutId, input.id));
      await db.delete(workouts).where(and(eq(workouts.id, input.id), eq(workouts.userId, ctx.user.id)));
      return { success: true };
    }),

  workoutExercises: authedQuery
    .input(z.object({ workoutId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(workoutExercises).where(eq(workoutExercises.workoutId, input.workoutId));
    }),

  // Classes
  classList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(classes).where(eq(classes.active, true)).orderBy(classes.dayOfWeek, classes.startTime);
  }),

  classBook: authedQuery
    .input(z.object({
      classId: z.number(),
      bookingDate: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [booking] = await db.insert(classBookings).values({
        userId: ctx.user.id,
        classId: input.classId,
        bookingDate: new Date(input.bookingDate),
      }).$returningId();
      return { success: true, bookingId: booking?.id };
    }),

  myBookings: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db.select().from(classBookings).where(eq(classBookings.userId, ctx.user.id)).orderBy(desc(classBookings.createdAt));
  }),

  // Equipment
  equipmentList: publicQuery
    .input(z.object({ category: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      if (input.category) {
        return db.select().from(equipment).where(and(eq(equipment.active, true), eq(equipment.category, input.category as any)));
      }
      return db.select().from(equipment).where(eq(equipment.active, true));
    }),

  // Memberships
  membershipList: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(memberships).where(eq(memberships.active, true)).orderBy(memberships.price);
  }),

  // Chat / AI Assistant
  chatHistory: authedQuery
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      return db.select().from(chatMessages)
        .where(eq(chatMessages.userId, ctx.user.id))
        .orderBy(desc(chatMessages.createdAt))
        .limit(input.limit);
    }),

  chatSend: authedQuery
    .input(z.object({
      message: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      // Store user message
      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        role: "user",
        content: input.message,
      });

      // Simple AI response logic for gym assistant
      const lowerMsg = input.message.toLowerCase();
      let response = "";

      if (lowerMsg.includes("price") || lowerMsg.includes("membership") || lowerMsg.includes("plan") || lowerMsg.includes("cost")) {
        response = "Our membership plans are designed for every fitness level! We offer Monthly (₹1,999), Quarterly (₹4,999), Half-Yearly (₹8,999), and Annual (₹14,999) plans. Each includes unlimited gym access, all group classes, and locker facilities. The Annual plan also includes 2 personal training sessions per month. Which plan interests you?";
      } else if (lowerMsg.includes("class") || lowerMsg.includes("schedule") || lowerMsg.includes("timing")) {
        response = "We run classes 7 days a week! Highlights include HIIT Blast (Mon/Wed/Fri 6:00 AM), Power Yoga (Tue/Thu 7:00 AM), CrossFit (Mon/Wed/Fri 6:00 PM), Zumba (Tue/Thu/Sat 6:00 PM), and Spin Cycle (Daily 7:00 PM). Would you like me to book a class for you?";
      } else if (lowerMsg.includes("equipment") || lowerMsg.includes("machine") || lowerMsg.includes("weights")) {
        response = "Body Tone Fitness features 3 floors of premium equipment! Floor 1: Cardio deck with treadmills, ellipticals, rowers, and StairMasters. Floor 2: Strength zone with dumbbells up to 50kg, Smith machines, cable stations, and power racks. Floor 3: Functional fitness with battle ropes, TRX, kettlebells, sleds, and a turf area. What would you like to train today?";
      } else if (lowerMsg.includes("trainer") || lowerMsg.includes("personal training") || lowerMsg.includes("coach")) {
        response = "Our certified trainers specialize in strength training, weight loss, bodybuilding, and sports conditioning. Personal training starts at ₹500 per session, with packages available. We match you with a trainer based on your goals. Would you like to schedule a free fitness assessment?";
      } else if (lowerMsg.includes("location") || lowerMsg.includes("address") || lowerMsg.includes("where")) {
        response = "We're located on the 4th floor of Arihant Elite Complex, above First Cry, Shirur Park, Vidya Nagar, Hubballi, Karnataka 580031. We're open 5:00 AM to 10:30 PM, 7 days a week. Call or WhatsApp us at +91 86601 69891 for directions!";
      } else if (lowerMsg.includes("offer") || lowerMsg.includes("discount") || lowerMsg.includes("deal")) {
        response = "Current offers: 20% off on Annual memberships, Student discount (15% off with valid ID), Couple membership at ₹24,999/year, and a FREE 3-day trial for first-time visitors. Book your trial through WhatsApp or visit us directly!";
      } else if (lowerMsg.includes("workout") || lowerMsg.includes("routine") || lowerMsg.includes("exercise")) {
        response = "I can help you build a workout routine! For beginners, I recommend a 3-day split: Day 1 - Full Body (squats, bench, rows), Day 2 - Cardio + Core, Day 3 - Active recovery. For advanced athletes, try our Push/Pull/Legs 6-day split. Track all your workouts in our app and monitor your progress!";
      } else if (lowerMsg.includes("hi") || lowerMsg.includes("hello") || lowerMsg.includes("hey")) {
        response = "Hey there, champion! Welcome to Body Tone Fitness. I'm your AI gym assistant. I can help you with membership plans, class schedules, equipment info, workout tips, or booking a visit. What can I help you crush today?";
      } else {
        response = "Great question! At Body Tone Fitness, we're all about helping you achieve your goals. I can assist with membership plans, class bookings, equipment details, workout recommendations, or general gym info. Could you tell me more about what you're looking for?";
      }

      // Store assistant response
      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        role: "assistant",
        content: response,
      });

      return { success: true, response };
    }),

  // Contacts
  contactCreate: publicQuery
    .input(z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string().optional(),
      source: z.string().default("website"),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [contact] = await db.insert(contacts).values({
        name: input.name,
        email: input.email,
        phone: input.phone,
        message: input.message,
        source: input.source,
      }).$returningId();
      return { success: true, contactId: contact?.id };
    }),
});
