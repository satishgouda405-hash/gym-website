import { authRouter } from "./auth-router";
import { gymRouter } from "./gym-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  gym: gymRouter,
});

export type AppRouter = typeof appRouter;
