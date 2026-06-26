const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Offer = db.define('Offer', {
    id_offer: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_store: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    vl_price: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false
    }
}, {
    tableName: 'tb_offers',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = Offer;