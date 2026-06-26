const { DataTypes } = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nm_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    ds_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    ds_password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    vl_accessLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    bt_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    tableName: 'tb_users',
    timestamps: true,
    paranoid: true,
    createdAt: 'dt_createdAt',
    updatedAt: 'dt_updatedAt',
    deletedAt: 'dt_deletedAt'
});

module.exports = User;