// Rotas responsáveis por gerenciar logs de alterações.
const express = require("express");
const router = express.Router();
const { getLogs } = require("../controllers/logController");

// US10 - Rota para listar logs de alterações
router.get("/", getLogs);

module.exports = router;