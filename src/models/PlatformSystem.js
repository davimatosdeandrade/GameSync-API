const { DataTypes } = require('sequelize');
const db = require('../config/database');

const PlatformSystem = db.define('PlatformSystem', {
    id_platform: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_platforms',
            key: 'id_platform'
        }
    },
    id_system: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
            model: 'tb_systems',
            key: 'id_system'
        }
    }
}, {
    tableName: 'tb_platform_systems',
    timestamps: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt'
});

module.exports = PlatformSystem;