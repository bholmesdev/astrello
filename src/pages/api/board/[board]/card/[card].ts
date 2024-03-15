import { db, Card, eq, and } from "astro:db";
import { createForm } from "simple:form";
import { z } from "zod";
import { JsonResponse } from "../../../../../simple-rest";
import type { APIContext } from "astro";

const cardPatch = createForm({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const POST = async (ctx: APIContext) => {
  const params = z
    .object({
      board: z.coerce.number(),
      card: z.coerce.number(),
    })
    .safeParse(ctx.params);

  if (!params.success) {
    return new JsonResponse(
      { success: false, error: "Invalid board or card ID" } as const,
      { status: 400 }
    );
  }

  const form = await ctx.locals.form.getData(cardPatch);
  if (!form || form.fieldErrors) {
    return new JsonResponse(
      { success: false, error: "Invalid form data" } as const,
      { status: 400 }
    );
  }

  const res = await db
    .update(Card)
    .set({
      name: form.data.name,
      description: form.data.description,
    })
    .where(
      and(eq(Card.boardId, params.data.board), eq(Card.id, params.data.card))
    );
  if (res.rowsAffected === 0) {
    return new JsonResponse(
      {
        success: false,
        error: "Card not found",
      } as const,
      {
        status: 404,
      }
    );
  }
  return new JsonResponse({ success: true } as const);
};
