// Ponto de entrada do servidor Express.
const express = require("express");
const dotenv = require("dotenv");
const routes = require("./routes/index.js");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const sequelize = require("./config/database");

// Carrega variáveis do arquivo .env.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para ler JSON e dados de formulários com limites de segurança.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de segurança básico
app.use((req, res, next) => {
  // CORS
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Segurança básica
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Rate limiting básico
const requestCounts = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutos
  const maxRequests = 100;
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const record = requestCounts.get(ip);
    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count++;
      if (record.count > maxRequests) {
        return res.status(429).json({ error: 'Muitas requisições. Tente novamente em 15 minutos.' });
      }
    }
  }
  next();
});

// Organização das rotas principais.
app.use("/", routes);
app.use("/", userRoutes);
app.use("/orders", orderRoutes);

// Sincroniza os models e inicia o servidor HTTP.
sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco sincronizado com sucesso!");
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao sincronizar banco:', error);
    process.exit(1);
  });
