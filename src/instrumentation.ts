import { type Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(err, request, context);
};
