import { createClient } from "@libsql/client";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function main() {
  console.log("URL:", process.env.TURSO_DATABASE_URL);
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  try {
    const res = await client.execute("SELECT 1");
    console.log("Success! Connection works.");
    console.log(res);
  } catch (error) {
    console.error("Connection failed:");
    console.error(error);
  } finally {
    client.close();
  }
}

main();
