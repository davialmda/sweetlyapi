// src/models/log.js
const { DataTypes } = require('sequelize'); 
// OU 'mongoose' se você estiver usando MongoDB

// Assumindo que você usa Sequelize, adapte para sua ORM
module.exports = (sequelize) => {
    const Log = sequelize.define('Log', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: { // Quem fez a ação
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users', // Assumindo que sua tabela de usuários se chama 'users'
                key: 'id',
            }
        },
        action: { // Qual ação foi feita (Ex: 'LOGIN', 'ORDER_ACCEPTED', etc.)
            type: DataTypes.STRING,
            allowNull: false,
        },
        resourceType: { // Tipo de recurso afetado (Ex: 'ORDER', 'USER')
            type: DataTypes.STRING,
            allowNull: false,
        },
        resourceId: { // ID do recurso afetado (Ex: ID do pedido)
            type: DataTypes.INTEGER,
            allowNull: true, 
        },
        details: { // Detalhes adicionais (Ex: JSON com status antigo/novo)
            type: DataTypes.JSON, 
            allowNull: true,
        },
    }, {
        tableName: 'logs',
        timestamps: true, // Adiciona createdAt e updatedAt
    });

    // Se necessário, defina associações aqui
    
    return Log;
};