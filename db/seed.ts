import { getDb } from "../api/queries/connection";
import { classes, equipment, memberships } from "./schema";

async function seed() {
  const db = getDb();

  // Seed classes
  const classData = [
    { name: "HIIT Blast", description: "High-intensity interval training to torch calories and build endurance", trainer: "Coach Rajesh", dayOfWeek: "monday" as const, startTime: "06:00:00", endTime: "07:00:00", intensity: "high" as const, maxCapacity: 25 },
    { name: "Power Yoga", description: "Strength-focused yoga flow for flexibility and core stability", trainer: "Coach Priya", dayOfWeek: "tuesday" as const, startTime: "07:00:00", endTime: "08:00:00", intensity: "medium" as const, maxCapacity: 20 },
    { name: "HIIT Blast", description: "High-intensity interval training to torch calories and build endurance", trainer: "Coach Rajesh", dayOfWeek: "wednesday" as const, startTime: "06:00:00", endTime: "07:00:00", intensity: "high" as const, maxCapacity: 25 },
    { name: "Power Yoga", description: "Strength-focused yoga flow for flexibility and core stability", trainer: "Coach Priya", dayOfWeek: "thursday" as const, startTime: "07:00:00", endTime: "08:00:00", intensity: "medium" as const, maxCapacity: 20 },
    { name: "HIIT Blast", description: "High-intensity interval training to torch calories and build endurance", trainer: "Coach Rajesh", dayOfWeek: "friday" as const, startTime: "06:00:00", endTime: "07:00:00", intensity: "high" as const, maxCapacity: 25 },
    { name: "CrossFit", description: "Functional fitness combining weightlifting, gymnastics, and cardio", trainer: "Coach Vikram", dayOfWeek: "monday" as const, startTime: "18:00:00", endTime: "19:00:00", intensity: "extreme" as const, maxCapacity: 20 },
    { name: "Zumba", description: "Dance-based cardio workout with Latin and international music", trainer: "Coach Ananya", dayOfWeek: "tuesday" as const, startTime: "18:00:00", endTime: "19:00:00", intensity: "medium" as const, maxCapacity: 30 },
    { name: "CrossFit", description: "Functional fitness combining weightlifting, gymnastics, and cardio", trainer: "Coach Vikram", dayOfWeek: "wednesday" as const, startTime: "18:00:00", endTime: "19:00:00", intensity: "extreme" as const, maxCapacity: 20 },
    { name: "Zumba", description: "Dance-based cardio workout with Latin and international music", trainer: "Coach Ananya", dayOfWeek: "thursday" as const, startTime: "18:00:00", endTime: "19:00:00", intensity: "medium" as const, maxCapacity: 30 },
    { name: "Spin Cycle", description: "Indoor cycling with music-driven intervals and hill climbs", trainer: "Coach Karan", dayOfWeek: "daily" as const, startTime: "19:00:00", endTime: "19:45:00", intensity: "high" as const, maxCapacity: 25 },
    { name: "Zumba", description: "Dance-based cardio workout with Latin and international music", trainer: "Coach Ananya", dayOfWeek: "saturday" as const, startTime: "18:00:00", endTime: "19:00:00", intensity: "medium" as const, maxCapacity: 30 },
    { name: "Strength Camp", description: "Heavy compound lifts and progressive overload techniques", trainer: "Coach Rajesh", dayOfWeek: "saturday" as const, startTime: "08:00:00", endTime: "09:30:00", intensity: "high" as const, maxCapacity: 15 },
    { name: "Recovery Flow", description: "Mobility work, foam rolling, and active recovery stretching", trainer: "Coach Priya", dayOfWeek: "sunday" as const, startTime: "09:00:00", endTime: "10:00:00", intensity: "low" as const, maxCapacity: 20 },
  ];

  await db.insert(classes).values(classData as any);

  // Seed equipment
  const equipmentData = [
    { name: "Power Rack", category: "strength" as const, description: "Commercial-grade power rack with safety spotter arms, pull-up bar, and band pegs", quantity: 4, features: ["Adjustable J-hooks", "Safety spotters", "Pull-up bar", "Band pegs"] },
    { name: "Smith Machine", category: "machines" as const, description: "Counterbalanced Smith machine for safe solo heavy lifting", quantity: 3, features: ["Linear bearings", "Counterbalanced", "Safety stops", "Multiple angles"] },
    { name: "Cable Crossover", category: "machines" as const, description: "Dual-pulley cable system for functional and isolation exercises", quantity: 2, features: ["Dual pulleys", "Adjustable height", "200kg stack", "Multiple attachments"] },
    { name: "Dumbbell Rack (2.5-50kg)", category: "free_weights" as const, description: "Complete hex dumbbell set from 2.5kg to 50kg", quantity: 1, features: ["Hex design", "Rubber coated", "Tiered rack", "50kg max"] },
    { name: "Olympic Barbell Set", category: "free_weights" as const, description: "Competition-grade Olympic barbells with bumper plates", quantity: 10, features: ["20kg bar", "Bumper plates", "Knurled grip", "1500lb rating"] },
    { name: "Treadmill (Commercial)", category: "cardio" as const, description: "High-end treadmills with incline, heart rate monitoring, and entertainment screens", quantity: 8, features: ["15% incline", "22km/h max", "Heart rate monitor", "Touchscreen"] },
    { name: "StairMaster", category: "cardio" as const, description: "Step mill for intense lower-body cardio and glute activation", quantity: 3, features: ["Variable speed", "Heart rate zones", "Calorie tracker", "LED display"] },
    { name: "Rowing Machine", category: "cardio" as const, description: "Air-resistance rower for full-body conditioning", quantity: 4, features: ["Air resistance", "Performance monitor", "Foldable", "Full-body workout"] },
    { name: "Kettlebell Set", category: "functional" as const, description: "Cast iron kettlebells from 8kg to 32kg for ballistic training", quantity: 20, features: ["Cast iron", "8-32kg range", "Color coded", "Flat base"] },
    { name: "Battle Ropes", category: "functional" as const, description: "Heavy-duty battle ropes for explosive conditioning", quantity: 4, features: ["38mm diameter", "15m length", "Anchor included", "Weather resistant"] },
    { name: "TRX Suspension Trainer", category: "functional" as const, description: "Bodyweight suspension system for functional strength and core", quantity: 6, features: ["Adjustable length", "Door anchor", "400lb rated", "Full body exercises"] },
    { name: "Leg Press Machine", category: "machines" as const, description: "45-degree leg press for massive quad and glute development", quantity: 2, features: ["45-degree angle", "1000lb capacity", "Safety catches", "Large footplate"] },
    { name: "Hack Squat Machine", category: "machines" as const, description: "Guided hack squat for targeted leg development with back support", quantity: 2, features: ["Guided track", "Back support", "Adjustable depth", "500kg capacity"] },
    { name: "Leg Extension/Curl Combo", category: "machines" as const, description: "Dual-function machine for quad and hamstring isolation", quantity: 2, features: ["Dual function", "Adjustable pad", "140kg stack", "Quick switch"] },
    { name: "Pec Deck Fly", category: "machines" as const, description: "Isolation machine for chest development with adjustable arms", quantity: 2, features: ["Adjustable arms", "Reverse fly mode", "140kg stack", "Ergonomic seat"] },
    { name: "Lat Pulldown/Low Row", category: "machines" as const, description: "Dual cable station for back width and thickness", quantity: 3, features: ["Lat pulldown", "Seated row", "200kg stack", "Multiple grips"] },
    { name: "Foam Roller Station", category: "recovery" as const, description: "Dedicated recovery area with foam rollers, massage balls, and stretching mats", quantity: 10, features: ["Foam rollers", "Massage balls", "Yoga mats", "Stretching guide"] },
    { name: "Elliptical Trainer", category: "cardio" as const, description: "Low-impact elliptical with adjustable stride and resistance", quantity: 4, features: ["Adjustable stride", "Heart rate monitor", "Pre-set programs", "Self-powered"] },
    { name: "Assault Bike", category: "cardio" as const, description: "Air resistance bike for brutal HIIT conditioning", quantity: 3, features: ["Air resistance", "Total body", "LCD console", "Commercial grade"] },
    { name: "Turf Sprint Track", category: "functional" as const, description: "15m artificial turf strip for sled pushes, sprints, and agility drills", quantity: 1, features: ["15m length", "Sled push zone", "Agility ladder", "Shock absorbing"] },
  ];

  await db.insert(equipment).values(equipmentData as any);

  // Seed memberships
  const membershipData = [
    { name: "Starter", price: 1999, duration: "1 Month", description: "Perfect for beginners getting started on their fitness journey", features: ["Unlimited gym access", "Locker facility", "Basic equipment access", "2 group classes/week", "Fitness assessment"] },
    { name: "Pro", price: 4999, duration: "3 Months", description: "Accelerate your results with full access and more classes", features: ["Unlimited gym access", "All group classes", "Locker + shower", "1 PT session/month", "Nutrition guide", "Body composition scan"] },
    { name: "Elite", price: 8999, duration: "6 Months", description: "Serious athletes choose Elite for maximum value and results", features: ["Unlimited gym access", "All group classes", "Premium locker", "2 PT sessions/month", "Custom meal plan", "Monthly progress review", "Guest passes (2/month)"] },
    { name: "Legend", price: 14999, duration: "12 Months", description: "The ultimate membership for dedicated fitness enthusiasts", features: ["24/7 gym access", "All group classes", "VIP locker", "4 PT sessions/month", "Personalized program", "Weekly check-ins", "Unlimited guest passes", "Recovery zone access", "20% off supplements"], popular: true },
    { name: "Couple Plan", price: 24999, duration: "12 Months", description: "Train together, stay together. Shared fitness goals for couples", features: ["2 Legend memberships", "Couple PT sessions", "Partner workout plans", "Shared nutrition plan", "Anniversary perks"] },
  ];

  await db.insert(memberships).values(membershipData as any);

  console.log("Seed completed successfully!");
}

seed().catch(console.error);
