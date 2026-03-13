import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { db } from "../../db";
import { notification, model, user } from "../../db/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const notificationsRouter = createTRPCRouter({
  // ============================================
  // LIST — Get notifications for current user (paginated, filterable)
  // ============================================
  list: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(10),
        unreadOnly: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.limit;
      const conditions = [eq(notification.userId, ctx.userId)];

      if (input.unreadOnly) {
        conditions.push(eq(notification.read, false));
      }

      const notifications = await db
        .select()
        .from(notification)
        .where(and(...conditions))
        .orderBy(desc(notification.createdAt))
        .limit(input.limit)
        .offset(offset);

      const [{ totalCount }] = await db
        .select({ totalCount: count() })
        .from(notification)
        .where(and(...conditions));

      return {
        notifications,
        total: Number(totalCount),
        page: input.page,
        totalPages: Math.ceil(Number(totalCount) / input.limit),
      };
    }),

  // ============================================
  // UNREAD COUNT — Badge number for bell icon
  // ============================================
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const [{ total }] = await db
      .select({ total: count() })
      .from(notification)
      .where(
        and(
          eq(notification.userId, ctx.userId),
          eq(notification.read, false),
        ),
      );

    return Number(total);
  }),

  // ============================================
  // MARK AS READ — Single notification
  // ============================================
  markAsRead: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [updated] = await db
        .update(notification)
        .set({ read: true })
        .where(
          and(
            eq(notification.id, input.id),
            eq(notification.userId, ctx.userId),
          ),
        )
        .returning();

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Notification not found",
        });
      }

      return updated;
    }),

  // ============================================
  // MARK ALL AS READ
  // ============================================
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const updated = await db
      .update(notification)
      .set({ read: true })
      .where(
        and(
          eq(notification.userId, ctx.userId),
          eq(notification.read, false),
        ),
      )
      .returning({ id: notification.id });

    return { count: updated.length };
  }),
});
