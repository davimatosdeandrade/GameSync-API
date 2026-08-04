const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Product = db.define('Product', {
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nm_name: {
        type: DataTypes.STRING(199),
        allowNull: false,
        unique: true
    },
    ds_desc: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    id_type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_distributor: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    id_developer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dt_release: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
}, {
    tableName: 'tb_products',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = Product;