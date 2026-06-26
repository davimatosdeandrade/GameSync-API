const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Code = db.define('Code', {
    id_code: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_offer: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ds_code: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    tp_status: {
        type: DataTypes.ENUM('available', 'sold'),
        defaultValue: 'available'
    }
}, {
    tableName: 'tb_codes',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = Code;