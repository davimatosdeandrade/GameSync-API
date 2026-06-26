const { DataTypes } = require('sequelize');
const db = require('../config/database');

const StorePlatform = db.define('StorePlatform', {
    id_store: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_stores',
            key: 'id_store',
        }
    },
    id_platform: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_platforms',
            key: 'id_platform'
        }
    }
}, {
    tableName: 'tb_store_platforms',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt'
});

module.exports = StorePlatform;