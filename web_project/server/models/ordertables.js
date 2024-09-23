module.exports = (sequelize, DataTypes) => {
    const OrderTables = sequelize.define('ordertables', {
        orderid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING
        },
        orderdate: {
            type: DataTypes.DATE
        },
        orderprice: {
            type: DataTypes.FLOAT
        },
        orderstatus: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false,
        tableName: 'ordertables'
    });

    OrderTables.associate = models => {
        OrderTables.hasMany(models.OrderItem, { foreignKey: 'orderid' });
    };

    OrderTables.getOrdersByUser = async function (username) {
        const orders = await this.findAll({
            where: {
                username: username
            }
        });
        return orders;
    };

    OrderTables.createOrder = async function (orderid, username) {
        const orderdate = new Date();
        const orderprice = 0.0;
        const orderstatus = 'in progress';

        try {
            const ordered = await this.create({
                orderid: orderid,
                username: username,
                orderdate: orderdate,
                orderprice: orderprice,
                orderstatus: orderstatus
            });
            console.log('ORDERTABLES.JS: Order created successfully');
            return ordered;
        } catch (error) {
            console.error('ORDERTABLES.JS: Error creating order:', error);
            return false;
        }
    }

    OrderTables.findOrder = async function (orderid) {
        try {
            const order = await OrderTables.findByPk(orderid);
            if (order) {
                console.log('ORDERTABLES.JS: Found order:', order);
                return true;
            } else {
                console.error('ORDERTABLES.JS: Order not found');
                return false;
            }
        } catch (error) {
            console.error('ORDERTABLES.JS: Error finding order:', error);
            return false;
        }
    }

    OrderTables.getMostActiveUser = async function () {
        try {
            const results = await this.findAll({
                attributes: ['username', [sequelize.fn('COUNT', sequelize.col('orderid')), 'totalordered']],
                group: ['username'],
                order: [[sequelize.literal('totalordered'), 'DESC']]
            });
            console.log('Users', results);
            return results;
        } catch (error) {
            console.error('Error getting users:', error);
            return null;
        }
    }  

    return OrderTables;
};
