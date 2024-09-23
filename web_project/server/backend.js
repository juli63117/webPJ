const { Sequelize, DataTypes } = require('sequelize');

class DatabaseConnector {
    constructor() {
        this.sequelize = new Sequelize('Health_in_a_basket', 'postgres', '12345', {
            host: 'localhost',
            port: 5432,
            dialect: 'postgres'
        });
        this.users = this.sequelize.define('users', {
            username: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            password: DataTypes.STRING,
            status: DataTypes.STRING
        },
            {
                timestamps: false
            }
        );
        this.medicines = this.sequelize.define('medicines', {
            medicineid: {
                type: DataTypes.INTEGER,
                primaryKey: true
            },
            price: {
                type: DataTypes.FLOAT
            }
        },
            {
                timestamps: false
            });
        this.ordertables = this.sequelize.define('ordertables', {
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
        },
            {
                timestamps: false
            });
        this.orderitems = this.sequelize.define('orderitems', {
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
        },
            {
                timestamps: false
            });
        this.ordertables.hasMany(this.orderitems, { foreignKey: 'orderid'});
        this.orderitems.belongsTo(this.ordertables, { foreignKey: 'orderid' });
        this.medicines.hasMany(this.orderitems, { foreignKey: 'medicineid' });
        this.orderitems.belongsTo(this.medicines, { foreignKey: 'medicineid' });
    }

    async connect() {
        try {
            await this.sequelize.authenticate();
            console.log('Connected to PostgreSQL database');
        } catch (error) {
            console.error('Error connecting to PostgreSQL database:', error);
        }
    }

    async disconnect() {
        try {
            await this.sequelize.close();
            console.log('Disconnected from PostgreSQL database');
        } catch (error) {
            console.error('Error disconnecting from PostgreSQL database:', error);
        }
    }

    async generateOrderID() {
        const min = 10;
        const max = 99;
        let newid = Math.floor(Math.random() * (max - min + 1)) + min;

        let isUnique = false;
        while (!isUnique) {
            const existingID = await this.ordertables.findOne({ where: { orderid: newid } });
            if (!existingID) {
                isUnique = true;
            }
        }
        return newid;
    }
    
    async createOrder(username) {
        let orderid = await this.generateOrderID();
        let orderdate = new Date();
        let orderprice = 0;
        let orderstatus = 'in progress';

        try {
            await this.ordertables.create({ orderid, username, orderdate, orderprice, orderstatus });
            console.log('Order created successfully');
            return true;
        } catch (error) {
            console.error('Error creating order:', error);
            return false;
        }
    }

    async deleteOrder(orderid) {
        try {
            await this.ordertables.destroy({ where: { orderid: orderid } });
            console.log('Order deleted successfully from ordertables');
            await this.orderitems.destroy({ where: { orderid: orderid } });
            console.log('Order deleted successfully from orderitems');
            return true;
        } catch (error) {
            console.error('Error deleting order:', error);
            return false;
        }
    }


    async addOrderItem(orderid, medicineid, amount) {
        try {
            // ���������� ������ � ��������� ������� � ��� ����������� � �����
            await this.orderitems.create({ orderid, medicineid, amount });
            console.log('Order item added successfully');
            // �������� ����� ��������� ������ ����� ���������� ������ ������
            await this.calculateAndUpdateOrderTotal(orderid);
            return true;
        } catch (error) {
            console.error('Error adding order item:', error);
            return false;
        }
    }

    // ����� ��� ���������� ����� ������ � ���������� ��������������� ������ � ������� ordertables
    async calculateAndUpdateOrderTotal(orderid) {
        try {
            // ������� ��� ������ �� ������� orderitems ��� ������� orderid
            const orderitems = await this.orderitems.findAll({
                where: { orderid: orderid },
                attributes: ['medicineid', 'amount']
            });

            // ��������� ����� ����� ������ �� ������ ��� � ���������� ������� �������� � orderitems
            let ordertotal = 0;
            for (const item of orderitems) {
                const medicine = await this.medicines.findByPk(item.medicineid);
                ordertotal += medicine.price * item.amount;
            }

            // ��������� ������ � ������� ordertables � ����� ����� ������ ������
            await this.ordertables.update({ orderprice: ordertotal }, { where: { orderid: orderid } });

            console.log(`Summary by orderid ${orderid} calculated and updated: ${ordertotal}`);
        } catch (error) {
            console.error('ERROR by calculating ordertotal:', error);
        }
    }

    async changeOrderStatus(orderid, newStatus) {
        try {
            const order = await this.ordertables.findByPk(orderid);
            if (order) {
                order.orderstatus = newStatus;
                await order.save();
                console.log('Order status changed successfully');
                return true;
            } else {
                console.error('Order not found');
                return false;
            }
        } catch (error) {
            console.error('Error changing order status:', error);
            return false;
        }
    }

    async findOrder(orderid) {
        try {
            const order = await this.ordertables.findByPk(orderid);
            if (order) {
                console.log('Found order:', order);
                return order;
            } else {
                console.error('Order not found');
                return null;
            }
        } catch (error) {
            console.error('Error finding order:', error);
            return null;
        }
    }

    async getMedicinesByTotalQuantityOrdered() {
        try {
            const results = await this.orderitems.findAll({
                attributes: ['medicineid', [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalordered']],
                group: ['medicineid'],
                order: [[Sequelize.literal('totalordered'), 'DESC']]
            });
            console.log('Medicines ordered by total amount:', results);
            return results;
        } catch (error) {
            console.error('Error getting medicines by total amount ordered:', error);
            return null;
        }
    }
    async getMedicinesByTotalProfit() {
        try {
            const results = await this.medicines.findAll({
                attributes: [
                    'medicineid',
                    [Sequelize.literal('SUM("orderitems"."amount" * "medicines"."price")'), 'totalprofit']
                ],
                include: [{
                    model: this.orderitems,
                    required: true,
                    attributes: [] // ���������, ��� �� ����� ��������� �������� �� orderitems
                }],
                group: ['medicines.medicineid'],
                order: [[Sequelize.literal('totalprofit'), 'DESC']]
            });
            console.log('Medicines ordered by total profit:', results);
            return results;
        } catch (error) {
            console.error('Error getting medicines by total profit:', error);
            return null;
        }
    }
}
// ������������� ���������� ��� ���������� �������
const dbConnector = new DatabaseConnector();

// ������������� ���������� � �� 
dbConnector.connect()
    .then(async () => {
        const queryResult = await dbConnector.deleteOrder('16');
        //console.log('Query result:', queryResult);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        dbConnector.disconnect();
    });
// �������� ������� ��� ����, ����� ������� ����� ����������
console.log('Press any key to continue...');
process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.on('data', process.exit.bind(process, 0));