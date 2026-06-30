import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
    for (const row of res.rows) {
      const tableName = row.name as string;
      console.log(`Dropping table ${tableName}...`);
      await client.execute(`DROP TABLE IF EXISTS \`${tableName}\``);
    }
    console.log("All tables dropped.");
  } catch (error) {
    console.error("Failed to drop tables:", error);
  } finally {
    client.close();
  }
}

main();
