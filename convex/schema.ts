import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  userSettings: defineTable({
    userId: v.string(),
    encryptedKeys: v.any(),
    preferences: v.object({
      defaultProvider: v.optional(v.string()),
      defaultModel: v.optional(v.string()),
      webSearchEnabled: v.optional(v.boolean()),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  analysisReports: defineTable({
    userId: v.string(),
    marketTicker: v.string(),
    provider: v.string(),
    model: v.string(),
    report: v.any(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
});
