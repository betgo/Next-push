/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { put } from "@vercel/blob";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { type Message } from "@prisma/client";
import { IsMobile } from "~/shared/utils";
import { sleep } from "~/shared/Utils/time";

export const messageRouter = createTRPCRouter({
  // getMessages: publicProcedure
  //   .input(
  //     z.object({
  //       pageSize: z.number().default(20),
  //       pageNumber: z.number().default(0),
  //     }),
  //   )
  //   .query(async ({ ctx, input }) => {
  //     const data = await ctx.db.message.findMany({
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //       skip: input.pageNumber * input.pageSize,
  //       take: input.pageSize,
  //     });
  //     return data;
  //   }),
  infiniteMessages: protectedProcedure
    .input(
      z.object({
        cursor: z.string().nullish(),
        take: z.number().min(1).max(50).nullish(),
      }),
    )
    .query(async (opts) => {
      const { input, ctx } = opts;
      const take = input.take ?? 20;
      const cursor = input.cursor;

      const items = await ctx.db.message.findMany({
        orderBy: {
          createdAt: "desc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        take: take + 1,
        skip: 0,
        where: {
          isDel: 0,
        },
      });

      let nextCursor: typeof cursor | null = null;
      if (items.length > take) {
        const prev = items.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = prev!.id;
      }
      return { items, nextCursor };
    }),

  sendMessage: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isMobile = IsMobile(ctx.headers.get("user-agent") ?? "");
      const msg: Message = await ctx.db.message.create({
        data: {
          message: input.message,
          ua: isMobile ? 1 : 0,
        },
      });
      return msg;
    }),
  // trpc不支持大文件传输，所以只进行信息的存储
  uploadFile: publicProcedure
    .input(
      z.object({
        type: z.union([z.literal("IMAGE"), z.literal("FILE")]),
        url: z.string(),
        fileName: z.string(),
        fileSize: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const msg: Message = await ctx.db.message.create({
        data: {
          type: input.type,
          url: input.url,
          fileName: input.fileName,
          fileSize: input.fileSize,
        },
      });
      return msg;
    }),
  deleteMessage: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const updatedMessage = await ctx.db.message.update({
        where: { id: input.id },
        data: { isDel: 1 },
      });
      return updatedMessage;
    }),
});
