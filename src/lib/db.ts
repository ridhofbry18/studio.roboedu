import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

// Ensure environment variables are loaded
if (!process.env.TURSO_DATABASE_URL) {
  throw new Error("Missing TURSO_DATABASE_URL environment variable.");
}

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);
