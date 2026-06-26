const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ProductCategory = db.define('ProductCategory', {
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_products',
            key: 'id_product',
        }
    },
    id_category: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_categories',
            key: 'id_category',
        }
    }
}, {
    tableName: 'tb_product_categories',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt'
});

module.exports = ProductCategory;