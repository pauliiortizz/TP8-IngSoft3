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
const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.NODE_ENV === "test") {
  // 👉 Para tests en local (usa SQLite in-memory)
  sequelize = new Sequelize("sqlite::memory:", { logging: false });
} else {
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
}

module.exports = sequelize;

