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

const sequelize = new Sequelize(
  process.env.DB_NAME || "testdb",
  process.env.DB_USER || "root",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: process.env.DB_DIALECT || "sqlite", // 👈 usar sqlite en tests
    storage: ":memory:", // BD en RAM
    logging: false,
  }
);

module.exports = sequelize;

