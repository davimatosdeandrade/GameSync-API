const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RequirementItem = db.define('RequirementItem', {
    id_requirement_item: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    id_requirement_set: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_requirement_sets',
            key: 'id_requirement_set',
            unique: 'compositeIndex',
        }
    },
    id_requirement_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_requirement_keys',
            key: 'id_requirement_key',
            unique: 'compositeIndex',
        }
    },
    ds_value: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
}, {
    tableName: 'tb_requirement_items',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
});

module.exports = RequirementItem;