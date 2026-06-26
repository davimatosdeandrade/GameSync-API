const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RequirementKey = db.define('RequirementKey', {
    id_requirement_key: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nm_key: {
        type: DataTypes.STRING(99),
        allowNull: false,
        unique: true,
    }
}, {
    tableName: 'tb_requirement_keys',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
});

module.exports = RequirementKey;