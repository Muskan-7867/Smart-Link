import { createServerFn } from "@tanstack/react-start";
import { db } from "db/db";
import { links } from "db/schema";
import {  eq } from "drizzle-orm";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  favorite: z.boolean(),
});

export const toggleFavorite = createServerFn({ method: "POST" })
  .inputValidator(schema)
  .handler(async ({ data }:any) => {
    // const request = getRequest();
    // const session = await auth.api.getSession({ headers: request.headers });

    // if (!session) {
    //   throw new Error("Unauthorized");
    // }

    await db
      .update(links)
      .set({ favorite: data.favorite })
      .where(eq(links.id, data.id));

    return { success: true };
  });
