const sequelize = require('./db');
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('users', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        password: DataTypes.STRING,
        status: DataTypes.STRING
    }, {
        timestamps: false,
        tableName: 'users'
    });
    return Users;
}