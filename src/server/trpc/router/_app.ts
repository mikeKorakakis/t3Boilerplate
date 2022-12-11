import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { router } from "../trpc";

import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { feedRouter } from "./feed";
import { postCategoryRouter } from "./postCategory";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  feed: feedRouter,
  postCategory: postCategoryRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;
export type AppRouterInputTypes = inferRouterInputs<AppRouter>;
export type AppRouterOutputTypes = inferRouterOutputs<AppRouter>;
type AllAppRouterNames = keyof AppRouterInputTypes;
export type AppRouterNames = Exclude<AllAppRouterNames, "auth" | "example">;
export type AppRouterForOptions = "postCategory";