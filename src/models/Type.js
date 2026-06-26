const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Type = db.define('Type', {
    id_type: {
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
    tableName: 'tb_types',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = Type;