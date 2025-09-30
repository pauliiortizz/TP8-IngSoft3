const mysql = require("mysql2/promise");

async function initDB() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root" // ⚠️ cambiá por tu pass
  });

  await connection.query("CREATE DATABASE IF NOT EXISTS tp04_db;");
  console.log("✅ Base de datos verificada/creada");
  await connection.end();
}

initDB();
