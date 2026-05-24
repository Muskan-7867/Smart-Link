import { createServerFn } from "@tanstack/react-start";
import { db } from "db/db";
import { links } from "db/schema";

export const getLinks = createServerFn({ method: "GET" }).handler(async () => {
  // const request = getRequest();
  // const session = await auth.api.getSession({ headers: request.headers });

  // if (!session) {
  //   return [];
  // }

  const userLinks = await db
    .select()
    .from(links)
    // .where(eq(links.userId, session.user.id))
    .orderBy(links.createdAt);

  return userLinks;
});
