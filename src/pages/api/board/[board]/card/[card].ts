import type { APIRoute } from "astro";
import { db, Card, eq, and } from "astro:db";
import { createForm } from "simple:form";
import { z } from "zod";

const cardPatch = createForm({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
});

export const POST: APIRoute = async (ctx) => {
  const params = z
    .object({
      board: z.coerce.number(),
      card: z.coerce.number(),
    })
    .safeParse(ctx.params);

  if (!params.success) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid board or card ID",
      }),
      { status: 400 }
    );
  }

  const form = await ctx.locals.form.getData(cardPatch);
  if (!form || form.fieldErrors) {
    return new Response(
      JSON.stringify({
        success: false,
        message: form?.fieldErrors ?? "Missing form data",
      }),
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
    return new Response(
      JSON.stringify({
        success: false,
        message: "Card not found",
      }),
      { status: 404 }
    );
  }
  return new Response(null, { status: 204 });
};
