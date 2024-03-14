import type { APIRoute } from "astro";
import { Card, db } from "astro:db";
import { z } from "zod";

export const POST: APIRoute = async (ctx) => {
  const params = z
    .object({
      board: z.number(),
    })
    .safeParse(ctx.params);

  if (!params.success) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Invalid board ID",
      }),
      { status: 400 }
    );
  }

  await db.insert(Card).values({
    boardId: params.data.board,
    name: "New card",
  });

  return new Response(null, { status: 201 });
};
