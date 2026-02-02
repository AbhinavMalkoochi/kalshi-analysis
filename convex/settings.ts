import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireUserId } from "./lib/auth";

export const getForUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    return await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    encryptedKeys: v.any(),
    preferences: v.object({
      defaultProvider: v.optional(v.string()),
      defaultModel: v.optional(v.string()),
      webSearchEnabled: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    const existing = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();
    const now = Date.now();

    if (!existing) {
      return await ctx.db.insert("userSettings", {
        userId,
        encryptedKeys: args.encryptedKeys,
        preferences: args.preferences,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.patch(existing._id, {
      encryptedKeys: args.encryptedKeys,
      preferences: args.preferences,
      updatedAt: now,
    });

    return existing._id;
  },
});
