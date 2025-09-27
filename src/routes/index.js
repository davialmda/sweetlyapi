const express = require('express');
const router = express.Router();

// Rota GET principal
router.get('/', (req, res) => {
  res.send('Backend rodando via controller!');
});

module.exports = router;