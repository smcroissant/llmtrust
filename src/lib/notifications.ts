import { db } from "@/server/db";
import { notification } from "@/server/db/schema";
import type { NotificationType } from "@/server/db/schema";

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Create a notification for a user.
 * Use this from server-side code (tRPC routers, server actions, etc.)
 */
export async function createNotification(input: CreateNotificationInput) {
  const [created] = await db
    .insert(notification)
    .values({
      userId: input.userId,
      type: input.type,
      title: input.title,
      message: input.message,
      link: input.link,
    })
    .returning();

  return created;
}

/**
 * Notify model author when their model is approved.
 */
export async function notifyModelApproved(
  authorId: string,
  modelName: string,
  modelSlug: string
) {
  return createNotification({
    userId: authorId,
    type: "model_approved",
    title: "Model approved! 🎉",
    message: `Your model "${modelName}" has been approved and is now live on the platform.`,
    link: `/models/${modelSlug}`,
  });
}

/**
 * Notify model author when their model is rejected.
 */
export async function notifyModelRejected(
  authorId: string,
  modelName: string,
  modelSlug: string
) {
  return createNotification({
    userId: authorId,
    type: "model_rejected",
    title: "Model needs revision",
    message: `Your model "${modelName}" was not approved. Please review and resubmit.`,
    link: `/models/${modelSlug}`,
  });
}

/**
 * Notify model author when someone reviews their model.
 */
export async function notifyNewReview(
  authorId: string,
  modelName: string,
  modelSlug: string,
  reviewerName: string,
  rating: number
) {
  return createNotification({
    userId: authorId,
    type: "new_review",
    title: "New review on your model",
    message: `${reviewerName} left a ${rating}-star review on "${modelName}".`,
    link: `/models/${modelSlug}#reviews`,
  });
}
