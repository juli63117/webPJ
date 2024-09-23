const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const OrderItem = require('./orderitem')(sequelize, DataTypes);
const Users = require('./users')(sequelize, DataTypes);
const Medicines = require('./medicines')(sequelize, DataTypes);
const OrderTables = require('./ordertables')(sequelize, DataTypes);

module.exports = {
    sequelize,
    OrderItem,
    Users,
    Medicines,
    OrderTables
};