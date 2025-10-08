// db.js
/*const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false, // necesario para Clever Cloud / Planetscale
      },
    },
  }
);

module.exports = sequelize;*/

// en db.js
require("dotenv").config();

const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.NODE_ENV === "test") {
  // 👉 Para tests en local (usa SQLite in-memory)
  sequelize = new Sequelize("sqlite::memory:", { logging: false });
} else {
  // If required MySQL env vars are provided, use them; otherwise fallback to a
  // local sqlite file for easy local testing (no DB server required).
  const hasMysqlEnv = process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST;
  if (hasMysqlEnv) {
    // 👉 Para QA y PROD (usa MySQL con Clever Cloud)
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        dialect: "mysql",
        logging: false,
      }
    );
  } else {
    // Fallback local sqlite file for development/demo if no MySQL creds present
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: 'database.sqlite',
      logging: false,
    });
    console.log('⚠️ DB credentials not found, using local SQLite file database.sqlite for development');
  }
}

module.exports = sequelize;


