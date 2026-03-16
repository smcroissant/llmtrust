/**
 * Integration Tests — Stripe Webhook Handler
 *
 * Tests all 4 webhook event types end-to-end:
 * - Signature verification
 * - Idempotency
 * - checkout.session.completed
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.payment_failed
 *
 * Run with: npx vitest run src/__tests__/stripe-webhooks.test.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ── DB Mock State ────────────────────────────────────────────────
// We store mock data in module scope so mocks can access it
let mockDbState = {
  webhookEvents: new Map<string, { id: string; type: string; processedAt: Date }>(),
  subscriptions: new Map<string, Record<string, unknown>>(),
  insertedWebhookEvents: [] as Array<{ id: string; type: string }>,
  updatedWebhookEvents: [] as Array<{ id: string; processedAt: Date }>,
  upsertedSubscriptions: [] as Array<Record<string, unknown>>,
  subscriptionUpdates: [] as Array<Record<string, unknown>>,
};

function resetMockDbState() {
  mockDbState = {
    webhookEvents: new Map(),
    subscriptions: new Map(),
    insertedWebhookEvents: [],
    updatedWebhookEvents: [],
    upsertedSubscriptions: [],
    subscriptionUpdates: [],
  };
}

// ── Mock the DB module ──────────────────────────────────────────
vi.mock("@/server/db", () => ({
  db: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => {
            // Returns webhook event from state if exists
            const entries = Array.from(mockDbState.webhookEvents.values());
            return entries;
          }),
        })),
      })),
    })),
    insert: vi.fn((table: unknown) => ({
      values: vi.fn((values: Record<string, unknown>) => {
        // Track insertions
        if (values.id && values.type) {
          mockDbState.webhookEvents.set(values.id as string, values as { id: string; type: string; processedAt: Date });
          mockDbState.insertedWebhookEvents.push({ id: values.id as string, type: values.type as string });
        } else {
          mockDbState.upsertedSubscriptions.push(values);
        }
        return {
          onConflictDoUpdate: vi.fn(() => ({
            set: vi.fn(() => ({
              returning: vi.fn(async () => [{ callCount: 1 }]),
            })),
          })),
        };
      }),
    })),
    update: vi.fn(() => ({
      set: vi.fn((values: Record<string, unknown>) => ({
        where: vi.fn(() => {
          mockDbState.subscriptionUpdates.push(values);
          mockDbState.updatedWebhookEvents.push(values as { id: string; processedAt: Date });
          return Promise.resolve([]);
        }),
      })),
    })),
  },
}));

// ── Mock DB Schema ──────────────────────────────────────────────
vi.mock("@/server/db/schema", () => ({
  subscription: {
    userId: "user_id",
    stripeCustomerId: "stripe_customer_id",
    stripeSubscriptionId: "stripe_subscription_id",
    tier: "tier",
    status: "status",
    billingInterval: "billing_interval",
    currentPeriodEnd: "current_period_end",
    updatedAt: "updated_at",
    id: "id",
  },
  webhookEvent: {
    id: "id",
    type: "type",
    createdAt: "created_at",
    processedAt: "processed_at",
  },
}));

// ── Mock Stripe ─────────────────────────────────────────────────
const mockConstructEvent = vi.fn();
const mockRetrieveSubscription = vi.fn();

vi.mock("@/lib/stripe", () => ({
  stripe: {
    subscriptions: {
      retrieve: (...args: unknown[]) => mockRetrieveSubscription(...args),
    },
    webhooks: {
      constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
    },
  },
  getPlanFromPriceId: vi.fn((priceId: string) => {
    const mapping: Record<string, { plan: string; interval: string }> = {
      price_pro_monthly_test: { plan: "pro", interval: "monthly" },
      price_pro_annual_test: { plan: "pro", interval: "annual" },
      price_team_monthly_test: { plan: "team", interval: "monthly" },
      price_team_annual_test: { plan: "team", interval: "annual" },
    };
    return mapping[priceId] ?? { plan: "pro", interval: "monthly" };
  }),
}));

// ── Helper: Create a mock NextRequest with Stripe signature ─────
function createWebhookRequest(eventId: string, eventType: string, eventData: unknown): NextRequest {
  const body = JSON.stringify({
    id: eventId,
    type: eventType,
    data: { object: eventData },
    created: Math.floor(Date.now() / 1000),
  });

  const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
    method: "POST",
    body,
    headers: {
      "stripe-signature": "t=1234567890,v1=mock_signature_hash",
      "content-type": "application/json",
    },
  });

  return req;
}

// ── Import the handler AFTER mocks are set up ───────────────────
// We need dynamic import because mocks must be registered first
let POST: (req: NextRequest) => Promise<Response>;

// ── Tests ───────────────────────────────────────────────────────

describe("Stripe Webhook Handler — Integration Tests", () => {
  beforeAll(async () => {
    // Dynamic import after mocks
    const handler = await import("@/app/api/webhooks/stripe/route");
    POST = handler.POST;
  });

  beforeEach(() => {
    resetMockDbState();
    vi.clearAllMocks();
  });

  // ── Signature Verification ────────────────────────────────────
  describe("Signature Verification", () => {
    it("returns 400 when stripe-signature header is missing", async () => {
      const req = new NextRequest("http://localhost:3000/api/webhooks/stripe", {
        method: "POST",
        body: JSON.stringify({ id: "evt_test", type: "checkout.session.completed", data: { object: {} } }),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe("Missing stripe-signature header");
    });

    it("returns 400 when signature verification fails", async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      const req = createWebhookRequest("evt_bad_sig", "checkout.session.completed", {});
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(400);
      expect(json.error).toBe("Invalid signature");
    });

    it("returns 200 when signature is valid", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_valid_sig",
        type: "checkout.session.completed",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            metadata: { userId: "user-123" },
            subscription: "sub_test",
            customer: "cus_test",
          },
        },
      });

      mockRetrieveSubscription.mockResolvedValue({
        items: {
          data: [
            {
              price: { id: "price_pro_monthly_test" },
              current_period_end: Math.floor(Date.now() / 1000) + 2592000,
            },
          ],
        },
      });

      const req = createWebhookRequest("evt_valid_sig", "checkout.session.completed", {
        metadata: { userId: "user-123" },
        subscription: "sub_test",
        customer: "cus_test",
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });

  // ── Idempotency ──────────────────────────────────────────────
  describe("Idempotency", () => {
    it("skips duplicate events and returns early", async () => {
      // Pre-populate the DB with an already-processed event
      mockDbState.webhookEvents.set("evt_duplicate_1", {
        id: "evt_duplicate_1",
        type: "checkout.session.completed",
        processedAt: new Date(),
      });

      mockConstructEvent.mockReturnValue({
        id: "evt_duplicate_1",
        type: "checkout.session.completed",
        created: Math.floor(Date.now() / 1000),
        data: { object: {} },
      });

      const req = createWebhookRequest("evt_duplicate_1", "checkout.session.completed", {
        metadata: { userId: "user-123" },
        subscription: "sub_test",
        customer: "cus_test",
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
      expect(json.duplicate).toBe(true);
    });
  });

  // ── checkout.session.completed ───────────────────────────────
  describe("checkout.session.completed", () => {
    it("processes new subscription checkout and logs the event", async () => {
      const sessionData = {
        metadata: { userId: "user-456" },
        subscription: "sub_new_123",
        customer: "cus_new_456",
      };

      mockConstructEvent.mockReturnValue({
        id: "evt_checkout_1",
        type: "checkout.session.completed",
        created: Math.floor(Date.now() / 1000),
        data: { object: sessionData },
      });

      mockRetrieveSubscription.mockResolvedValue({
        items: {
          data: [
            {
              price: { id: "price_team_annual_test" },
              current_period_end: Math.floor(Date.now() / 1000) + 31536000,
            },
          ],
        },
      });

      const req = createWebhookRequest("evt_checkout_1", "checkout.session.completed", sessionData);
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
      // Verify webhook event was recorded
      expect(mockDbState.insertedWebhookEvents).toContainEqual(
        expect.objectContaining({ id: "evt_checkout_1" })
      );
    });

    it("handles missing userId gracefully (no crash)", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_checkout_no_user",
        type: "checkout.session.completed",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            metadata: {}, // no userId
            subscription: "sub_test",
            customer: "cus_test",
          },
        },
      });

      const req = createWebhookRequest("evt_checkout_no_user", "checkout.session.completed", {
        metadata: {},
        subscription: "sub_test",
        customer: "cus_test",
      });

      const res = await POST(req);
      const json = await res.json();

      // Should still return 200 (not crash)
      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });

  // ── customer.subscription.updated ────────────────────────────
  describe("customer.subscription.updated", () => {
    it("processes subscription update events", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_sub_update_1",
        type: "customer.subscription.updated",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            metadata: { userId: "user-789" },
            customer: "cus_789",
            items: { data: [{ price: { id: "price_team_monthly_test" } }] },
            status: "active",
          },
        },
      });

      const req = createWebhookRequest("evt_sub_update_1", "customer.subscription.updated", {
        metadata: { userId: "user-789" },
        customer: "cus_789",
        items: { data: [{ price: { id: "price_team_monthly_test" } }] },
        status: "active",
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });

  // ── customer.subscription.deleted ────────────────────────────
  describe("customer.subscription.deleted", () => {
    it("processes subscription cancellation", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_sub_delete_1",
        type: "customer.subscription.deleted",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            customer: "cus_del_123",
            created: Math.floor(Date.now() / 1000),
          },
        },
      });

      const req = createWebhookRequest("evt_sub_delete_1", "customer.subscription.deleted", {
        customer: "cus_del_123",
        created: Math.floor(Date.now() / 1000),
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });

  // ── invoice.payment_failed ───────────────────────────────────
  describe("invoice.payment_failed", () => {
    it("processes failed payment events", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_payment_fail_1",
        type: "invoice.payment_failed",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            customer: "cus_payfail_123",
            subscription: "sub_payfail_123",
          },
        },
      });

      const req = createWebhookRequest("evt_payment_fail_1", "invoice.payment_failed", {
        customer: "cus_payfail_123",
        subscription: "sub_payfail_123",
      });

      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });

    it("handles invoice without subscription ID gracefully", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_payment_fail_no_sub",
        type: "invoice.payment_failed",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            customer: "cus_nosub",
            subscription: null,
          },
        },
      });

      const req = createWebhookRequest("evt_payment_fail_no_sub", "invoice.payment_failed", {
        customer: "cus_nosub",
        subscription: null,
      });

      const res = await POST(req);
      const json = await res.json();

      // Should not crash — returns 200
      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });

  // ── Unhandled Events ─────────────────────────────────────────
  describe("Unhandled Events", () => {
    it("returns 200 for unhandled event types (logs and moves on)", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_unknown_1",
        type: "customer.created",
        created: Math.floor(Date.now() / 1000),
        data: { object: {} },
      });

      const req = createWebhookRequest("evt_unknown_1", "customer.created", {});
      const res = await POST(req);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });

  // ── Error Handling ───────────────────────────────────────────
  describe("Error Handling", () => {
    it("returns 200 even on handler error (prevents Stripe retries for unrecoverable errors)", async () => {
      mockConstructEvent.mockReturnValue({
        id: "evt_error_1",
        type: "checkout.session.completed",
        created: Math.floor(Date.now() / 1000),
        data: {
          object: {
            metadata: { userId: "user-error" },
            subscription: "sub_error",
            customer: "cus_error",
          },
        },
      });

      // Make Stripe subscription retrieval fail
      mockRetrieveSubscription.mockRejectedValue(new Error("Stripe API error"));

      const req = createWebhookRequest("evt_error_1", "checkout.session.completed", {
        metadata: { userId: "user-error" },
        subscription: "sub_error",
        customer: "cus_error",
      });

      const res = await POST(req);
      const json = await res.json();

      // Handler errors return 200 to prevent Stripe retries
      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
    });
  });
});
