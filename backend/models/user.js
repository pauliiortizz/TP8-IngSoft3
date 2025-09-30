const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'users', // mismo nombre que en SQL
  timestamps: false   // desactiva si no usás createdAt/updatedAt
});

module.exports = User;