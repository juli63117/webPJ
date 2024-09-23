const { DataTypes } = require('sequelize');
const sequelize = require('./db');
const Medicines = require('./medicines')(sequelize, DataTypes);
const OrderTables = require('./ordertables')(sequelize, DataTypes);

module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('orderitem', {
        medicineid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        orderid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        amount: {
            type: DataTypes.INTEGER
        }
    }, {
        timestamps: false,
        tableName: 'orderitems'
    });

    OrderItem.associate = () => {
        OrderItem.belongsTo(OrderTables, { foreignKey: 'orderid' });
        OrderItem.belongsTo(Medicines, { foreignKey: 'medicineid' });
    };

    OrderItem.updateOrderTotal = async (medicineid, orderid, amount) => {
        try {
            const medicine = await Medicines.findOne({
                where: { medicineid: medicineid }
            });

            const medicinePrice = medicine.price;

            if (medicinePrice == 0.01) {
                console.error('Лекарство с id:', medicineid, 'не найдено');
                return;
            }
            const [rowsAffected, [updatedOrder]] = await OrderTables.update(
                {
                    orderprice: sequelize.literal(`orderprice + (${medicinePrice} * ${amount})`)
                },
                {
                    where: { orderid: orderid }, returning: true
                }
            );
            const newOrderPrice = updatedOrder.orderprice;
            console.log('Добавлена запись в orderitem и обновлен orderprice');
            return newOrderPrice;
        } catch (error) {
            console.error('Ошибка при добавлении записи в orderitem и обновлении orderprice:', error);
        }
    }

    OrderItem.addOrderItem = async function (medicineid, orderid, amount) {
        try {
            await this.create({
                medicineid, orderid, amount
            });
            console.log('ORDERITEM.JS: Order item added successfully');

            const orderTotal = await this.updateOrderTotal(medicineid, orderid, amount);
            return orderTotal;
        } catch (error) {
            console.error('ORDERITEM.JS: Error adding order item:', error);
            return false;
        }
    }

    OrderItem.getMedicinesByTotalQuantityOrdered = async function () {
        try {
            const results = await this.findAll({
                attributes: ['medicineid', [sequelize.fn('SUM', sequelize.col('amount')), 'totalordered']],
                group: ['medicineid'],
                order: [[sequelize.literal('totalordered'), 'DESC']]
            });
            console.log('Medicines ordered by total amount:', results);
            return results;
        } catch (error) {
            console.error('Error getting medicines by total amount ordered:', error);
            return null;
        }
    } 

    OrderItem.deleteOrder = async function (orderid) {
        try {
            await OrderTables.destroy({ where: { orderid: orderid } });
            console.log('Order deleted successfully from ordertables');

            await this.destroy({ where: { orderid: orderid } });
            console.log('Order deleted successfully from orderitems');

            return OrderTables;
        } catch (error) {
            console.error('Error deleting order:', error);
            return false;
        }
    }

    return OrderItem;
};
