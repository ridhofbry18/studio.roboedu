const { createClient } = require('@libsql/client');
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
  try {
    const rs = await client.execute("SELECT id, email, role, status FROM user WHERE email='admin@roboedu.com'");
    if (rs.rows.length === 0) {
      console.log('Admin user not found. Creating one...');
      const hash = await bcrypt.hash('adminroboedu', 10);
      await client.execute({
        sql: "INSERT INTO user (id, name, email, role, status, passwordHash) VALUES (?, ?, ?, ?, ?, ?)",
        args: [require('crypto').randomUUID(), 'Admin System', 'admin@roboedu.com', 'admin', 'active', hash]
      });
      console.log('Created admin user successfully.');
    } else {
      console.log('Admin user found:', rs.rows[0]);
    }

    // SPV check
    const spvEmail = process.env.SUPERVISOR_EMAIL;
    const spvPassword = process.env.SUPERVISOR_PASSWORD;
    if (spvEmail && spvPassword) {
      const spvRs = await client.execute({ sql: "SELECT id, email, role, status FROM user WHERE email=?", args: [spvEmail] });
      if (spvRs.rows.length === 0) {
        console.log('Supervisor user not found. Creating one...');
        const spvHash = await bcrypt.hash(spvPassword, 10);
        await client.execute({
          sql: "INSERT INTO user (id, name, email, role, status, passwordHash) VALUES (?, ?, ?, ?, ?, ?)",
          args: [require('crypto').randomUUID(), 'Supervisor System', spvEmail, 'supervisor', 'active', spvHash]
        });
        console.log('Created supervisor user successfully.');
      } else {
        console.log('Supervisor user found:', spvRs.rows[0]);
      }
    }

  } catch(e) {
    console.error('Error:', e);
  }
}
run();
