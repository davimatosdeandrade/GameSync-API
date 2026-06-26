const { DataTypes } = require('sequelize');
const db = require('../config/database');

const ProductLanguage = db.define('ProductLanguage', {
    id_product: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_products',
            key: 'id_product',
        }
    },
    id_language: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_languages',
            key: 'id_language',
        }
    },
    bt_audio: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    bt_interface: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    bt_subtitles: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    tableName: 'tb_product_languages',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt'
});

module.exports = ProductLanguage;