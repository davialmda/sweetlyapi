// Controller responsável por gerenciar logs de alterações.
const Log = require("../models/log");

// Função utilitária para criar logs
const createLog = async (action, entity, entityId, details, userId, ipAddress) => {
  try {
    await Log.create({
      action,
      entity,
      entityId,
      details: typeof details === 'object' ? JSON.stringify(details) : details,
      userId,
      ipAddress,
    });
  } catch (error) {
    console.error('Erro ao criar log:', error);
  }
};

// US10 - Lista todos os logs de alterações para o gerente
exports.getLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action, entity } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (action) where.action = action;
    if (entity) where.entity = entity;

    const logs = await Log.findAndCountAll({
      where,
      include: [
        {
          association: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.json({
      logs: logs.rows,
      pagination: {
        total: logs.count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(logs.count / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao listar logs:', error);
    return res.status(500).json({ error: "Erro ao listar logs" });
  }
};

// Exporta função utilitária para uso em outros controllers
module.exports = {
  getLogs,
  createLog,
};