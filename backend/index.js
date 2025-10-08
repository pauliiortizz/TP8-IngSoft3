/* const express = require("express");
const app = express();
const sequelize = require("./db");
const { DataTypes } = require("sequelize");

app.use(express.json());

/* -------------------------
   Modelo User
-------------------------- 
const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users", // mismo nombre que tu tabla en MySQL
    timestamps: false,  // desactiva createdAt/updatedAt si no las tenés
  }
);

/* -------------------------
   Endpoints
-------------------------- 

// Root
app.get("/", (req, res) => {
  res.send("🌐 Backend Azure corriendo OK");
});

// Ping de prueba
app.get("/ping", (req, res) => {
  console.log("📡 Endpoint /ping llamado");
  res.json({ message: "pong 🏓 desde Azure Backend!" });
});

// Nuevo endpoint: obtener todos los usuarios
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error("❌ Error al obtener usuarios:", err.message);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

/* -------------------------
   Servidor + conexión DB
-------------------------- 
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Servidor backend escuchando en el puerto ${port}`);
});

// Verificación de conexión a la DB en paralelo
(async () => {
  try {
    console.log("📌 Intentando conectar a la DB...");
    await sequelize.authenticate();
    console.log("✅ Conexión a la base de datos exitosa!");
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_NAME:", process.env.DB_NAME);
  } catch (err) {
    console.error("❌ Error al conectar a la DB:", err.message);
  }
})();

*/
const app = require("./app");
const sequelize = require("./db");

const port = process.env.PORT || 5000;

(async () => {
  try {
    // Ensure models/tables are created for local development (SQLite fallback)
    await sequelize.sync();
    app.listen(port, () => {
      console.log(`🚀 Servidor backend escuchando en el puerto ${port}`);
    });
  } catch (err) {
    console.error('❌ Error al sincronizar la base de datos:', err.message);
    process.exit(1);
  }
})();
