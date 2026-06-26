const { DataTypes } = require('sequelize');
const db = require('../config/database');

const RequirementSet = db.define('RequirementSet', {
    id_requirement_set: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }, 
    id_product: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_products',
            key: 'id_product',
            unique: 'compositeIndex',
        }
    },
    id_system: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tb_systems',
            key: 'id_system',
            unique: 'compositeIndex',
        }
    },
    tp_level: {
        type: DataTypes.ENUM('minimum', 'recommended'),
        allowNull: false,
        unique: 'compositeIndex',
    }
}, {
    tableName: 'tb_requirement_sets',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt'
});

module.exports = RequirementSet;