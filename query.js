const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({ 
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function check() {
  try {
    const schoolId = 'a950909a-b6f1-4bf8-9c71-cfb75c76f928'; // SD Insan Amanah
    const teamId = '9453053c-17fd-463c-92c1-12cac22d9ae1'; // Tim 1

    const check = await client.execute({
      sql: "SELECT * FROM team_school_assignment WHERE teamId = ? AND schoolId = ?",
      args: [teamId, schoolId]
    });

    if (check.rows.length === 0) {
      await client.execute({
        sql: "INSERT INTO team_school_assignment (id, teamId, schoolId, assignedAt) VALUES (?, ?, ?, ?)",
        args: [require('crypto').randomUUID(), teamId, schoolId, Date.now()]
      });
      console.log("Berhasil menautkan SD Insan Amanah ke Tim 1!");
    } else {
      console.log("Sudah tertaut.");
    }
  } catch (e) {
    console.error(e);
  }
}
check();
