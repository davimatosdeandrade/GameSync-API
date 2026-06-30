const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ProductHighlight = db.define('ProductHighlight', {
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_products',
            key: 'id_product',
        }
    },
    id_highlight: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_highlights',
            key: 'id_highlight',
        }
    }
}, {
    tableName: 'tb_product_highlights',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt'
});

module.exports = ProductHighlight;