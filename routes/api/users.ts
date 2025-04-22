import { Handlers } from "$fresh/server.ts";
import { db, initDB } from "@/lib/surreal.ts";
import { RecordId } from "@surrealdb/surrealdb";
import { ulid } from "@std/ulid";
import { hash } from "@felix/bcrypt";
import { PublicUser, PublicUserSchema } from "@/types.ts";

await initDB();

export const handler: Handlers<null> = {
  async GET(_req, _ctx) {
    const results: PublicUser[][] = await db.query(`
      SELECT id, name FROM user;
    `);
    return new Response(JSON.stringify(results[0], null, 2), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async POST(req, _ctx) {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const hashedPassword = await hash(password);
    const emailVerificationToken = ulid();

    const user = await db.create<PublicUser>(new RecordId("user", ulid()), {
      email,
      password_hash: hashedPassword,
      email_verification_token: emailVerificationToken,
    });
    const parsed = PublicUserSchema.parse(user);

    return new Response(
      JSON.stringify(parsed, null, 2),
      {
        headers: { "Content-Type": "application/json" },
        status: 201,
      },
    );
  },
};
