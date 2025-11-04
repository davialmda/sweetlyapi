const Order = require("../models/order"); 

// Controller para criar pedido
exports.createOrder = async (req, res) => {
  try {
    const { item, quantity, address } = req.body; // pega dados enviados na requisição

    // validação básica dos campos obrigatórios
    if (!item || !quantity || !address) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }

    // força quantity a ser número inteiro
    const order = await Order.create({
      item,
      quantity: parseInt(quantity, 10),
      address,
    });

    // retorna mensagem de sucesso + dados do pedido criado
    res.status(201).json({ message: "Pedido criado com sucesso!", order });
  } catch (err) {
    // caso dê erro no processo, retorna 500 (erro interno)
    res.status(500).json({ error: err.message });
  }
};

// Controller para listar todos os pedidos
exports.getOrders = async (req, res) => {
  try {
    // busca todos os pedidos no banco (SELECT *)
    const orders = await Order.findAll();

    // retorna os pedidos como JSON
    res.json(orders);
  } catch (err) {
    // caso dê erro na consulta
    res.status(500).json({ error: err.message });
  }
};

// Controller para listar pedidos com filtros
exports.getOrders = async (req, res) => {
  try {
    const { status, date } = req.query; // pega filtros da query string
    const where = {}; // objeto de filtros dinâmicos

    // se o usuário passar status na URL -> /orders?status=pendente
    if (status) {
      where.status = status;
    }

    // se o usuário passar data na URL -> /orders?date=2025-10-06
    if (date) {
      // supondo que seu modelo Order tem um campo "createdAt"
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      where.createdAt = {
        [require("sequelize").Op.between]: [start, end],
      };
    }

    // busca no banco com filtros aplicados
    const orders = await Order.findAll({ where });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



