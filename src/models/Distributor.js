const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Distributor = db.define('Distributor', {
    id_distributor: {
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
    tableName: 'tb_distributors',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = Distributor;