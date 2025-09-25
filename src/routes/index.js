const express = require('express');
const router = express.Router();

// Rota GET principal
router.get('/', (req, res) => {
  res.send('Backend rodando via controller!');
});

// Aqui você pode adicionar outras rotas, por exemplo cadastro/login
// router.post('/user/register', ...)

module.exports = router;