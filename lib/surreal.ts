import Surreal from "@surrealdb/surrealdb";

function getEnv(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    console.error(`❌ Missing environment variable: ${key}`);
    Deno.exit(1);
  }
  return value;
}

const DATABASE_CONNECTION_URL = getEnv("DATABASE_CONNECTION_URL");
const DATABASE_NAMESPACE = getEnv("DATABASE_NAMESPACE");
const DATABASE_INSTANCE = getEnv("DATABASE_INSTANCE");
const DATABASE_AUTH_USERNAME = getEnv("DATABASE_AUTH_USERNAME");
const DATABASE_AUTH_PASSWORD = getEnv("DATABASE_AUTH_PASSWORD");

const db = new Surreal();
let isConnected = false;

export async function initDB() {
  if (isConnected) return;

  await db.connect(DATABASE_CONNECTION_URL);
  await db.use({
    namespace: DATABASE_NAMESPACE,
    database: DATABASE_INSTANCE,
  });
  await db.signin({
    namespace: DATABASE_NAMESPACE,
    database: DATABASE_INSTANCE,
    username: DATABASE_AUTH_USERNAME,
    password: DATABASE_AUTH_PASSWORD,
  });

  isConnected = true;
}

export { db };
