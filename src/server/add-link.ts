import { createServerFn } from "@tanstack/react-start";
import { db } from "db/db";
import { links } from "db/schema";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  category: z.string().optional(),
  favorite: z.boolean().optional().default(false),
});

export const addLink = createServerFn({ method: "POST" })
  .inputValidator(schema)
  .handler(async ({ data}: any) => {
    // const request = getRequest();
    // const session = await auth.api.getSession({ headers: request.headers });

    // if (!session) {
    //   throw new Error("Unauthorized");
    // }

    await db.insert(links).values({
      title: data.title,
      url: data.url,
      description: data.description,
      category: data.category,
      favorite: data.favorite,
      userId: null,
    });

    return { success: true };
  });