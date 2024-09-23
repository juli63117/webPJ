const express = require('express');
const json = require('body-parser');
const { OrderTables, Users, Medicines, OrderItem } = require('./models');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(json());

app.get('/api/ordertables/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const OrderTable = await OrderTables.getOrdersByUser(username);
    res.json(OrderTable);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicines.findAll();
    res.json(medicines);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/ordertables/findorder/:orderid', async (req, res) => { // Используем :orderid для получения orderid из URL
  const orderid = req.params.orderid;
  try {
    const foundOrder = await OrderTables.findOrder(orderid);
    res.json(foundOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.post('/api/ordertables/createorder/:orderid/:username', async (req, res) => {
  const orderid = req.params.orderid;
  const username = req.params.username;
  try {
    const newOrder = await OrderTables.createOrder(orderid, username);
    res.json(newOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/orderitem/delorder/:orderid', async (req, res) => {
  const orderid = req.params.orderid;
  try {
    const deleting = await OrderItem.deleteOrder(orderid);
    res.json(deleting);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/api/orderitem', async (req, res) => {
  const { medicineid, orderid, amount } = req.body;
  try {
    const updateOrder = await OrderItem.addOrderItem(medicineid, orderid, amount);
    res.json(updateOrder);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/api/getMedicines', async(req, res) => {
  try{
    res.json(await OrderItem.getMedicinesByTotalQuantityOrdered());
  }catch(err){
    res.status(500).send(err.message);
  }
})

app.get('/api/getUsers', async(req, res) => {
  try{
    res.json(await OrderTables.getMostActiveUser());
  }catch(err){
    res.status(500).send(err.message);
  }
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await Users.findOne({ where: { username, password } });
  if (user) {
    res.status(200).json({ message: 'User authenticated', status: 200 });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Добавляем маршрут для получения статуса пользователя
app.get('/api/users/status', async (req, res) => {
  const { username } = req.query;
  const user = await Users.findOne({ where: { username } });
  if (user) {
    res.status(200).json({ status: user.status });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});