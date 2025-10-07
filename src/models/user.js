// Model Sequelize que persiste usuários da plataforma.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    // Nome público do usuário.
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Email único, validado pelo Sequelize antes de salvar.
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // Hash e salt gerados via PBKDF2 (armazenados separadamente).
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordSalt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Users",
  }
);

module.exports = User;
