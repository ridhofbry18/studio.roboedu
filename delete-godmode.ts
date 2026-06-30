import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log(tables.rows);
  
  // Actually the table is likely named 'User' in Prisma or 'users' in Drizzle?
  // Let's just try to delete from both if they exist.
  try {
    await client.execute("DELETE FROM User WHERE id LIKE 'god-mode-%'");
    console.log("Deleted from User table");
  } catch(e) {}
  
  try {
    await client.execute("DELETE FROM users WHERE id LIKE 'god-mode-%'");
    console.log("Deleted from users table");
  } catch(e) {}
}

main().catch(console.error);
