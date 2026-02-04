import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

export async function requireUserId(ctx: ActionCtx | MutationCtx | QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity.subject;
}
