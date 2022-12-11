import { createSchema, deleteSchema, updateSchema } from "@/types/zod/feed";
import { getSchema } from "@/types/zod/feed";
import { getAllSchema } from "@/types/zod/general";
import { delay } from "@/utils/delay";
import { generateFilterParams } from "@/utils/generateFilterParams";
import { TRPCError } from "@trpc/server";

import { publicProcedure,router } from "../trpc";

const entityName = "post";

export const feedRouter = router({
  getAll: publicProcedure.input(getAllSchema).query(async ({ input, ctx }) => {
    const { colFilters, sorting } = generateFilterParams(input);
    const postCount = await ctx.prisma[entityName].count({
      where: {
        AND: colFilters,
      },
    });
    const posts = await ctx.prisma[entityName].findMany({
      where: {
        AND: colFilters,
      },
      include: {
        category: true,
      },
      skip: input.pageIndex * input.pageSize,
      take: input.pageSize,
      orderBy: sorting,
    });

    const pageCount = Math.ceil(postCount / input.pageSize);
    return { data: posts, pageCount, totalItems: postCount };
  }),

  get: publicProcedure.input(getSchema).query(async ({ input, ctx }) => {
    delay(2000);
    return ctx.prisma[entityName].findUnique({ where: { id: input.id } });
  }),

  create: publicProcedure
    .input(createSchema)
    .mutation(async ({ input, ctx }) => {
        console.log(ctx?.session);
        console.log(ctx?.session?.user);
        console.log(ctx?.session?.user?.id);
      if (!ctx?.session?.user?.id) {
        throw new TRPCError({ message: "Not logged in", code: "FORBIDDEN" });
      }
      const authorId = ctx?.session?.user?.id;
      const inputWithUserId = { ...input, authorId };
      return ctx.prisma[entityName].create({ data: inputWithUserId });
    }),

  update: publicProcedure
    .input(updateSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma[entityName].update({ where: { id: input.id }, data: input });
    }),

  delete: publicProcedure
    .input(deleteSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma[entityName].delete({ where: { id: input.id } });
    }),
});
