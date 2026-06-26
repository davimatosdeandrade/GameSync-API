const { DataTypes } = require('sequelize');
const db = require('../config/database');

const CartItem = db.define('CartItem', {
    id_cart: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_offer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    vl_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    tableName: 'tb_cart_items',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = CartItem;