// Model Sequelize responsável por registrar logs de alterações.
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

// Define os campos persistidos na tabela Logs.
const Log = sequelize.define("Log", {
  action: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
      notEmpty: true,
    },
  },
  entity: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 50],
      notEmpty: true,
    },
  },
  entityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: "id",
    },
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// Relacionamento com usuário
Log.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = Log;