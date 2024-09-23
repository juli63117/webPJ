const OrderItem = require('./orderitem');
module.exports = (sequelize, DataTypes) => {
    const Medicines = sequelize.define('medicines', {
        medicineid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        price: {
            type: DataTypes.FLOAT
        }
    }, {
        timestamps: false,
        tableName: 'medicines'
    });

    Medicines.associate = () => {
        Medicines.hasMany(OrderItem, { foreignKey: 'medicineid' });
    };

    return Medicines;
};
