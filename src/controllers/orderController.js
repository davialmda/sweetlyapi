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
