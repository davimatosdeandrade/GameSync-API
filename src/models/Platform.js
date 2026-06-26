const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Platform = db.define('Platform', {
    id_platform: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nm_name: {
        type: DataTypes.STRING(99),
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'tb_platforms',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = Platform;