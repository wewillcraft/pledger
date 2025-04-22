import { Handlers } from "$fresh/server.ts";
import { db, initDB } from "@/lib/surreal.ts";

export const handler: Handlers<null> = {
  async GET(_req, _ctx) {
    await initDB();

    const users = await db.select("user");

    return new Response(JSON.stringify(users, null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
