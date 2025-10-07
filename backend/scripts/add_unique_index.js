const sequelize = require('../db');

(async () => {
  try {
    console.log('Connecting to DB...');
    await sequelize.authenticate();
    console.log('Applying UNIQUE index on users.name');
    // Note: this SQL works for MySQL
    await sequelize.query('ALTER TABLE users ADD UNIQUE INDEX unique_name (name)');
    console.log(' UNIQUE index applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message || err);
    process.exit(1);
  } finally {
    try { await sequelize.close(); } catch (e) {}
  }
})();
