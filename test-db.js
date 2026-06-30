const { createClient } = require("@libsql/client");
const dotenv = require("dotenv");

dotenv.config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  const result = await client.execute("SELECT * FROM user WHERE email = 'mhmmadridho64@gmail.com'");
  console.log(result.rows);
}

main().catch(console.error);
